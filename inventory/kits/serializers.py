from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField
from accounts.models import User, UserExtras
from inventory.items.serializers import ItemExpiryWithItemSerializer, UserSerializer

from .models import *
from .views_utils import compress_content
from ..items.models import Item, ItemExpiry


class KitContentSerializer(serializers.Serializer):
    item_expiry_id = serializers.IntegerField()
    quantity = serializers.IntegerField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["item_expiry"] = ItemExpiryWithItemSerializer(
            ItemExpiry.objects.get(id=data.get("item_expiry_id"))
        ).data
        return data


class KitSerializer(serializers.ModelSerializer):
    complete = serializers.SerializerMethodField()
    blueprint_name = serializers.SerializerMethodField()
    blueprint_id = PrimaryKeyRelatedField(
        queryset=Blueprint.objects.all(), source="blueprint"
    )
    content = KitContentSerializer(many=True)

    class Meta:
        model = Kit
        fields = [
            "id",
            "name",
            "status",
            "content",
            "blueprint_name",
            "blueprint_id",
            "complete",
        ]

    @staticmethod
    def get_complete(obj):
        if obj.content is None:
            return "incomplete"
        kit_content = compress_content(obj.content)  # sorted by item_id
        blueprint_content = sorted(
            obj.blueprint.complete_content, key=lambda x: x["item_id"]
        )

        if len(kit_content) > len(blueprint_content):
            return "overloaded"

        if len(kit_content) < len(blueprint_content):
            return "incomplete"

        # assume now there are equal number of items in kit and blueprint and they are sorted
        for kit_item, blueprint_item in zip(kit_content, blueprint_content):
            if kit_item["item_id"] != blueprint_item["item_id"]:
                return "item-mismatch"  # should never happen since we sorted by item_id and checked length
            if kit_item["quantity"] > blueprint_item["quantity"]:
                return "overloaded"
            if kit_item["quantity"] < blueprint_item["quantity"]:
                return "incomplete"

        return "complete"

    @staticmethod
    def get_blueprint_name(obj):
        return obj.blueprint.name


class BlueprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blueprint
        exclude = ("archived",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        complete_content = data.get("complete_content", [])
        for item_data in complete_content:
            item_id = item_data.get("item_id")
            if item_id is not None:
                try:
                    item = Item.objects.get(id=item_id)
                    item_data["name"] = item.name
                except Item.DoesNotExist:
                    item_data["name"] = None
            else:
                item_data["name"] = None
        return data


class HistorySerializer(serializers.ModelSerializer):
    loan_info = serializers.SerializerMethodField()
    person = UserSerializer(read_only=True)
    snapshot = KitContentSerializer(many=True)
    kit_name = serializers.SerializerMethodField()

    class Meta:
        model = History
        fields = "__all__"

    @staticmethod
    def get_loan_info(obj):
        loan_history = getattr(obj, "loanhistory", None)
        if loan_history:
            return {
                "loanee_name": loan_history.loanee_name,
                "due_date": loan_history.due_date,
                "return_date": loan_history.return_date,
            }
        return None

    def get_kit_name(self, obj):
        return obj.kit.name

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if ret.get("loan_info") is None:
            ret.pop("loan_info", None)
        return ret
