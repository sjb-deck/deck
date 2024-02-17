from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry
from inventory.kits.models import Blueprint, Kit, History


class TestApiRestockOptionsViews(TestCase):
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

    def loan_kit(self):
        incomplete_kit = Kit.objects.get(id=self.incomplete_kit_id)
        incomplete_kit.status = "ON_LOAN"
        incomplete_kit.save()

    def clear_relevant_models(self):
        History.objects.all().delete()
        Kit.objects.all().delete()
        Item.objects.all().delete()
        Blueprint.objects.all().delete()

    def test_restock_options_complete_kit(self):
        response = self.client.get(
            reverse("restock_options", args=[self.kit_id]), None, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit is already complete.")

    def test_restock_options_incomplete_kit(self):
        response = self.client.get(
            reverse("restock_options", args=[self.incomplete_kit_id]),
            None,
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["item_id"], self.item.id)
        self.assertEqual(response.data[0]["missing_quantity"], 8)
        self.assertEqual(response.data[0]["sufficient_stock"], True)
        self.assertEqual(
            response.data[0]["item_options"][0]["item_expiry_id"], self.itemExpiry1.id
        )
        self.assertEqual(response.data[0]["item_options"][0]["quantity"], 50)
        self.assertEqual(
            response.data[0]["item_options"][1]["item_expiry_id"], self.itemExpiry2.id
        )
        self.assertEqual(response.data[0]["item_options"][1]["quantity"], 50)

        self.assertEqual(response.data[1]["item_id"], self.item_no_expiry.id)
        self.assertEqual(response.data[1]["missing_quantity"], 4)
        self.assertEqual(response.data[1]["sufficient_stock"], True)
        self.assertEqual(
            response.data[1]["item_options"][0]["item_expiry_id"],
            self.itemExpiry_no_expiry.id,
        )
        self.assertEqual(response.data[1]["item_options"][0]["quantity"], 50)

    def test_restock_options_archived(self):
        item_no_expiry = ItemExpiry.objects.get(item=self.item_no_expiry)
        item_no_expiry.archived = True
        item_no_expiry.save()

        response = self.client.get(
            reverse("restock_options", args=[self.incomplete_kit_id]),
            None,
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["item_id"], self.item.id)
        self.assertEqual(response.data[0]["missing_quantity"], 8)
        self.assertEqual(response.data[0]["sufficient_stock"], True)
        self.assertEqual(
            response.data[0]["item_options"][0]["item_expiry_id"], self.itemExpiry1.id
        )
        self.assertEqual(response.data[0]["item_options"][0]["quantity"], 50)
        self.assertEqual(
            response.data[0]["item_options"][1]["item_expiry_id"], self.itemExpiry2.id
        )
        self.assertEqual(response.data[0]["item_options"][1]["quantity"], 50)

        self.assertEqual(response.data[1]["item_id"], self.item_no_expiry.id)
        self.assertEqual(response.data[1]["missing_quantity"], 4)
        self.assertEqual(response.data[1]["sufficient_stock"], True)
        self.assertEqual(
            len(response.data[1]["item_options"]), 0
        )  # No item options for archived items

    def test_restock_kit_on_loan(self):
        self.loan_kit()
        response = self.client.get(
            reverse("restock_options", args=[self.incomplete_kit_id]),
            None,
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Kit is not ready and cannot be restocked."
        )

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
