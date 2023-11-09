from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry, Order
from inventory.kits.models import Blueprint, Kit, History, LoanHistory


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
            {"item_expiry_id": self.item_expiry1_id, "quantity": 1},
            {"item_expiry_id": self.item_expiry2_id, "quantity": 1},
            {"item_expiry_id": self.item_no_expiry_id, "quantity": 1},
        ]
        self.create_kits()
        self.restock_kit()
        self.loan_kit()

    def loan_kit(self):
        request = {
            "kit_id": self.kit_id2,
            "force": True,
            "loanee_name": "test loanee",
            "due_date": "2050-01-01",
        }
        response = self.client.post(reverse("submit_kit_order"), request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit loaned successfully!")

    def restock_kit(self):
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

    def create_kits(self):
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

        response = self.client.post(
            reverse("add_kit"),
            {
                "name": "Test Kit 2",
                "blueprint": self.blueprint_id,
                "content": self.kit_content,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["message"], "Kit added successfully!")
        self.kit_id2 = response.data["kit_id"]

        response = self.client.post(
            reverse("add_kit"),
            {
                "name": "Test Kit 3",
                "blueprint": self.blueprint_id,
                "content": self.kit_content,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["message"], "Kit added successfully!")
        self.kit_id3 = response.data["kit_id"]

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

    def test_revert_restock(self):
        # check that the kit has been just restocked
        history = History.objects.filter(kit_id=self.kit_id).latest("id")
        self.assertEqual(history.type, "RESTOCK")

        response = self.client.get(
            reverse("revert_restock", args=[self.kit_id]), None, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit restock reverted successfully!")

        # check that the kit has been reverted
        history = History.objects.filter(kit_id=self.kit_id).latest("id")
        self.assertEqual(history.type, "CREATION")

    def test_revert_restock_while_on_loan(self):
        # check that the kit is on loan
        kit = Kit.objects.get(id=self.kit_id2)
        self.assertEqual(kit.status, "LOANED")
        history = LoanHistory.objects.get(kit_id=self.kit_id2)
        self.assertEqual(history.type, "LOAN")
        self.assertIsNone(history.return_date)

        response = self.client.get(
            reverse("revert_restock", args=[self.kit_id2]), None, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Kit is not ready and cannot be reverted."
        )

    def test_revert_restock_not_after_restock(self):
        # check that the kit has not been restocked
        history = History.objects.filter(kit_id=self.kit_id3).latest("id")
        self.assertEqual(history.type, "CREATION")

        response = self.client.get(
            reverse("revert_restock", args=[self.kit_id3]), None, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"],
            "Kit is not restocked recently and cannot be reverted.",
        )

    def test_revert_restock_double_revert(self):
        # check that the kit has been just restocked
        history = History.objects.filter(kit_id=self.kit_id).latest("id")
        self.assertEqual(history.type, "RESTOCK")

        response = self.client.get(
            reverse("revert_restock", args=[self.kit_id]), None, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit restock reverted successfully!")

        # second revert
        response = self.client.get(
            reverse("revert_restock", args=[self.kit_id]), None, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"],
            "Kit is not restocked recently and cannot be reverted.",
        )

    def test_revert_restock_invalid_kit_id(self):
        response = self.client.get(
            reverse("revert_restock", args=[999]), None, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit matching query does not exist.")

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
