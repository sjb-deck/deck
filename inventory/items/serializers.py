from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from inventory.serializers import UserSerializer

from inventory.items.globals import action_choices, action_reasons
from inventory.items.models import ItemExpiry
from inventory.items.models import Item
from inventory.items.models.Order import LoanOrder
from inventory.items.models.Order import OrderItem
from inventory.items.models.Order import Order


class AddItemExpirySerializer(serializers.ModelSerializer):
    item = PrimaryKeyRelatedField(
        queryset=Item.objects.filter(expiry_dates__expiry_date__isnull=False).distinct()
    )
    expiry_date = serializers.DateField()
    quantity = serializers.IntegerField(min_value=1)

    class Meta:
        model = ItemExpiry
        fields = ["item", "expiry_date", "quantity"]

    def validate(self, attrs):
        item = attrs["item"]
        expiry_date = attrs["expiry_date"]

        # check if expiry date is unique
        if ItemExpiry.objects.filter(item=item, expiry_date=expiry_date).exists():
            raise serializers.ValidationError(
                {"expiry_date": "Expiry date must be unique."}
            )

        return super().validate(attrs)

    def create(self, validated_data):
        item_id = validated_data["item"]
        quantity = validated_data["quantity"]
        item = Item.objects.get(id=item_id.id)
        item.total_quantity += quantity
        item.save()
        return super().create(validated_data)


class ItemInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


class ItemExpirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemExpiry
        fields = ["id", "expiry_date", "quantity", "archived"]


class ItemExpiryWithItemSerializer(serializers.ModelSerializer):
    item = ItemInfoSerializer(required=False)

    class Meta:
        model = ItemExpiry
        fields = ["id", "expiry_date", "quantity", "archived", "item"]


class ItemSerializer(serializers.ModelSerializer):
    expiry_dates = ItemExpirySerializer(many=True)

    class Meta:
        model = Item
        fields = "__all__"

    def validate(self, data):
        expiry_items = data.get("expiry_dates")

        # ensure that at least an expiry item is provided
        if len(expiry_items) == 0:
            raise serializers.ValidationError(
                {"expiry_dates": "At least one expiry date must be provided."}
            )

        # ensure that the expiry dates are unique
        expiry_dates = [item["expiry_date"] for item in expiry_items]
        if len(expiry_dates) != len(set(expiry_dates)):
            raise serializers.ValidationError(
                {"expiry_dates": "Expiry dates must be unique."}
            )

        # ensure that the item name is unique
        if Item.objects.filter(name=data.get("name")).exists():
            raise serializers.ValidationError(
                {"name": "Item with this name already exists."}
            )

        return data

    def create(self, validated_data):
        expiry_data = validated_data.pop("expiry_dates")
        item = Item.objects.create(**validated_data)
        for data in expiry_data:
            ItemExpiry.objects.create(item=item, **data)
        return item


class OrderItemSerializer(serializers.ModelSerializer):
    item_expiry = ItemExpiryWithItemSerializer(read_only=True)
    item_expiry_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "item_expiry",
            "item_expiry_id",
            "ordered_quantity",
            "returned_quantity",
        ]

    def validate_item_expiry_id(self, value):
        """
        Check that item_expiry_id exists.
        """
        if not ItemExpiry.objects.filter(id=value).exists():
            raise serializers.ValidationError("Invalid item_expiry_id provided.")
        return value


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    order_items = OrderItemSerializer(many=True)
    loanee_name = serializers.CharField(source="loanorder.loanee_name", required=False)
    due_date = serializers.DateTimeField(source="loanorder.due_date", required=False)
    return_date = serializers.DateTimeField(
        source="loanorder.return_date", read_only=True
    )
    loan_active = serializers.BooleanField(
        source="loanorder.loan_active", read_only=True
    )

    class Meta:
        model = Order
        fields = "__all__"

    def validate(self, data):
        reason = data.get("reason")
        action = data.get("action")
        loan_order = data.get("loanorder", {})

        # check that the type is either withdraw or loan
        if action not in [action[0] for action in action_choices]:
            raise serializers.ValidationError(
                {"action": "Invalid action provided for order."}
            )

        # check if the reason provided is one of the values we expect
        if reason not in [reason[0] for reason in action_reasons]:
            raise serializers.ValidationError(
                {"reason": "Invalid reason provided for order."}
            )

        # check that the loanee name and due date is provided for loan orders
        if reason == "loan":
            if "loanee_name" not in loan_order:
                raise serializers.ValidationError(
                    {"loanee_name": "This field is required for loans."}
                )
            if "due_date" not in loan_order:
                raise serializers.ValidationError(
                    {"due_date": "This field is required for loans."}
                )

        # check if there is sufficient quantity for each item if withdraw
        if action == "Withdraw":
            for item in data["order_items"]:
                item_expiry = ItemExpiry.objects.get(id=item["item_expiry_id"])
                if item["ordered_quantity"] > item_expiry.quantity:
                    raise serializers.ValidationError(
                        {
                            "order_items": f"Insufficient quantity for {item_expiry.item.name} with expiry date {item_expiry.expiry_date}"
                        }
                    )

        return data

    def create(self, validated_data):
        order_items_data = validated_data.pop("order_items")
        loan_order_data = validated_data.pop("loanorder", None)
        validated_data["user"] = self.context["request"].user

        if validated_data.get("reason") == "loan":
            order = LoanOrder.objects.create(**loan_order_data, **validated_data)
        else:
            order = Order.objects.create(**validated_data)

        for order_item_data in order_items_data:
            OrderItem.objects.create(order=order, **order_item_data)

        return order

    def to_representation(self, instance):
        response = super().to_representation(instance)
        return {key: value for key, value in response.items() if value is not None}


class LoanItemReturnSerializer(serializers.ModelSerializer):
    order_item_id = serializers.IntegerField(required=True, write_only=True)
    returned_quantity = serializers.IntegerField(required=True, min_value=0)

    class Meta:
        model = OrderItem
        fields = ["order_item_id", "returned_quantity"]


class LoanReturnSerializer(serializers.Serializer):
    order_id = serializers.IntegerField(required=True)
    items = LoanItemReturnSerializer(many=True, required=True)

    def validate(self, data):
        try:
            order = Order.objects.get(id=data["order_id"])
        except Order.DoesNotExist:
            raise serializers.ValidationError(
                {"order_id": "Order with this ID does not exist."}
            )

        if not order.reason == "loan" or not order.loanorder.loan_active:
            raise serializers.ValidationError(
                {"order_id": "This loan has already been returned."}
            )

        if not data["items"]:
            raise serializers.ValidationError({"items": "Items list cannot be empty."})

        for item in data["items"]:
            try:
                order_item = order.order_items.get(
                    item_expiry=ItemExpiry.objects.get(id=item["order_item_id"])
                )
            except OrderItem.DoesNotExist:
                raise serializers.ValidationError(
                    {"items": "Order item with this ID does not exist."}
                )
            if item["returned_quantity"] > order_item.ordered_quantity:
                raise serializers.ValidationError(
                    {
                        "items": f"Returned quantity cannot be greater than ordered quantity for {order_item.item_expiry.item.name} with expiry date {order_item.item_expiry.expiry_date}"
                    }
                )
            
        

        return data

    def create(self, validated_data):
        items = validated_data.pop("items")
        order_id = validated_data.pop("order_id")
        try:
            loan_order = LoanOrder.objects.get(id=order_id)
            loan_order.loan_active = False
            loan_order.return_date = timezone.now()
            loan_order.save()

            for item in items:
                order_item = loan_order.order_items.get(
                    item_expiry=ItemExpiry.objects.get(id=item["order_item_id"])
                )
                order_item.returned_quantity = item["returned_quantity"]
                order_item.save()

                order_item.item_expiry.deposit(item["returned_quantity"])

            # for items that are not returned, we set returned_quantity to 0
            for order_item in loan_order.order_items.filter(returned_quantity=None):
                order_item.returned_quantity = 0
                order_item.save()

            return loan_order

        except Exception as e:
            raise serializers.ValidationError(str(e))
