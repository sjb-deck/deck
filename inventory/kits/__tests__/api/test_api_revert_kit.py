from array import array

from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry, Order
from inventory.kits.models import Blueprint, Kit, History, LoanHistory


class TestApiRevertReturnOrderViews(TestCase):
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
        # kit0 is loaned, returned and restocked, kit1 is loaned and returned, kit2 is loaned, kit3 is not loaned at all
        self.create_kits()
        self.loan_kits()
        self.return_kits()
        self.restock_kit()

    def retire_kit(self):
        response = self.client.get(
            reverse("retire_kit", args=[self.kit_id[3]]), None, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["message"], "Kit retired and contents deposited successfully!"
        )

    def restock_kit(self):
        request = {
            "kit_id": self.kit_id[0],
            "content": [
                {"item_expiry_id": self.item_expiry1_id, "quantity": 4},
                {"item_expiry_id": self.item_expiry2_id, "quantity": 4},
                {"item_expiry_id": self.item_no_expiry_id, "quantity": 4},
            ],
        }
        response = self.client.post(reverse("restock_kit"), request, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit restocked successfully!")

    def return_kits(self):
        request = {
            "kit_id": 999,
            "content": [
                {"item_expiry_id": self.item_expiry1_id, "quantity": 1},
                {"item_expiry_id": self.item_expiry2_id, "quantity": 1},
                {"item_expiry_id": self.item_no_expiry_id, "quantity": 1},
            ],
        }

        for i in range(2):
            request["kit_id"] = self.kit_id[i]
            response = self.client.post(
                reverse("return_kit_order"), request, format="json"
            )
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data["message"], "Kit returned successfully!")

    def loan_kits(self):
        request = {
            "kit_ids": [999],
            "force": False,
            "loanee_name": "test loanee",
            "due_date": "2050-01-01",
        }

        for i in range(3):
            request["kit_ids"] = [self.kit_id[i]]
            response = self.client.post(
                reverse("submit_kit_order"), request, format="json"
            )
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.data["message"], "Kit(s) loaned successfully!")

    def create_kits(self):
        self.kit_id = array("i", [0, 0, 0, 0])
        for i in range(4):
            response = self.client.post(
                reverse("add_kit"),
                {
                    "name": "Test Kit " + str(i),
                    "blueprint": self.blueprint_id,
                    "content": self.kit_content,
                },
                format="json",
            )
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.data["message"], "Kit added successfully!")
            self.kit_id[i] = response.data["kit_id"]

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
        history = History.objects.filter(kit__id=self.kit_id[0]).latest("id")
        self.assertEqual(history.type, "RESTOCK")
        order_id = history.order_id
        order = Order.objects.get(id=order_id)
        self.assertEqual(order.reason, "kit_restock")

        response = self.client.get(
            reverse("revert_kit", args=[history.id]), format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit restock reverted successfully!")

        # Check that order is deleted and history is deleted
        with self.assertRaises(Order.DoesNotExist):
            Order.objects.get(id=order_id)
        new_history = History.objects.filter(kit__id=self.kit_id[0]).latest("id")
        self.assertEqual(new_history.type, "LOAN")

    def test_revert_return(self):
        kit = Kit.objects.get(id=self.kit_id[1])
        self.assertEqual(kit.status, "READY")
        history = LoanHistory.objects.filter(kit__id=self.kit_id[1]).latest("id")
        self.assertEqual(history.type, "LOAN")
        self.assertIsNotNone(history.return_date)

        response = self.client.get(
            reverse("revert_kit", args=[history.id]), format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit return reverted successfully!")

        # Check that kit status is loaned again
        kit = Kit.objects.get(id=self.kit_id[1])
        self.assertEqual(kit.status, "LOANED")
        history = LoanHistory.objects.filter(kit__id=self.kit_id[1]).latest("id")
        self.assertEqual(history.type, "LOAN")
        self.assertIsNone(history.return_date)

    def test_revert_loan(self):
        history = LoanHistory.objects.filter(kit__id=self.kit_id[2]).latest("id")
        self.assertEqual(history.type, "LOAN")
        self.assertIsNone(history.return_date)

        response = self.client.get(
            reverse("revert_kit", args=[history.id]), format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], "Kit loan reverted successfully!")

        kit = Kit.objects.get(id=self.kit_id[2])
        self.assertEqual(kit.status, "READY")
        history = History.objects.filter(kit__id=self.kit_id[2]).latest("id")
        self.assertEqual(history.type, "CREATION")

    def test_revert_retire(self):
        self.retire_kit()
        history = History.objects.filter(kit__id=self.kit_id[3]).latest("id")
        self.assertEqual(history.type, "RETIREMENT")
        kit = Kit.objects.get(id=self.kit_id[3])
        self.assertEqual(kit.status, "RETIRED")

        response = self.client.get(
            reverse("revert_kit", args=[history.id]), format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data["message"], "Kit retirement reverted successfully!"
        )

        kit = Kit.objects.get(id=self.kit_id[3])
        self.assertEqual(kit.status, "READY")
        history = History.objects.filter(kit__id=self.kit_id[3]).latest("id")
        self.assertEqual(history.type, "CREATION")

    def test_revert_when_no_revertible_history(self):
        history = History.objects.filter(kit__id=self.kit_id[3]).latest("id")
        self.assertEqual(history.type, "CREATION")
        response = self.client.get(
            reverse("revert_kit", args=[history.id]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "This operation cannot be reverted.")

    def test_revert_invalid_history_id(self):
        response = self.client.get(reverse("revert_kit", args=[999]), format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "History matching query does not exist."
        )

    def test_revert_kit_not_latest_history(self):
        previous_history = History.objects.filter(kit__id=self.kit_id[0]).order_by(
            "-id"
        )[1]
        response = self.client.get(
            reverse("revert_kit", args=[previous_history.id]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"],
            "This is not the latest operation of the kit and cannot be reverted.",
        )

    # This is a very severe case where history does not match kit status
    def test_revert_kit_status_mismatch(self):
        kit0 = Kit.objects.get(id=self.kit_id[0])
        kit0.status = "LOANED"
        kit0.save()
        kit1 = Kit.objects.get(id=self.kit_id[1])
        kit1.status = "RESTOCKED"
        kit1.save()
        kit2 = Kit.objects.get(id=self.kit_id[2])
        kit2.status = "READY"
        kit2.save()

        history0 = History.objects.filter(kit__id=self.kit_id[0]).latest("id")
        history1 = LoanHistory.objects.filter(kit__id=self.kit_id[1]).latest("id")
        history2 = LoanHistory.objects.filter(kit__id=self.kit_id[2]).latest("id")

        response = self.client.get(
            reverse("revert_kit", args=[history0.id]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"],
            "Severe error detected. Kit is not in ready state and cannot be reverted. Please contact "
            "admin.",
        )

        response = self.client.get(
            reverse("revert_kit", args=[history1.id]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"],
            "Severe error detected. Kit is not in ready state and cannot be reverted. Please contact "
            "admin.",
        )

        response = self.client.get(
            reverse("revert_kit", args=[history2.id]), format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"],
            "Severe error detected. Kit is not in loaned state and cannot be reverted. Please contact "
            "admin.",
        )

        kit0.status = "READY"
        kit0.save()
        kit1.status = "READY"
        kit1.save()
        kit2.status = "LOANED"
        kit2.save()

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
