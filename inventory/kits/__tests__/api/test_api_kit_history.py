from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry, Order
from inventory.kits.models import Blueprint, Kit, History, LoanHistory


class TestApiKitHistoryViews(TestCase):
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
        self.generate_kit_with_history()

    def generate_kit_with_history(self):
        # Create a kit
        response = self.client.post(
            reverse("add_kit"),
            {
                "name": "Test Kit",
                "blueprint": self.blueprint_id,
                "content": self.kit_content,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["message"], "Kit added successfully!")
        self.kit_id = response.data["kit_id"]

        # Submit a kit order
        request = {
            "kit_id": self.kit_id,
            "force": True,
            "loanee_name": "test loanee",
            "due_date": "2050-01-01",
        }
        response = self.client.post(reverse("submit_kit_order"), request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit loaned successfully!")

        # Return the kit
        self.return_content = [
            {"item_expiry_id": self.item_expiry1_id, "quantity": 1},
            {"item_expiry_id": self.item_expiry2_id, "quantity": 1},
            {"item_expiry_id": self.item_no_expiry_id, "quantity": 1},
        ]
        request = {"kit_id": self.kit_id, "content": self.return_content}
        response = self.client.post(reverse("return_kit_order"), request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit returned successfully!")

        # Restock the kit
        request = {
            "kit_id": self.kit_id,
            "content": [
                {"item_expiry_id": self.item_expiry1_id, "quantity": 4},
                {"item_expiry_id": self.item_expiry2_id, "quantity": 4},
                {"item_expiry_id": self.item_no_expiry_id, "quantity": 4},
            ],
        }
        response = self.client.post(reverse("restock_kit"), request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit restocked successfully!")

        # retire the kit
        response = self.client.get(
            reverse("retire_kit", args=[self.kit_id]), None, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["message"], "Kit retired and contents deposited successfully!"
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

    def test_kit_history(self):
        url = f"{reverse('kit_history')}?kitId={self.kit_id}"
        response = self.client.get(url, None, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 4)
        self.assertEqual(response.data["results"][0]["type"], "RETIREMENT")
        self.assertEqual(response.data["results"][0]["snapshot"], None)
        self.assertEqual(response.data["results"][1]["type"], "RESTOCK")
        self.assertEqual(
            [
                {"item_expiry_id": item["item_expiry_id"], "quantity": item["quantity"]}
                for item in response.data["results"][1]["snapshot"]
            ],
            self.kit_content,
        )
        self.assertEqual(response.data["results"][2]["type"], "LOAN")
        self.assertEqual(
            [
                {"item_expiry_id": item["item_expiry_id"], "quantity": item["quantity"]}
                for item in response.data["results"][2]["snapshot"]
            ],
            self.return_content,
        )
        self.assertEqual(response.data["results"][3]["type"], "CREATION")
        self.assertEqual(
            [
                {"item_expiry_id": item["item_expiry_id"], "quantity": item["quantity"]}
                for item in response.data["results"][3]["snapshot"]
            ],
            self.kit_content,
        )

    def test_kit_history_with_invalid_kit_id(self):
        url = f"{reverse('kit_history')}?kitId={self.kit_id+1}"
        response = self.client.get(url, None, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit matching query does not exist.")

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
