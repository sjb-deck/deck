from django.test import TestCase
from django.contrib.auth.models import User
from accounts.models import UserExtras
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch


class TestTriggerUserExtras(TestCase):
    def setUp(self):
        self.username = "testuser"
        self.password = "testpass"
        self.email = "test@example.com"
        self.user = User.objects.create_user(
            username=self.username, password=self.password, email=self.email
        )
        self.img_file = SimpleUploadedFile(
            "test_img.jpg", b"file_content", content_type="image/jpeg"
        )
        self.user.extras.profile_pic = "user_dp/test_img.jpg"
        self.user.extras.save()

    def test_create_userExtras_upon_user_creation(self):
        self.assertIsNotNone(self.user.extras)
        self.assertEqual(self.user.extras.role, "User")
        self.assertEqual(self.user.extras.name, self.user.username)

    def test_save_userExtras(self):
        self.user.extras.role = "Admin"
        self.user.extras.save()
        self.assertEqual(self.user.extras.role, "Admin")

    @patch("accounts.models.delete_file")
    def test_delete_user_deletes_userExtras_and_file(self, mock_delete_file):
        self.assertIsNotNone(self.user.extras)

        # Delete the user
        user_id = self.user.id
        self.user.delete()

        # Check that UserExtras instance is deleted
        with self.assertRaises(UserExtras.DoesNotExist):
            UserExtras.objects.get(user__id=user_id)

        # Check that delete_file was called
        mock_delete_file.assert_called_once_with("user_dp/test_img.jpg")
