from datetime import datetime

from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from accounts.models import User, UserExtras

from .globals import action_choices
from .models.Item.ItemExpiryModels import ItemExpiry
from .models.Item.ItemModels import Item
from .models.Order.LoanOrderModels import LoanOrder
from .models.Order.OrderItemModels import OrderItem
from .models.Order.OrderModels import Order


class UserExtrasSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExtras
        fields = ["profile_pic", "role", "name"]


class UserSerializer(serializers.ModelSerializer):
    extras = UserExtrasSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "extras"]


class AddItemExpirySerializer(serializers.ModelSerializer):
    item = PrimaryKeyRelatedField(
        queryset=Item.objects.filter(expiry_dates__expiry_date__isnull=False).distinct()
    )
    expiry_date = serializers.DateField()
    quantity = serializers.IntegerField(min_value=1)

    class Meta:
        model = ItemExpiry
        fields = ["item", "expiry_date", "quantity"]


class ItemInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"


class ItemExpirySerializer(serializers.ModelSerializer):
    item = ItemInfoSerializer()

    class Meta:
        model = ItemExpiry
        fields = ["id", "expiry_date", "quantity", "archived", "item"]


class ItemSerializer(serializers.ModelSerializer):
    expiry_dates = ItemExpirySerializer(many=True)

    class Meta:
        model = Item
        fields = "__all__"

    def create(self, validated_data):
        expiry_data = validated_data.pop("expiry_dates")
        item = Item.objects.create(**validated_data)
        for data in expiry_data:
            ItemExpiry.objects.create(item=item, **data)
        return item


class OrderItemSerializer(serializers.ModelSerializer):
    item_expiry = ItemExpirySerializer(read_only=True)
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


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    order_items = OrderItemSerializer(many=True)
    loanee_name = serializers.CharField(source="loanorder.loanee_name", required=False)
    return_date = serializers.DateTimeField(
        source="loanorder.return_date", required=False
    )
    loan_active = serializers.BooleanField(
        source="loanorder.loan_active", read_only=True
    )

    class Meta:
        model = Order
        fields = "__all__"

    def validate(self, data):
        reason = data.get("reason")
        loan_order = data.get("loanorder", {})

        if reason == "loan":
            if "loanee_name" not in loan_order:
                raise serializers.ValidationError(
                    {"loanee_name": "This field is required for loans."}
                )
            if "return_date" not in loan_order:
                raise serializers.ValidationError(
                    {"return_date": "This field is required for loans."}
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

        if not data["items"]:
            raise serializers.ValidationError({"items": "Items list cannot be empty."})

        for item in data["items"]:
            try:
                order_item = order.order_items.get(id=item["order_item_id"])
            except OrderItem.DoesNotExist:
                raise serializers.ValidationError(
                    {"items": "Order item with this ID does not exist."}
                )

        return super().validate(data)

    def create(self, validated_data):
        items = validated_data.pop("items")
        order_id = validated_data.pop("order_id")

        try:
            loan_order = LoanOrder.objects.get(id=order_id)
            loan_order.loan_active = False
            loan_order.return_date = timezone.now()
            loan_order.save()

            for item in items:
                order_item = loan_order.order_items.get(id=item["order_item_id"])
                order_item.returned_quantity = item["returned_quantity"]
                order_item.save()

                order_item.item_expiry.deposit(item["returned_quantity"])

            return loan_order

        except Exception as e:
            raise serializers.ValidationError(str(e))
