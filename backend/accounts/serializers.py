from accounts.models import User, UserExtras
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserExtrasSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserExtras
        fields = ["profile_pic", "role", "name"]


class UserSerializer(serializers.ModelSerializer):
    extras = UserExtrasSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "extras"]


class TokenObtainPairSerializerWithUserData(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
