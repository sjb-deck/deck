from django.test import TestCase
from django.contrib.auth.models import User
from accounts.models import UserExtras
import requests
from requests.auth import HTTPBasicAuth
from decouple import config
from django.core.files.uploadedfile import SimpleUploadedFile
from deck.utils import upload_file


class TestTriggerUserExtras(TestCase):
    def setUp(self):
        pass

    def test_create_userExtras_upon_user_creation(self):
        user = User.objects.create_user(
            username="testuser", password="testpass", email="test@example.com"
        )
        self.assertIsNotNone(user.extras)
        self.assertEqual(user.extras.role, "User")
        self.assertEqual(user.extras.name, user.username)

    def test_save_userExtras(self):
        user = User.objects.create_user(
            username="testuser", password="testpass", email="test@example.com"
        )
        user.extras.role = "Admin"
        user.extras.save()
        self.assertEqual(user.extras.role, "Admin")

    def test_delete_user_deletes_userExtras(self):
        user = User.objects.create_user(
            username="testuser", password="testpass", email="test@example.com"
        )
        self.img_file = SimpleUploadedFile(
            "test_img.jpg", b"file_content", content_type="image/jpeg"
        )
        user.extras.profile_pic = "user_dp/test_img.jpg"
        user.extras.save()
        upload_file(user.extras.profile_pic, self.img_file)
        # check that user image pic uploaded
        self.assertEqual(self.get_nextcloud_userImg_status(user), 200)
        userExtrasId = user.extras.id
        user.delete()
        # check that user extras deleted
        with self.assertRaises(UserExtras.DoesNotExist):
            UserExtras.objects.get(id=userExtrasId)
        # check that user image pic deleted
        self.assertEqual(self.get_nextcloud_userImg_status(user), 404)

    def get_nextcloud_userImg_status(self, user):
        username = config("NEXTCLOUD_USERNAME")
        password = config("NEXTCLOUD_APP_PASSWORD")
        nextcloud_url = f"https://nextcloud.nhhs-sjb.org/remote.php/dav/files/{username}/Shared/deck/"

        full_url = nextcloud_url + user.extras.profile_pic

        response = requests.get(full_url, auth=HTTPBasicAuth(username, password))

        return response.status_code
