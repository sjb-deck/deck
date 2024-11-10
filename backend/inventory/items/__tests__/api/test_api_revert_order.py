from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, Order, LoanOrder, ItemExpiry, OrderItem
import datetime
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken


class TestApiRevertOrderView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)
        self.url = reverse("revert_order")
        self.create_items()

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
        self.item_create_order = Order.objects.create(
            action="Deposit",
            reason="item_creation",
            user=self.user,
        )
        self.item_create_order_item1 = self.item_create_order.order_items.create(
            item_expiry=self.itemExpiry1,
            ordered_quantity=50,
            order=self.item_create_order,
        )
        self.item_create_order_item2 = self.item_create_order.order_items.create(
            item_expiry=self.itemExpiry2,
            ordered_quantity=50,
            order=self.item_create_order,
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
        self.item_no_expiry_create_order = Order.objects.create(
            action="Deposit",
            reason="item_creation",
            user=self.user,
        )
        self.item_no_expiry_create_order_item1 = (
            self.item_no_expiry_create_order.order_items.create(
                item_expiry=self.itemExpiry_no_expiry,
                ordered_quantity=50,
                order=self.item_no_expiry_create_order,
            )
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

        self.kit_order = Order.objects.create(
            action="Withdraw",
            reason="kit_create",
            user=self.user,
        )
        self.kit_order_item1 = self.kit_order.order_items.create(
            item_expiry=self.itemExpiry1, ordered_quantity=10
        )
        self.kit_order.other_info = ""

        self.newly_created_item = Item.objects.create(
            name="Newly Created Item",
            type="General",
            unit="units",
            total_quantity=50,
            min_quantity=10,
            is_opened=False,
        )
        self.newly_created_item_expiry1 = self.newly_created_item.expiry_dates.create(
            quantity=50, archived=False, expiry_date="2023-12-31"
        )
        self.newly_created_item_expiry2 = self.newly_created_item.expiry_dates.create(
            quantity=50, archived=False, expiry_date="2025-12-31"
        )
        self.newly_created_item_create_order = Order.objects.create(
            action="Deposit",
            reason="item_creation",
            user=self.user,
        )
        self.newly_created_item_create_order_item1 = OrderItem.objects.create(
            item_expiry=self.newly_created_item_expiry1,
            ordered_quantity=50,
            order=self.newly_created_item_create_order,
        )
        self.newly_created_item_create_order_item2 = OrderItem.objects.create(
            item_expiry=self.newly_created_item_expiry2,
            ordered_quantity=50,
            order=self.newly_created_item_create_order,
        )

    def create_request_body(self, order_id):
        return {"id": order_id}

    def test_revert_withdraw_order(self):
        response = self.client.post(
            self.url, self.create_request_body(self.withdraw_order.id), format="json"
        )
        self.assertEqual(response.status_code, 200)

        # check that item total_quantity is updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 110)

        # check that itemExpiry is updated
        updated_item_expiry = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        self.assertEqual(updated_item_expiry.quantity, 60)

        # check that order is set to reverted
        self.assertTrue(Order.objects.get(id=self.withdraw_order.id).is_reverted)

    def test_revert_deposit_order(self):
        response = self.client.post(
            self.url, self.create_request_body(self.deposit_order.id), format="json"
        )
        self.assertEqual(response.status_code, 200)

        # check that item total_quantity is updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 90)

        # check that itemExpiry is updated
        updated_item_expiry = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        self.assertEqual(updated_item_expiry.quantity, 40)

        # check that order is set to reverted
        self.assertTrue(Order.objects.get(id=self.deposit_order.id).is_reverted)

    def test_revert_loan_order_that_is_active(self):
        response = self.client.post(
            self.url, self.create_request_body(self.outstanding_loan.id), format="json"
        )
        self.assertEqual(response.status_code, 200)

        # check that itemExpiry is updated
        updated_item_expiry1 = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        updated_item_expiry_no_expiry = ItemExpiry.objects.get(
            id=self.itemExpiry_no_expiry.id
        )
        self.assertEqual(updated_item_expiry1.quantity, 55)
        self.assertEqual(updated_item_expiry_no_expiry.quantity, 53)

        # check that order is set to reverted
        self.assertTrue(Order.objects.get(id=self.outstanding_loan.id).is_reverted)

    def test_revert_loan_order_that_is_not_active(self):
        response = self.client.post(
            self.url, self.create_request_body(self.returned_loan.id), format="json"
        )
        self.assertEqual(response.status_code, 200)

        # check that itemExpiry is updated
        updated_item_expiry1 = ItemExpiry.objects.get(id=self.itemExpiry1.id)
        updated_item_expiry_no_expiry = ItemExpiry.objects.get(
            id=self.itemExpiry_no_expiry.id
        )
        self.assertEqual(updated_item_expiry1.quantity, 48)
        self.assertEqual(updated_item_expiry_no_expiry.quantity, 49)

        # check that order exists and is not set to reverted
        self.assertTrue(Order.objects.filter(id=self.returned_loan.id).exists())
        self.assertFalse(Order.objects.get(id=self.returned_loan.id).is_reverted)

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

    def test_revert_item_create_order(self):
        response = self.client.post(
            self.url,
            self.create_request_body(self.newly_created_item_create_order.id),
            format="json",
        )
        self.assertEqual(response.status_code, 200)

        # check that item is deleted
        self.assertFalse(Item.objects.filter(id=self.newly_created_item.id).exists())

        # check that itemExpiry is deleted
        self.assertFalse(
            ItemExpiry.objects.filter(id=self.newly_created_item_expiry1.id).exists()
        )
        self.assertFalse(
            ItemExpiry.objects.filter(id=self.newly_created_item_expiry2.id).exists()
        )

        # check that order is deleted
        self.assertFalse(
            Order.objects.filter(id=self.newly_created_item_create_order.id).exists()
        )

        # check that order items are deleted
        self.assertFalse(
            OrderItem.objects.filter(
                id=self.newly_created_item_create_order_item1.id
            ).exists()
        )
        self.assertFalse(
            OrderItem.objects.filter(
                id=self.newly_created_item_create_order_item2.id
            ).exists()
        )

    def test_revert_order_with_invalid_order_id(self):
        response = self.client.post(
            self.url, self.create_request_body(-1), format="json"
        )
        self.assertEqual(response.status_code, 500)

    def test_revert_order_with_kit_create_order(self):
        response = self.client.post(
            self.url, self.create_request_body(self.kit_order.id), format="json"
        )
        self.assertEqual(response.status_code, 500)

    def test_revert_order_with_kit_restock_order(self):
        self.kit_order.reason = "kit_restock"
        self.kit_order.save()
        response = self.client.post(
            self.url, self.create_request_body(self.kit_order.id), format="json"
        )
        self.assertEqual(response.status_code, 500)

    def test_revert_order_with_kit_retire_order(self):
        self.kit_order.reason = "kit_retire"
        self.kit_order.action = "Deposit"
        self.kit_order.save()
        response = self.client.post(
            self.url, self.create_request_body(self.kit_order.id), format="json"
        )
        self.assertEqual(response.status_code, 500)

    def test_revert_deposit_order_with_insufficient_quantity(self):
        self.deposit_order_item1.ordered_quantity = 100
        self.deposit_order_item1.save()
        response = self.client.post(
            self.url, self.create_request_body(self.deposit_order.id), format="json"
        )
        self.assertEqual(response.status_code, 500)
        self.assertEqual(self.itemExpiry1.quantity, 50)

    def tearDown(self):
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        ItemExpiry.objects.all().delete()
        Item.objects.all().delete()

        return super().tearDown()
