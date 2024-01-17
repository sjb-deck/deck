from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry, Order, OrderItem
from inventory.kits.models import Blueprint, Kit, History


class TestApiRestockKitViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.client.login(username="testuser", password="testpass")
        self.clear_relevant_models()
        self.create_items()
        self.compressed_blueprint_content = [
            {"item_id": self.item.id, "quantity": 10},
            {"item_id": self.item_no_expiry.id, "quantity": 5},
        ]
        self.create_blueprint()
        self.item_expiry1_id = self.itemExpiry1.id
        self.item_expiry2_id = self.itemExpiry2.id
        self.item_expiry3_id = self.itemExpiry3.id
        self.item_no_expiry_id = self.itemExpiry_no_expiry.id
        self.blueprint_id = self.blueprint.id
        self.kit_content = [
            {"item_expiry_id": self.item_expiry1_id, "quantity": 5},
            {"item_expiry_id": self.item_expiry2_id, "quantity": 5},
            {"item_expiry_id": self.item_no_expiry_id, "quantity": 5},
        ]
        self.incomplete_kit_content = [
            {"item_expiry_id": self.item_expiry1_id, "quantity": 1},
            {"item_expiry_id": self.item_expiry2_id, "quantity": 1},
            {"item_expiry_id": self.item_no_expiry_id, "quantity": 1},
        ]
        self.create_kits()
        self.kit_id = self.kit.id
        self.incomplete_kit_id = self.incomplete_kit.id
        self.url = reverse("restock_kit")
        self.request = {
            "kit_id": self.incomplete_kit_id,
            "content": [
                {"item_expiry_id": self.item_expiry1_id, "quantity": 4},
                {"item_expiry_id": self.item_expiry2_id, "quantity": 4},
                {"item_expiry_id": self.item_no_expiry_id, "quantity": 4},
            ],
        }

    def create_kits(self):
        self.kit = Kit.objects.create(
            name="Test Kit",
            blueprint=self.blueprint,
            status="READY",
            content=self.kit_content,
        )

        self.incomplete_kit = Kit.objects.create(
            name="Incomplete Kit",
            blueprint=self.blueprint,
            status="READY",
            content=self.incomplete_kit_content,
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
            total_quantity=150,
            min_quantity=10,
            is_opened=False,
        )
        self.itemExpiry1 = self.item.expiry_dates.create(
            expiry_date="2023-12-31", quantity=50, archived=False
        )
        self.itemExpiry2 = self.item.expiry_dates.create(
            expiry_date="2024-12-31", quantity=50, archived=False
        )
        self.itemExpiry3 = self.item.expiry_dates.create(
            expiry_date="2025-12-31", quantity=50, archived=False
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

    def test_restock_kit_complete_kit(self):
        order_count = Order.objects.count()

        # Test that restock_kit returns 400 when trying to restock a complete kit
        self.request["kit_id"] = self.kit_id
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Added content is more than expected."
        )
        self.request["kit_id"] = self.incomplete_kit_id

        # Check that the kit is still complete
        kit = Kit.objects.get(id=self.kit_id)
        self.assertEqual(kit.content[0]["quantity"], 5)

        # Check no order is created
        self.assertEqual(Order.objects.count(), order_count)

    def test_restock_kit_incomplete_kit(self):
        order_count = Order.objects.count()
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit restocked successfully!")

        # Check that the kit is now complete
        kit = Kit.objects.get(id=self.incomplete_kit_id)
        self.assertEqual(kit.content[0]["quantity"], 5)

        # Check items are deducted from inventory
        item_expiry1 = ItemExpiry.objects.get(id=self.item_expiry1_id)
        self.assertEqual(item_expiry1.quantity, 46)
        item_expiry2 = ItemExpiry.objects.get(id=self.item_expiry2_id)
        self.assertEqual(item_expiry2.quantity, 46)
        item_expiry_no_expiry = ItemExpiry.objects.get(id=self.item_no_expiry_id)
        self.assertEqual(item_expiry_no_expiry.quantity, 46)

        # Check that an order is created
        self.assertEqual(Order.objects.count(), order_count + 1)
        order = Order.objects.get(id=response.data["order_id"])
        self.assertEqual(order.reason, "kit_restock")
        order_items = OrderItem.objects.filter(order=order)
        self.assertEqual(order_items.count(), 3)
        items_ordered = [
            self.item_expiry1_id,
            self.item_expiry2_id,
            self.item_no_expiry_id,
        ]
        for order_item in order_items:
            self.assertEqual(order_item.item_expiry.id, items_ordered.pop(0))
            self.assertEqual(order_item.ordered_quantity, 4)

    def test_restock_kit_under_restock(self):
        order_count = Order.objects.count()
        self.request["content"][0]["quantity"] = 1
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit restocked successfully!")
        self.request["content"][0]["quantity"] = 4

        # Check that the kit is still incomplete
        kit = Kit.objects.get(id=self.incomplete_kit_id)
        self.assertEqual(kit.content[0]["quantity"], 2)

        # Check items are deducted from inventory
        item_expiry1 = ItemExpiry.objects.get(id=self.item_expiry1_id)
        self.assertEqual(item_expiry1.quantity, 49)
        item_expiry2 = ItemExpiry.objects.get(id=self.item_expiry2_id)
        self.assertEqual(item_expiry2.quantity, 46)
        item_expiry_no_expiry = ItemExpiry.objects.get(id=self.item_no_expiry_id)
        self.assertEqual(item_expiry_no_expiry.quantity, 46)

        # Check that an order is created
        self.assertEqual(Order.objects.count(), order_count + 1)
        order = Order.objects.get(id=response.data["order_id"])
        self.assertEqual(order.reason, "kit_restock")
        order_items = OrderItem.objects.filter(order=order)
        self.assertEqual(order_items.count(), 3)
        items_ordered = [
            self.item_expiry1_id,
            self.item_expiry2_id,
            self.item_no_expiry_id,
        ]
        temp_index = 0
        for order_item in order_items:
            self.assertEqual(order_item.item_expiry.id, items_ordered.pop(0))
            assert_value = 1 if temp_index == 0 else 4
            self.assertEqual(order_item.ordered_quantity, assert_value)
            temp_index += 1

    def test_restock_kit_over_restock(self):
        order_count = Order.objects.count()
        self.request["content"][0]["quantity"] = 10
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Added content is more than expected."
        )
        self.request["content"][0]["quantity"] = 4

        # Check that the kit is still incomplete
        kit = Kit.objects.get(id=self.incomplete_kit_id)
        self.assertEqual(kit.content[0]["quantity"], 1)

    def test_restock_kit_invalid_kit_id(self):
        self.request["kit_id"] = 999
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit matching query does not exist.")
        self.request["kit_id"] = self.incomplete_kit_id

    def test_restock_kit_invalid_item_expiry_id(self):
        item_expiry_id = self.request["content"][0]["item_expiry_id"]
        self.request["content"][0]["item_expiry_id"] = 999
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "ItemExpiry matching query does not exist."
        )
        self.request["content"][0]["item_expiry_id"] = item_expiry_id

    def test_restock_kit_invalid_quantity(self):
        self.request["content"][0]["quantity"] = -1
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Cannot withdraw negative quantity")
        self.request["content"][0]["quantity"] = 4

    def test_restock_kit_new_item_expiry(self):
        # Check that restocking with another item expiry of the same item works
        content = self.request["content"]
        self.request["content"].append(
            {"item_expiry_id": self.item_expiry3_id, "quantity": 4}
        )
        self.request["content"].pop(0)
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit restocked successfully!")
        self.request["content"] = content

    def test_restock_kit_new_item_expiry_overload(self):
        content = self.request["content"]
        self.request["content"].append(
            {"item_expiry_id": self.item_expiry3_id, "quantity": 4}
        )
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Added content is more than expected."
        )
        self.request["content"] = content

    def test_restock_kit_missing_content_fields(self):
        content = self.request["content"]
        self.request["content"][0].pop("quantity")
        self.request["content"][1].pop("quantity")
        self.request["content"][2].pop("quantity")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "'quantity'")
        self.request["content"] = content

        self.request["content"][0].pop("item_expiry_id")
        self.request["content"][1].pop("item_expiry_id")
        self.request["content"][2].pop("item_expiry_id")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "'item_expiry_id'")
        self.request["content"] = content

    def test_restock_kit_missing_fields(self):
        self.request.pop("kit_id")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit matching query does not exist.")
        self.request["kit_id"] = self.incomplete_kit_id

        content = self.request.pop("content")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "'NoneType' object is not iterable")
        self.request["content"] = content

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
