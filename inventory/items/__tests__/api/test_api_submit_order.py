from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Order, Item, ItemExpiry, LoanOrder
from django.utils import timezone
import datetime


class TestApiSubmitOrderViews(TestCase):
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
        self.url = reverse("submit_order")
        self.clear_relevant_models()
        self.create_items()

        self.loan_request = {
            "action": "Withdraw",
            "reason": "loan",
            "user": 1,
            "loanee_name": "Joh",
            "due_date": "2021-12-31",
            "order_items": [
                {"item_expiry_id": self.itemExpiry1.id, "ordered_quantity": 5},
                {"item_expiry_id": self.itemExpiry_no_expiry.id, "ordered_quantity": 3},
            ],
        }

        self.order_request = {
            "action": "Deposit",
            "reason": "others",
            "user": 1,
            "other_info": "test",
            "order_items": [
                {"item_expiry_id": self.itemExpiry1.id, "ordered_quantity": 5},
                {"item_expiry_id": self.itemExpiry_no_expiry.id, "ordered_quantity": 3},
            ],
        }

        self.request_to_archive_item = {
            "action": "Withdraw",
            "reason": "unserviceable",
            "user": 1,
            "order_items": [
                {"item_expiry_id": self.itemExpiry1.id, "ordered_quantity": 50},
                {
                    "item_expiry_id": self.itemExpiry_no_expiry.id,
                    "ordered_quantity": 100,
                },
            ],
        }

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
            expiry_date="2021-12-31", quantity=50, archived=False
        )

        self.item_no_expiry = Item.objects.create(
            name="Item with no expiry",
            type="General",
            unit="units",
            total_quantity=100,
            min_quantity=10,
            is_opened=False,
        )
        self.itemExpiry_no_expiry = self.item_no_expiry.expiry_dates.create(
            expiry_date=None, quantity=100, archived=False
        )

    def clear_relevant_models(self):
        Order.objects.all().delete()
        Item.objects.all().delete()

    def test_submit_loan_order(self):
        response = self.client.post(self.url, self.loan_request, format="json")
        self.assertEqual(response.status_code, 201)

        # Check if the order exists in the database
        order = Order.objects.first()
        self.assertIsNotNone(order)

        # Check that the order details is correct
        self.assertEqual(order.action, "Withdraw")
        self.assertEqual(order.reason, "loan")
        self.assertEqual(order.user.id, self.user.id)
        self.assertEqual(order.loanorder.loanee_name, "Joh")

        order_items = order.order_items.all()
        self.assertEqual(order_items.count(), 2)
        self.assertEqual(order_items[0].ordered_quantity, 5)
        self.assertEqual(order_items[1].ordered_quantity, 3)
        self.assertIsNone(order_items[0].returned_quantity)
        self.assertIsNone(order_items[1].returned_quantity)
        self.assertEqual(order_items[0].item_expiry.id, self.itemExpiry1.id)
        self.assertEqual(order_items[1].item_expiry.id, self.itemExpiry_no_expiry.id)

        # check that the quantity is deducted correctly
        item = Item.objects.get(id=self.item.id)
        item_no_expiry = Item.objects.get(id=self.item_no_expiry.id)
        self.assertEqual(item.total_quantity, 95)
        self.assertEqual(item_no_expiry.total_quantity, 97)
        item_expiry1 = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        item_no_expiry1 = ItemExpiry.objects.get(id=self.itemExpiry_no_expiry.id)
        self.assertEqual(item_expiry1.quantity, 45)
        self.assertEqual(item_no_expiry1.quantity, 97)

    def test_submit_order(self):
        response = self.client.post(self.url, self.order_request, format="json")
        self.assertEqual(response.status_code, 201)

        # Check if the order exists in the database
        order = Order.objects.first()
        self.assertIsNotNone(order)

        # Check that the order details is correct
        self.assertEqual(order.action, "Deposit")
        self.assertEqual(order.reason, "others")
        self.assertEqual(order.user.id, self.user.id)
        self.assertEqual(order.other_info, "test")

        order_items = order.order_items.all()
        self.assertEqual(order_items.count(), 2)
        self.assertEqual(order_items[0].ordered_quantity, 5)
        self.assertEqual(order_items[1].ordered_quantity, 3)
        self.assertEqual(order_items[0].item_expiry.id, self.itemExpiry1.id)
        self.assertEqual(order_items[1].item_expiry.id, self.itemExpiry_no_expiry.id)

        # check that the quantity is added correctly
        item = Item.objects.get(id=self.item.id)
        item_no_expiry = Item.objects.get(id=self.item_no_expiry.id)
        self.assertEqual(item.total_quantity, 105)
        self.assertEqual(item_no_expiry.total_quantity, 103)
        item_expiry1 = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        item_no_expiry1 = ItemExpiry.objects.get(id=self.itemExpiry_no_expiry.id)
        self.assertEqual(item_expiry1.quantity, 55)
        self.assertEqual(item_no_expiry1.quantity, 103)

    def test_submit_order_with_insufficient_quantity(self):
        request_with_insufficient_quantity = self.loan_request.copy()
        request_with_insufficient_quantity["order_items"][0]["ordered_quantity"] = 100
        response = self.client.post(self.url, self.loan_request, format="json")
        self.assertEqual(response.status_code, 500)

        # Check that the order does not exist in the database
        order = Order.objects.all()
        self.assertEqual(order.count(), 0)

    def test_submit_order_with_invalid_action(self):
        request_with_invalid_action = self.loan_request.copy()
        request_with_invalid_action["action"] = "invalid_action"
        response = self.client.post(
            self.url, request_with_invalid_action, format="json"
        )
        self.assertEqual(response.status_code, 500)

        # Check that the order does not exist in the database
        order = Order.objects.all()
        self.assertEqual(order.count(), 0)

    def test_submit_order_with_invalid_reason(self):
        request_with_invalid_reason = self.loan_request.copy()
        request_with_invalid_reason["reason"] = "invalid_reason"
        response = self.client.post(
            self.url, request_with_invalid_reason, format="json"
        )
        self.assertEqual(response.status_code, 500)

        # Check that the order does not exist in the database
        order = Order.objects.all()
        self.assertEqual(order.count(), 0)

    def test_submit_order_with_invalid_item_expiry_id(self):
        request_with_invalid_item_expiry_id = self.loan_request.copy()
        request_with_invalid_item_expiry_id["order_items"][0]["item_expiry_id"] = -1
        response = self.client.post(self.url, self.loan_request, format="json")
        self.assertEqual(response.status_code, 500)

        # Check that the order does not exist in the database
        order = Order.objects.all()
        self.assertEqual(order.count(), 0)

    def test_submit_order_with_missing_fields(self):
        request_with_missing_fields = self.loan_request.copy()
        del request_with_missing_fields["loanee_name"]
        response = self.client.post(
            self.url, request_with_missing_fields, format="json"
        )
        self.assertEqual(response.status_code, 500)

        # Check that the order does not exist in the database
        order = Order.objects.all()
        self.assertEqual(order.count(), 0)

        request_with_missing_fields = self.loan_request.copy()
        del request_with_missing_fields["due_date"]
        response = self.client.post(
            self.url, request_with_missing_fields, format="json"
        )
        self.assertEqual(response.status_code, 500)

        # Check that the order does not exist in the database
        order = Order.objects.all()
        self.assertEqual(order.count(), 0)

    def test_submit_order_with_archive(self):
        # Make item_no_expiry be in active loan
        order = LoanOrder.objects.create(
            action="Withdraw",
            reason="loan",
            user=self.user,
            loanee_name="Joh",
            due_date=timezone.make_aware(datetime.datetime(2021, 12, 31)),
        )
        order.order_items.create(
            item_expiry=self.itemExpiry_no_expiry, ordered_quantity=1
        )

        response = self.client.post(
            self.url, self.request_to_archive_item, format="json"
        )
        self.assertEqual(response.status_code, 201)

        # Check if the order exists in the database
        order = Order.objects.first()
        self.assertIsNotNone(order)

        # Check that item is archived correctly
        item_expiry1 = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        item_no_expiry1 = ItemExpiry.objects.get(id=self.itemExpiry_no_expiry.id)
        self.assertTrue(item_expiry1.archived)
        # should not archive item that is in active loan
        self.assertFalse(item_no_expiry1.archived)

    def tearDown(self):
        self.clear_relevant_models()
        self.user.delete()
