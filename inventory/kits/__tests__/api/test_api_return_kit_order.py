from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry, Order
from inventory.kits.models import Blueprint, Kit, History


class TestApiSubmitKitOrderViews(TestCase):
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
        self.url = reverse("return_kit_order")
        self.loan_kit()
        self.request = {
            "kit_id": self.kit_id,
            "content": [{
                "item_expiry_id": self.item_expiry1_id,
                "quantity": 1
            },
            {
                "item_expiry_id": self.item_expiry2_id,
                "quantity": 2
            },
            {
                "item_expiry_id": self.item_no_expiry_id,
                "quantity": 3
            }]
        }

    def loan_kit(self):
        request = {
            "kit_id": self.kit_id,
            "force": False,
            "loanee_name": "test loanee",
            "due_date": "2050-01-01"
        }
        response = self.client.post(reverse("submit_kit_order"), request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit loaned successfully!")

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

    def test_return_order(self):
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit returned successfully!")

    def test_return_order_after_return(self):
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit returned successfully!")

        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit is not loaned and cannot be returned.")

    def test_return_order_with_invalid_kit_id(self):
        self.request["kit_id"] = 999
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit matching query does not exist.")

    def test_return_order_with_invalid_item_expiry_id(self):
        item_expiry_id = self.request["content"][0]["item_expiry_id"]
        self.request["content"][0]["item_expiry_id"] = 999
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Expected content does not match.")
        self.request["content"][0]["item_expiry_id"] = item_expiry_id

    def test_return_order_with_invalid_quantity(self):
        quantity = self.request["content"][0]["quantity"]
        self.request["content"][0]["quantity"] = 999
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Attempting to return more than borrowed not allowed.")

        self.request["content"][0]["quantity"] = -1
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Quantity cannot be negative.")
        self.request["content"][0]["quantity"] = quantity

    def test_return_order_with_missing_fields(self):
        self.request.pop("kit_id")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["kit_id"] = self.kit_id

        content = self.request.pop("content")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["content"] = content

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
