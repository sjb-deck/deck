from rest_framework import serializers
from .models.ItemModels import Item
from .models.ItemExpiryModels import ItemExpiry
from datetime import datetime
from rest_framework.relations import PrimaryKeyRelatedField


class ItemSerializer(serializers.ModelSerializer):
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
