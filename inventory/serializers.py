from rest_framework import serializers
from .models import Item, ItemExpiry
from accounts.models import UserExtras, User


class ItemExpiryDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemExpiry
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    expirydates = ItemExpiryDateSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UserExtrasSerializer(serializers.ModelSerializer):
    user: UserSerializer(read_only=True)

    class Meta:
        model = UserExtras
        fields = "__all__"
