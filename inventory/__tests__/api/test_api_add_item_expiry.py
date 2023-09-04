from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.models import Item


class TestApiAddItemExpiryViews(TestCase):
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
        self.url = reverse("create_new_expiry")
        self.clear_relevant_models()
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

    def clear_relevant_models(self):
        Item.objects.all().delete()

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

    def tearDown(self):
        self.clear_relevant_models()
        return super().tearDown()
