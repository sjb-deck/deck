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
            {"item_expiry_id": self.item_expiry1_id, "quantity": 5},
            {"item_expiry_id": self.item_expiry2_id, "quantity": 5},
            {"item_expiry_id": self.item_no_expiry_id, "quantity": 5},
        ]
        # kit1 is loaned and returned, kit2 is loaned, kit3 is not loaned at all
        self.create_kits()
        self.loan_kits()
        self.return_kit()

    def return_kit(self):
        request = {
            "kit_id": self.kit_id,
            "content": [
                {"item_expiry_id": self.item_expiry1_id, "quantity": 1},
                {"item_expiry_id": self.item_expiry2_id, "quantity": 2},
                {"item_expiry_id": self.item_no_expiry_id, "quantity": 3},
            ],
        }
        response = self.client.post(reverse("return_kit_order"), request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit returned successfully!")

    def loan_kits(self):
        request = {
            "kit_id": self.kit_id,
            "force": False,
            "loanee_name": "test loanee",
            "due_date": "2050-01-01",
        }
        response = self.client.post(reverse("submit_kit_order"), request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit loaned successfully!")

        request["kit_id"] = self.kit_id2
        response = self.client.post(reverse("submit_kit_order"), request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit loaned successfully!")

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

    def test_revert_return_order(self):
        # check that kit is returned previously
        kit = Kit.objects.get(id=self.kit_id)
        self.assertEqual(kit.status, "READY")
        history = LoanHistory.objects.get(kit_id=self.kit_id)
        self.assertEqual(history.type, "LOAN")
        self.assertIsNotNone(history.return_date)

        response = self.client.get(
            reverse("revert_return_order", args=[self.kit_id]), format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit return reverted successfully!")

        # check that kit is reverted
        kit = Kit.objects.get(id=self.kit_id)
        self.assertEqual(kit.status, "LOANED")

        # check that history is reverted
        history = LoanHistory.objects.get(kit_id=self.kit_id)
        self.assertEqual(history.type, "LOAN")
        self.assertIsNone(history.return_date)

    def test_revert_return_order_not_returned(self):
        # check that kit is not returned
        kit = Kit.objects.get(id=self.kit_id2)
        self.assertEqual(kit.status, "LOANED")
        history = LoanHistory.objects.get(kit_id=self.kit_id2)
        self.assertEqual(history.type, "LOAN")
        self.assertIsNone(history.return_date)

        response = self.client.get(
            reverse("revert_return_order", args=[self.kit_id2]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Kit is not returned yet and cannot be reverted."
        )

    def test_revert_return_order_not_loaned(self):
        # check that kit is not loaned
        kit = Kit.objects.get(id=self.kit_id3)
        self.assertEqual(kit.status, "READY")
        history = History.objects.get(kit_id=self.kit_id3)
        self.assertEqual(history.type, "CREATION")

        response = self.client.get(
            reverse("revert_return_order", args=[self.kit_id3]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"],
            "Kit is not returned recently and cannot be reverted.",
        )

    def test_revert_return_order_double_revert(self):
        # check that kit is returned previously
        kit = Kit.objects.get(id=self.kit_id)
        self.assertEqual(kit.status, "READY")
        history = LoanHistory.objects.get(kit_id=self.kit_id)
        self.assertEqual(history.type, "LOAN")
        self.assertIsNotNone(history.return_date)

        response = self.client.get(
            reverse("revert_return_order", args=[self.kit_id]), format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit return reverted successfully!")

        # second revert
        response = self.client.get(
            reverse("revert_return_order", args=[self.kit_id]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Kit is not returned yet and cannot be reverted."
        )

    def test_revert_return_order_invalid_kit_id(self):
        response = self.client.get(
            reverse("revert_return_order", args=[999]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit matching query does not exist.")

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
