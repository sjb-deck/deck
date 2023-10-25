from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, Order, LoanOrder, ItemExpiry
import datetime
from django.utils import timezone


class TestApiRevertOrderView(TestCase):
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
        self.url = reverse("revert_order")
        self.clear_relevant_models()
        self.create_items()

    def clear_relevant_models(self):
        Item.objects.all().delete()
        Order.objects.all().delete()

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

        self.withdraw_order = Order.objects.create(
            action="Withdraw",
            reason="unserviceable",
            user=self.user,
        )
        self.withdraw_order_item1 = self.withdraw_order.order_items.create(
            item_expiry=self.itemExpiry1, ordered_quantity=10
        )

        self.deposit_order = Order.objects.create(
            action="Deposit",
            reason="item_restock",
            user=self.user,
        )
        self.deposit_order_item1 = self.deposit_order.order_items.create(
            item_expiry=self.itemExpiry1, ordered_quantity=10
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

        self.returned_loan = LoanOrder.objects.create(
            action="Withdraw",
            reason="loan",
            user=self.user,
            loanee_name="Joh",
            due_date=timezone.make_aware(datetime.datetime(2021, 12, 31)),
            loan_active=False,
            return_date=timezone.make_aware(datetime.datetime(2021, 12, 31)),
        )
        self.returned_loan_item1 = self.returned_loan.order_items.create(
            item_expiry=self.itemExpiry1,
            ordered_quantity=5,
            returned_quantity=2,
        )
        self.returned_loan_item2 = self.returned_loan.order_items.create(
            item_expiry=self.itemExpiry_no_expiry,
            ordered_quantity=3,
            returned_quantity=1,
        )

    def test_revert_withdraw_order(self):
        response = self.client.post(self.url, self.withdraw_order.id, format="json")
        self.assertEqual(response.status_code, 200)

        # check that item total_quantity is updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 110)

        # check that itemExpiry is updated
        updated_item_expiry = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        self.assertEqual(updated_item_expiry.quantity, 60)

        # check that order is deleted
        self.assertFalse(Order.objects.filter(id=self.withdraw_order.id).exists())

    def test_revert_deposit_order(self):
        response = self.client.post(self.url, self.deposit_order.id, format="json")
        self.assertEqual(response.status_code, 200)

        # check that item total_quantity is updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 90)

        # check that itemExpiry is updated
        updated_item_expiry = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        self.assertEqual(updated_item_expiry.quantity, 40)

        # check that order is deleted
        self.assertFalse(Order.objects.filter(id=self.deposit_order.id).exists())

    def test_revert_loan_order_that_is_active(self):
        response = self.client.post(self.url, self.outstanding_loan.id, format="json")
        self.assertEqual(response.status_code, 200)

        # check that itemExpiry is updated
        updated_item_expiry1 = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        updated_item_expiry_no_expiry = ItemExpiry.objects.get(
            id=self.itemExpiry_no_expiry.id
        )
        self.assertEqual(updated_item_expiry1.quantity, 55)
        self.assertEqual(updated_item_expiry_no_expiry.quantity, 53)

        # check that order is deleted
        self.assertFalse(Order.objects.filter(id=self.outstanding_loan.id).exists())

    def test_revert_loan_order_that_is_not_active(self):
        response = self.client.post(self.url, self.returned_loan.id, format="json")
        self.assertEqual(response.status_code, 200)

        # check that itemExpiry is updated
        updated_item_expiry1 = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        updated_item_expiry_no_expiry = ItemExpiry.objects.get(
            id=self.itemExpiry_no_expiry.id
        )
        self.assertEqual(updated_item_expiry1.quantity, 48)
        self.assertEqual(updated_item_expiry_no_expiry.quantity, 49)

        # check that order exists
        self.assertTrue(Order.objects.filter(id=self.returned_loan.id).exists())

        # check that the loan is active
        updated_loan = LoanOrder.objects.get(id=self.returned_loan.id)
        self.assertTrue(updated_loan.loan_active)
        self.assertIsNone(updated_loan.return_date)

        # check that the returned quantity is None
        updated_order_item1 = updated_loan.order_items.get(
            id=self.returned_loan_item1.id
        )
        updated_order_item2 = updated_loan.order_items.get(
            id=self.returned_loan_item2.id
        )
        self.assertEqual(updated_order_item1.returned_quantity, None)
        self.assertEqual(updated_order_item2.returned_quantity, None)

    def test_revert_order_with_invalid_order_id(self):
        response = self.client.post(self.url, -1, format="json")
        self.assertEqual(response.status_code, 500)

    def tearDown(self) -> None:
        self.clear_relevant_models()
        return super().tearDown()
