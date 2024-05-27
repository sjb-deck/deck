import json
from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, Order, OrderItem, ItemExpiry
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch


class TestApiAddItemViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.client.login(username="testuser", password="testpass")
        self.img_file = SimpleUploadedFile(
            "test_img.jpg", b"file_content", content_type="image/jpeg"
        )
        self.item_data = {
            "name": "Another Item",
            "type": "General",
            "unit": "units",
            "total_quantity": 100,
            "min_quantity": 10,
            "is_opened": False,
            "imgpic": self.img_file,
            "expiry_dates": json.dumps(
                [
                    {"expiry_date": "2023-12-31", "quantity": 50, "archived": False},
                    {"expiry_date": "2024-12-31", "quantity": 50, "archived": False},
                ]
            ),
        }
        self.url = reverse("api_add_item")

    @patch("inventory.items.views.upload_file", return_value="items/test_img.jpg")
    def test_create_item(self, mock_upload_file):
        response = self.client.post(self.url, self.item_data, format="multipart")

        # Check if the file was uploaded
        mock_upload_file.assert_called_once()

        self.assertEqual(response.status_code, 201)

        # Check if the item exists in the database
        item = Item.objects.get(name="Another Item")
        self.assertIsNotNone(item)
        self.assertEqual(item.type, "General")
        self.assertEqual(item.unit, "units")
        self.assertEqual(item.total_quantity, 100)
        self.assertEqual(item.min_quantity, 10)
        self.assertEqual(item.is_opened, False)

        # Check expiry dates
        expiry_dates = item.expiry_dates.all()
        self.assertEqual(expiry_dates.count(), 2)

        first_expiry = expiry_dates.get(expiry_date="2023-12-31")
        self.assertEqual(first_expiry.quantity, 50)
        self.assertEqual(first_expiry.archived, False)

        second_expiry = expiry_dates.get(expiry_date="2024-12-31")
        self.assertEqual(second_expiry.quantity, 50)
        self.assertEqual(second_expiry.archived, False)

        # check that order and order items is created
        self.assertEqual(first_expiry.items_ordered.count(), 1)
        first_order_item = first_expiry.items_ordered.first()
        first_item_create_order = first_order_item.order
        self.assertEqual(first_item_create_order.action, "Deposit")
        self.assertEqual(first_item_create_order.reason, "item_creation")
        self.assertEqual(first_order_item.item_expiry, first_expiry)
        self.assertEqual(first_order_item.ordered_quantity, 50)

        self.assertEqual(second_expiry.items_ordered.count(), 1)
        second_order_item = second_expiry.items_ordered.first()
        second_item_create_order = second_order_item.order
        self.assertEqual(second_item_create_order.action, "Deposit")
        self.assertEqual(second_item_create_order.reason, "item_creation")
        self.assertEqual(second_order_item.item_expiry, second_expiry)
        self.assertEqual(second_order_item.ordered_quantity, 50)

    def test_create_item_with_invalid_expiry_date(self):
        item_data_with_no_expiry_date = self.item_data.copy()
        item_data_with_no_expiry_date["expiry_dates"] = []
        response = self.client.post(
            self.url, item_data_with_no_expiry_date, format="json"
        )

        self.assertEqual(response.status_code, 500)

    def test_create_item_with_non_unique_expiry_date(self):
        self.client.post(self.url, self.item_data, format="json")
        response = self.client.post(self.url, self.item_data, format="json")
        self.assertEqual(response.status_code, 500)

    def test_create_item_with_non_unique_expiry(self):
        expiry = {"expiry_date": "2023-12-31", "quantity": 50, "archived": False}
        item_data_with_non_unique_expiry = self.item_data.copy()
        item_data_with_non_unique_expiry["expiry_dates"] = [expiry, expiry]
        response = self.client.post(
            self.url, item_data_with_non_unique_expiry, format="json"
        )

        self.assertEqual(response.status_code, 500)

    def test_create_item_with_non_unique_name(self):
        self.client.post(self.url, self.item_data, format="json")
        response = self.client.post(self.url, self.item_data, format="json")
        self.assertEqual(response.status_code, 500)

    @patch("inventory.items.models.ItemModels.delete_file")
    def tearDown(self, _):
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        ItemExpiry.objects.all().delete()
        Item.objects.all().delete()
        self.user.delete()
