from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry, Order, OrderItem
from inventory.kits.models import Blueprint, Kit, History
from rest_framework_simplejwt.tokens import RefreshToken


class TestApiRetireKitViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)

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

    def test_retire_kit(self):
        order_count = Order.objects.count()
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

        # Check that an order is created
        self.assertEqual(Order.objects.count(), order_count + 1)
        order = Order.objects.get(id=response.data["order_id"])
        self.assertEqual(order.reason, "kit_retire")
        order_items = OrderItem.objects.filter(order=order)
        self.assertEqual(order_items.count(), 3)
        items_ordered = [
            self.item_expiry1_id,
            self.item_expiry2_id,
            self.item_no_expiry_id,
        ]
        for order_item in order_items:
            self.assertEqual(order_item.item_expiry.id, items_ordered.pop(0))
            self.assertEqual(order_item.ordered_quantity, 5)

    def test_retire_kit_with_invalid_kit_id(self):
        response = self.client.get(reverse("retire_kit", args=[0]), None, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit matching query does not exist.")

    def tearDown(self):
        History.objects.all().delete()
        Kit.objects.all().delete()
        Blueprint.objects.all().delete()
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        ItemExpiry.objects.all().delete()
        Item.objects.all().delete()
        return super().tearDown()
