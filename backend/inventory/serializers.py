from accounts.models import User, UserExtras
from rest_framework import serializers


class UserExtrasSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExtras
        fields = ["profile_pic", "role", "name"]


class UserSerializer(serializers.ModelSerializer):
    extras = UserExtrasSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "extras"]
