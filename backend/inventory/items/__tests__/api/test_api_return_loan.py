from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, UserExtras
from inventory.items.models import Item, Order, LoanOrder, ItemExpiry, OrderItem
import datetime
from rest_framework_simplejwt.tokens import RefreshToken


class TestApiLoanReturnViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)
        self.url = reverse("loan_return_post")
        self.create_items()

        self.loan_return_request = {
            "order_id": self.outstanding_loan.id,
            "items": [
                {"order_item_id": self.itemExpiry1.id, "returned_quantity": 1},
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
            expiry_date="2024-12-31", quantity=50, archived=False
        )

        self.item_no_expiry = Item.objects.create(
            name="No Expiry Item",
            type="General",
            unit="units",
            total_quantity=50,
            min_quantity=10,
            is_opened=False,
        )
        self.itemExpiry_no_expiry = self.item_no_expiry.expiry_dates.create(
            quantity=50, archived=False
        )

        self.outstanding_loan = LoanOrder.objects.create(
            action="Withdraw",
            reason="loan",
            user=self.user,
            loanee_name="Joh",
            due_date=timezone.make_aware(datetime.datetime(2021, 12, 31)),
        )
        self.outstanding_loan_item1 = self.outstanding_loan.order_items.create(
            item_expiry=self.itemExpiry1, ordered_quantity=5
        )
        self.outstanding_loan_item2 = self.outstanding_loan.order_items.create(
            item_expiry=self.itemExpiry_no_expiry, ordered_quantity=3
        )

    def test_return_loan_order(self):
        response = self.client.post(self.url, self.loan_return_request, format="json")
        self.assertEqual(response.status_code, 201)

        # check that order is updated
        updated_order = LoanOrder.objects.get(id=self.outstanding_loan.id)
        self.assertEqual(updated_order.loan_active, False)
        self.assertTrue(
            abs(updated_order.return_date - timezone.now()) < timedelta(seconds=1)
        )

        # check that the order item is updated
        updated_order_item1 = updated_order.order_items.get(
            id=self.outstanding_loan_item1.id
        )
        updated_order_item2 = updated_order.order_items.get(
            id=self.outstanding_loan_item2.id
        )
        self.assertEqual(updated_order_item1.returned_quantity, 1)
        self.assertEqual(updated_order_item2.returned_quantity, 0)

        # check that itemExpiry is updated
        updated_itemExpiry1 = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        updated_itemExpiry_no_expiry = ItemExpiry.objects.get(
            id=self.itemExpiry_no_expiry.id
        )
        self.assertEqual(updated_itemExpiry1.quantity, 51)
        self.assertEqual(updated_itemExpiry_no_expiry.quantity, 50)

        # check that item total_quantity is updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 101)
        updated_item_no_expiry = Item.objects.get(id=self.item_no_expiry.id)
        self.assertEqual(updated_item_no_expiry.total_quantity, 50)

    def test_return_loan_order_with_invalid_order_id(self):
        request_with_invalid_order_id = self.loan_return_request.copy()
        request_with_invalid_order_id["order_id"] = -1
        response = self.client.post(
            self.url, request_with_invalid_order_id, format="json"
        )
        self.assertEqual(response.status_code, 500)
        self.check_no_change()

    def test_return_loan_order_with_invalid_order_item_id(self):
        request_with_invalid_order_item_id = self.loan_return_request.copy()
        request_with_invalid_order_item_id["items"][0]["order_item_id"] = -1
        response = self.client.post(
            self.url, request_with_invalid_order_item_id, format="json"
        )
        self.assertEqual(response.status_code, 500)
        self.check_no_change()

    def test_return_loan_order_with_invalid_returned_quantity(self):
        request_with_invalid_returned_quantity = self.loan_return_request.copy()
        request_with_invalid_returned_quantity["items"][0]["returned_quantity"] = -1
        response = self.client.post(
            self.url, request_with_invalid_returned_quantity, format="json"
        )
        self.assertEqual(response.status_code, 500)
        self.check_no_change()

    def test_return_loan_order_with_no_order_item(self):
        request_with_no_order_item = self.loan_return_request.copy()
        request_with_no_order_item["items"] = []
        response = self.client.post(self.url, request_with_no_order_item, format="json")
        self.assertEqual(response.status_code, 500)
        self.check_no_change()

    def test_return_loan_order_that_is_returned(self):
        self.outstanding_loan.loan_active = False
        self.outstanding_loan.save()
        response = self.client.post(self.url, self.loan_return_request, format="json")
        self.assertEqual(response.status_code, 500)
        self.outstanding_loan.loan_active = True
        self.outstanding_loan.save()
        self.check_no_change()

    def test_return_loan_order_with_more_than_ordered_quantity(self):
        request_with_more_than_ordered_quantity = self.loan_return_request.copy()
        request_with_more_than_ordered_quantity["items"][0]["returned_quantity"] = 6
        response = self.client.post(
            self.url, request_with_more_than_ordered_quantity, format="json"
        )
        self.assertEqual(response.status_code, 500)
        self.check_no_change()

    def check_no_change(self):
        # check that order is not updated
        updated_order = LoanOrder.objects.get(id=self.outstanding_loan.id)
        self.assertEqual(updated_order.loan_active, True)
        self.assertIsNone(updated_order.return_date)

        # check that the order item is not updated
        updated_order_item1 = updated_order.order_items.get(
            id=self.outstanding_loan_item1.id
        )
        updated_order_item2 = updated_order.order_items.get(
            id=self.outstanding_loan_item2.id
        )
        self.assertEqual(updated_order_item1.returned_quantity, None)
        self.assertEqual(updated_order_item2.returned_quantity, None)

        # check that itemExpiry is not updated
        updated_itemExpiry1 = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        updated_itemExpiry_no_expiry = ItemExpiry.objects.get(
            id=self.itemExpiry_no_expiry.id
        )
        self.assertEqual(updated_itemExpiry1.quantity, 50)
        self.assertEqual(updated_itemExpiry_no_expiry.quantity, 50)

        # check that item total_quantity is not updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 100)
        updated_item_no_expiry = Item.objects.get(id=self.item_no_expiry.id)
        self.assertEqual(updated_item_no_expiry.total_quantity, 50)

    def tearDown(self):
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        ItemExpiry.objects.all().delete()
        Item.objects.all().delete()
        return super().tearDown()
