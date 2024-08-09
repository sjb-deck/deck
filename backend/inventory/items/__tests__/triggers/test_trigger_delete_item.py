from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from inventory.items.models import Item
import requests
from requests.auth import HTTPBasicAuth
from unittest.mock import patch


class TestTriggerDeleteItem(TestCase):
    def setUp(self):
        # Create image file
        self.img_file = SimpleUploadedFile(
            "test_img.jpg", b"file_content", content_type="image/jpeg"
        )
        # Create the item
        self.item = Item.objects.create(
            name="Another Item",
            type="General",
            unit="units",
            total_quantity=100,
            min_quantity=10,
            is_opened=False,
            imgpic="items/test_img.jpg",
        )

    @patch("inventory.items.models.ItemModels.delete_file")
    def test_trigger_delete_item(self, mock_delete_file):
        self.item.delete()
        mock_delete_file.assert_called_once_with("items/test_img.jpg")
