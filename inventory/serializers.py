from rest_framework import serializers
from .models.Item.ItemModels import Item
from .models.Item.ItemExpiryModels import ItemExpiry
from .models.Order.OrderModels import Order
from .models.Order.OrderItemModels import OrderItem
from .models.Order.LoanOrderModels import LoanOrder
from datetime import datetime
from accounts.models import UserExtras, User
from rest_framework.relations import PrimaryKeyRelatedField
from .globals import action_choices


class ItemExpiryDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemExpiry
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    expirydates = ItemExpiryDateSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = "__all__"


class ItemExpirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemExpiry
        fields = ["expirydate", "quantityopen", "quantityunopened", "item", "archived"]


class ExpiryItemSerializer(serializers.Serializer):
    item_fields = ItemSerializer()
    expiry = serializers.ListField(child=serializers.DictField())
    sum_total_quantityopen = serializers.SerializerMethodField()
    sum_total_quantityunopened = serializers.SerializerMethodField()

    def create(self, validated_data):
        item_fields_data = validated_data.pop("item_fields")
        expiry_data = validated_data.pop("expiry")

        # Create the item object
        item_instance = Item.objects.create(**item_fields_data)
        for expiry_item in expiry_data:
            expiry_item["item"] = item_instance.pk  # Associate with item primary key
            expiry_item["archived"] = False
            serializer = ItemExpirySerializer(data=expiry_item)
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()

        return item_instance  # Return the item object only, not the expiry objects since all not required anyway


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UserExtrasSerializer(serializers.ModelSerializer):
    user: UserSerializer(read_only=True)

    class Meta:
        model = UserExtras
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["item_expiry", "opened_quantity", "unopened_quantity"]


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, required=False)
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ["action", "reason", "date", "user", "other_info", "order_items"]

    def create(self, validated_data):
        order_items_data = validated_data.pop("order_items")

        validated_data["user"] = self.context["request"].user
        order = Order.objects.create(**validated_data)

        for order_item_data in order_items_data:
            OrderItem.objects.create(order=order, **order_item_data)

        return order


class LoanOrderSerializer(OrderSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True, required=False)
    order_items = OrderItemSerializer(many=True)

    class Meta:
        model = LoanOrder
        fields = [
            "action",
            "reason",
            "date",
            "user",
            "other_info",
            "order_items",
            "loanee_name",
            "return_date",
            "loan_active",
        ]

    def create(self, validated_data):
        order_items_data = validated_data.pop("order_items")

        validated_data["user"] = self.context["request"].user
        order = LoanOrder.objects.create(**validated_data)

        for order_item_data in order_items_data:
            OrderItem.objects.create(order=order, **order_item_data)

        return order


class ActionTypeSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=action_choices)
    reason = serializers.CharField(required=True, allow_blank=False)
