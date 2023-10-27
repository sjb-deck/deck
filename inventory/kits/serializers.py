from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from accounts.models import User, UserExtras

from .models import *


class KitSerializer(serializers.ModelSerializer):
    complete = serializers.SerializerMethodField()
    blueprint_name = serializers.SerializerMethodField()

    class Meta:
        model = Kit
        fields = ['id', 'name', 'status', 'content', 'blueprint_name', 'complete']

    @staticmethod
    def get_complete(obj):
        kit_content = obj.content
        blueprint_content = obj.blueprint.complete_content

        # Check if they have the same set of keys
        if set(kit_content.keys()) != set(blueprint_content.keys()):
            return "item-mismatch"

        # Compare individual fields
        for key, kit_value in kit_content.items():
            blueprint_value = blueprint_content.get(key)

            if kit_value > blueprint_value:
                return "overloaded"
            elif kit_value < blueprint_value:
                return "incomplete"

        # If the loop completes without returning, all fields are equal
        return "complete"

    @staticmethod
    def get_blueprint_name(obj):
        return obj.blueprint.name
