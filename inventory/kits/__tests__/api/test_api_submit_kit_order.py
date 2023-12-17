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
        self.url = reverse("submit_kit_order")
        self.request = {
            "kit_ids": [self.kit_id],
            "force": False,
            "loanee_name": "test loanee",
            "due_date": "2050-01-01",
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

    def test_order_kit(self):
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit(s) loaned successfully!")

        # check that kit is loaned
        kit = Kit.objects.get(id=self.kit_id)
        self.assertEqual(kit.status, "LOANED")

        # check that history is created
        history = History.objects.get(kit=kit)
        self.assertEqual(history.type, "LOAN")

    def test_order_kit_atomicity(self):
        kit_ids = self.request["kit_ids"]
        self.request["kit_ids"] = [self.kit_id, self.incomplete_kit_id]
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"],
            "Kit with id="
            + str(self.incomplete_kit_id)
            + " is not complete and cannot be loaned.",
        )

        # check that kits are not loaned
        kit = Kit.objects.get(id=self.kit_id)
        self.assertEqual(kit.status, "READY")
        kit = Kit.objects.get(id=self.incomplete_kit_id)
        self.assertEqual(kit.status, "READY")

        # check that history is not created
        self.assertFalse(History.objects.filter(kit_id=self.kit_id).exists())
        self.assertFalse(History.objects.filter(kit_id=self.incomplete_kit_id).exists())

    def test_order_kit_that_is_already_loaned(self):
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit(s) loaned successfully!")

        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit is not ready and available.")

    def test_order_kit_force(self):
        # check that kit is incomplete and cannot be loaned normally
        self.request["kit_ids"] = [self.incomplete_kit_id]
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"],
            "Kit with id="
            + str(self.incomplete_kit_id)
            + " is not complete and cannot be loaned.",
        )

        self.request["force"] = True
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit(s) loaned successfully!")

        # check that kit is loaned
        kit = Kit.objects.get(id=self.incomplete_kit_id)
        self.assertEqual(kit.status, "LOANED")

        # check that history is created
        history = History.objects.get(kit=kit)
        self.assertEqual(history.type, "LOAN")

        self.request["force"] = False
        self.request["kit_ids"] = [self.kit_id]

    def test_order_kit_invalid_kit_id(self):
        self.request["kit_ids"] = [999]
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Kit matching query does not exist.")
        self.request["kit_ids"] = [self.kit_id]

    def test_order_kit_invalid_loanee_name(self):
        loanee_name = self.request["loanee_name"]
        self.request["loanee_name"] = ""
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["loanee_name"] = loanee_name

    def test_order_kit_invalid_due_date(self):
        due_date = self.request["due_date"]
        self.request["due_date"] = "2000-01-01"
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Due date cannot be in the past.")

        self.request["due_date"] = ""
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")

        self.request["due_date"] = "XXX"
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "time data 'XXX' does not match format '%Y-%m-%d'"
        )

        self.request["due_date"] = due_date

    def test_order_kit_missing_fields(self):
        id = self.request.pop("kit_ids")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["kit_ids"] = id

        loanee_name = self.request.pop("loanee_name")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["loanee_name"] = loanee_name

        due_date = self.request.pop("due_date")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["due_date"] = due_date

        force = self.request.pop("force")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["force"] = force

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
