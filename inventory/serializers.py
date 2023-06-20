from rest_framework import serializers
from .models.ItemModels import Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = "__all__"
