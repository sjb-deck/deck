from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry, Order
from inventory.kits.models import Blueprint, Kit, History


class TestApiRetireKitViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.client.login(username="testuser", password="testpass")
        UserExtras.objects.create(
            user=self.user,
            profile_pic="test_pic.jpg",
            role="test_role",
            name="test_name",
        )
        self.clear_relevant_models()
        self.create_items()
        self.compressed_blueprint_content = [
            {"item_id": self.item.id, "quantity": 10},
            {"item_id": self.item_no_expiry.id, "quantity": 5},
        ]
        self.create_blueprint()
        self.item_expiry1_id = self.itemExpiry1.id
        self.item_expiry2_id = self.itemExpiry2.id
        self.item_no_expiry_id = self.itemExpiry_no_expiry.id
        self.blueprint_id = self.blueprint.id
        self.kit_content = [
            {"item_expiry_id": self.item_expiry1_id, "quantity": 5},
            {"item_expiry_id": self.item_expiry2_id, "quantity": 5},
            {"item_expiry_id": self.item_no_expiry_id, "quantity": 5},
        ]
        self.create_kit()
        self.kit_id = self.kit.id

    def create_kit(self):
        self.kit = Kit.objects.create(
            name="Test Kit",
            blueprint=self.blueprint,
            status="READY",
            content=self.kit_content,
        )

    def create_blueprint(self):
        self.blueprint = Blueprint.objects.create(
            name="Test Blueprint",
            complete_content=self.compressed_blueprint_content,
        )

    def create_items(self):
        self.item = Item.objects.create(
            name="Another Item",
            type="General",
            unit="units",
            total_quantity=100,
            min_quantity=10,
            is_opened=False,
        )
        self.itemExpiry1 = self.item.expiry_dates.create(
            expiry_date="2023-12-31", quantity=50, archived=False
        )
        self.itemExpiry2 = self.item.expiry_dates.create(
            expiry_date="2024-12-31", quantity=50, archived=False
        )

        self.item_no_expiry = Item.objects.create(
            name="No Expiry Item",
            type="General",
            unit="units",
            total_quantity=100,
            min_quantity=10,
            is_opened=False,
        )
        self.itemExpiry_no_expiry = self.item_no_expiry.expiry_dates.create(
            quantity=50, archived=False
        )

    def clear_relevant_models(self):
        History.objects.all().delete()
        Kit.objects.all().delete()
        Blueprint.objects.all().delete()
        Item.objects.all().delete()

    def test_retire_kit(self):
        response = self.client.get(
            reverse("retire_kit", args=[self.kit_id]), None, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["message"], "Kit retired and contents deposited successfully!"
        )

        # check that kit is retired
        kit = Kit.objects.get(id=self.kit_id)
        self.assertEqual(kit.status, "RETIRED")

        # check that history is created
        history = History.objects.get(kit=kit)
        self.assertEqual(history.type, "RETIREMENT")

        # check that items are deposited
        item_expiry = ItemExpiry.objects.get(id=self.item_expiry1_id)
        self.assertEqual(item_expiry.quantity, 55)
        item_expiry = ItemExpiry.objects.get(id=self.item_expiry2_id)
        self.assertEqual(item_expiry.quantity, 55)
        item_expiry = ItemExpiry.objects.get(id=self.item_no_expiry_id)
        self.assertEqual(item_expiry.quantity, 55)

        # check that order is created
        order = Order.objects.all()
        self.assertEqual(order[0].reason, "kit_retire")

    def test_retire_kit_with_invalid_kit_id(self):
        response = self.client.get(reverse("retire_kit", args=[0]), None, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit matching query does not exist.")

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
