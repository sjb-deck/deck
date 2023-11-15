from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry, Order, OrderItem
from inventory.kits.models import Blueprint, Kit, History


class TestApiAddAddKitViews(TestCase):
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
        self.url = reverse("add_kit")
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
        self.request = {
            "blueprint": self.blueprint_id,
            "name": "Test Kit",
            "content": [
                {"item_expiry_id": self.item_expiry1_id, "quantity": 5},
                {"item_expiry_id": self.item_expiry2_id, "quantity": 5},
                {"item_expiry_id": self.item_no_expiry_id, "quantity": 5},
            ],
        }

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

    def test_create_new_kit(self):
        order_count = Order.objects.count()
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 201)

        # check that kit is created
        kit = Kit.objects.get(id=response.data["kit_id"])
        self.assertEqual(kit.name, "Test Kit")
        self.assertEqual(kit.content, self.request["content"])

        # check that history is created
        history = History.objects.all()
        self.assertEqual(history[0].type, "CREATION")

        # check that item expiry quantities are updated
        item_expiry = ItemExpiry.objects.get(id=self.item_expiry1_id)
        self.assertEqual(item_expiry.quantity, 45)
        item_expiry = ItemExpiry.objects.get(id=self.item_expiry2_id)
        self.assertEqual(item_expiry.quantity, 45)
        item_expiry = ItemExpiry.objects.get(id=self.item_no_expiry_id)
        self.assertEqual(item_expiry.quantity, 45)

        # check that order is created correctly
        self.assertEqual(Order.objects.count(), order_count + 1)
        order = Order.objects.get(id=response.data["order_id"])
        self.assertEqual(order.reason, "kit_create")
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

    def test_create_new_kit_with_invalid_blueprint(self):
        self.request["blueprint"] = 0
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Blueprint matching query does not exist."
        )
        self.request["blueprint"] = self.blueprint_id

    def test_create_new_kit_with_invalid_item_expiry(self):
        item_expiry_id = self.request["content"][0]["item_expiry_id"]
        self.request["content"][0]["item_expiry_id"] = 0
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "ItemExpiry matching query does not exist."
        )
        self.request["content"][0]["item_expiry_id"] = item_expiry_id

    def test_create_new_kit_with_more_than_blueprint(self):
        quantity = self.request["content"][0]["quantity"]
        self.request["content"][0]["quantity"] = 1000
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Added content is more than expected."
        )
        kit = Kit.objects.all()
        self.assertEqual(len(kit), 0)

        self.request["content"][0]["quantity"] = quantity

    def test_create_new_kit_with_more_than_stock(self):
        new_compress_blueprint_content = [{"item_id": self.item.id, "quantity": 1000}]
        new_blueprint = Blueprint.objects.create(
            name="New Test Blueprint",
            complete_content=new_compress_blueprint_content,
        )
        quantity = self.request["content"][0]["quantity"]
        content = self.request["content"]
        self.request["blueprint"] = new_blueprint.id
        self.request["content"] = self.request["content"][:1]
        self.request["content"][0]["quantity"] = 1000
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)

        stock_error_msg = (
            "{'order_items': [ErrorDetail(string='Insufficient quantity for Another Item with expiry "
            "date 2023-12-31', code='invalid')]}"
        )
        self.assertEqual(response.data["message"], stock_error_msg)
        kit = Kit.objects.all()
        self.assertEqual(len(kit), 0)

        self.request["content"][0]["quantity"] = quantity
        self.request["content"] = content
        self.request["blueprint"] = self.blueprint_id

    def test_create_new_kit_without_required_fields(self):
        self.request.pop("blueprint")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["blueprint"] = self.blueprint_id

        name = self.request.pop("name")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["name"] = name

        content = self.request.pop("content")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["content"] = content

    def test_create_new_kit_with_invalid_name(self):
        name = self.request["name"]
        self.request["name"] = ""
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["name"] = name

    def test_create_new_kit_with_same_name(self):
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 201)

        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit with this name already exists!")

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
