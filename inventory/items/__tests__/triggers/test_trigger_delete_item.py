from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from inventory.items.models import Item
from deck.utils import upload_file
import requests
from requests.auth import HTTPBasicAuth
from decouple import config


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
        # Upload the image file
        upload_file(self.item.imgpic, self.img_file)

        # check that item image pic uploaded
        self.assertEqual(self.get_nextcloud_item_status(self.item), 200)

    def test_trigger_delete_item(self):
        self.item.delete()
        # check that item image pic deleted
        self.assertEqual(self.get_nextcloud_item_status(self.item), 404)

    def get_nextcloud_item_status(self, item):
        username = config("NEXTCLOUD_USERNAME")
        password = config("NEXTCLOUD_APP_PASSWORD")
        nextcloud_url = f"https://nextcloud.nhhs-sjb.org/remote.php/dav/files/{username}/Shared/deck/"

        full_url = nextcloud_url + item.imgpic

        response = requests.get(full_url, auth=HTTPBasicAuth(username, password))

        return response.status_code
