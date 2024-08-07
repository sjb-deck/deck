from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, Order, OrderItem, ItemExpiry
from rest_framework_simplejwt.tokens import RefreshToken


class TestApiAddItemExpiryViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)
        self.url = reverse("create_new_expiry")
        self.create_items()
        self.request = {
            "item": self.item.id,
            "expiry_date": "2021-01-01",
            "quantity": 10,
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
            total_quantity=100,
            min_quantity=10,
            is_opened=False,
        )
        self.itemExpiry_no_expiry = self.item_no_expiry.expiry_dates.create(
            quantity=50, archived=False
        )

    def test_create_new_expiry(self):
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 201)

        # check that item total_quantity is updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 110)

        # check that itemExpiry is created
        self.assertEqual(self.item.expiry_dates.count(), 3)
        self.assertIsNotNone(self.item.expiry_dates.get(expiry_date="2021-01-01"))
        newly_created_item_expiry = self.item.expiry_dates.get(expiry_date="2021-01-01")
        self.assertEqual(newly_created_item_expiry.quantity, 10)
        self.assertEqual(newly_created_item_expiry.item.id, self.item.id)

        # check that order is created
        self.assertEqual(Order.objects.count(), 1)
        newly_created_order = Order.objects.get()
        self.assertEqual(newly_created_order.action, "Deposit")
        self.assertEqual(newly_created_order.reason, "item_restock")
        self.assertEqual(newly_created_order.order_items.count(), 1)
        self.assertEqual(
            newly_created_order.order_items.get().item_expiry.id,
            newly_created_item_expiry.id,
        )
        self.assertEqual(newly_created_order.order_items.get().ordered_quantity, 10)

    def test_create_new_expiry_with_invalid_expiry_date(self):
        request_with_invalid_expiry_date = self.request.copy()
        request_with_invalid_expiry_date["expiry_date"] = None
        response = self.client.post(
            self.url, request_with_invalid_expiry_date, format="json"
        )
        self.assertEqual(response.status_code, 500)

        # check that item total_quantity is not updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 100)

        # check that itemExpiry is not created
        self.assertEqual(self.item.expiry_dates.count(), 2)

        # check that order is not created
        self.assertEqual(Order.objects.count(), 0)

    def test_create_new_expiry_with_no_expiry_date(self):
        request_with_no_expiry_date = self.request.copy()
        request_with_no_expiry_date["item"] = self.item_no_expiry.id
        response = self.client.post(
            self.url, request_with_no_expiry_date, format="json"
        )
        self.assertEqual(response.status_code, 500)

        # check that item total_quantity is not updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 100)

        # check that itemExpiry is not created
        self.assertEqual(self.item_no_expiry.expiry_dates.count(), 1)

        # check that order is not created
        self.assertEqual(Order.objects.count(), 0)

    def test_create_new_expiry_with_invalid_quantity(self):
        request_with_invalid_quantity = self.request.copy()
        request_with_invalid_quantity["quantity"] = -1
        response = self.client.post(
            self.url, request_with_invalid_quantity, format="json"
        )
        self.assertEqual(response.status_code, 500)

        # check that item total_quantity is not updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 100)

        # check that itemExpiry is not created
        self.assertEqual(self.item.expiry_dates.count(), 2)

        # check that order is not created
        self.assertEqual(Order.objects.count(), 0)

    def test_create_new_duplicate_expiry(self):
        request_with_duplicate_expiry = self.request.copy()
        request_with_duplicate_expiry["expiry_date"] = "2023-12-31"
        response = self.client.post(
            self.url, request_with_duplicate_expiry, format="json"
        )
        self.assertEqual(response.status_code, 500)

        # check that item total_quantity is not updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 100)

        # check that itemExpiry is not created
        self.assertEqual(self.item.expiry_dates.count(), 2)

        # check that order is not created
        self.assertEqual(Order.objects.count(), 0)

    def test_create_new_expiry_with_invalid_item_id(self):
        request_with_invalid_item_id = self.request.copy()
        request_with_invalid_item_id["item"] = -1
        response = self.client.post(
            self.url, request_with_invalid_item_id, format="json"
        )
        self.assertEqual(response.status_code, 500)

        # check that item total_quantity is not updated
        updated_item = Item.objects.get(id=self.item.id)
        self.assertEqual(updated_item.total_quantity, 100)

        # check that itemExpiry is not created
        self.assertEqual(self.item.expiry_dates.count(), 2)

        # check that order is not created
        self.assertEqual(Order.objects.count(), 0)

    def tearDown(self):
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        ItemExpiry.objects.all().delete()
        Item.objects.all().delete()
        return super().tearDown()
