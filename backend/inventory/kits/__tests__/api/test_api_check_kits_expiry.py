from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User
from inventory.items.models import Item, ItemExpiry
from inventory.kits.models import Blueprint, Kit
from datetime import timedelta, datetime
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken


class TestApiCheckKitExpiryViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)
        self.url = reverse("check_kits_expiry")
        self.create_items()
        self.compressed_blueprint_content = [
            {"item_id": self.item1.id, "quantity": 1},
            {"item_id": self.item2.id, "quantity": 1},
            {"item_id": self.item_no_expiry.id, "quantity": 1},
        ]
        self.create_blueprint()
        self.item_expired1_id = self.itemExpired1.id
        self.item_expired2_id = self.itemExpired2.id
        self.itemExpiring_id = self.itemExpiring.id
        self.item_not_expired1_id = self.itemNotExpired1.id
        self.item_not_expired2_id = self.itemNotExpired2.id
        self.item_no_expiry_id = self.itemExpiry_no_expiry.id
        self.blueprint_id = self.blueprint.id

        self.kit_all_expired_content = [
            {"item_expiry_id": self.item_expired1_id, "quantity": 1},
            {"item_expiry_id": self.item_expired2_id, "quantity": 1},
            {"item_expiry_id": self.item_no_expiry_id, "quantity": 1},
        ]

        self.kit_expiring_only_content = [
            {"item_expiry_id": self.itemExpiring_id, "quantity": 1},
            {"item_expiry_id": self.item_not_expired2_id, "quantity": 1},
            {"item_expiry_id": self.item_no_expiry_id, "quantity": 1},
        ]

        self.kit_half_expired_content = [
            {"item_expiry_id": self.item_expired1_id, "quantity": 1},
            {"item_expiry_id": self.item_not_expired2_id, "quantity": 1},
            {"item_expiry_id": self.item_no_expiry_id, "quantity": 1},
        ]

        self.create_kits()
        self.kit_all_expired_id = self.kit_all_expired.id
        self.kit_expiring_only_id = self.kit_expiring_only.id
        self.kit_half_expired_id = self.kit_half_expired.id

    def create_kits(self):
        self.kit_all_expired = Kit.objects.create(
            name="AllExpired",
            blueprint=self.blueprint,
            status="READY",
            content=self.kit_all_expired_content,
        )

        self.kit_expiring_only = Kit.objects.create(
            name="ExpiringOnly",
            blueprint=self.blueprint,
            status="READY",
            content=self.kit_expiring_only_content,
        )

        self.kit_half_expired = Kit.objects.create(
            name="HalfExpired",
            blueprint=self.blueprint,
            status="READY",
            content=self.kit_half_expired_content,
        )

    def create_blueprint(self):
        self.blueprint = Blueprint.objects.create(
            name="Test Blueprint",
            complete_content=self.compressed_blueprint_content,
        )

    def create_items(self):
        self.item1 = Item.objects.create(
            name="Item 1",
            type="General",
            unit="units",
            total_quantity=100,
            min_quantity=10,
            is_opened=False,
        )
        self.itemExpired1 = self.item1.expiry_dates.create(
            expiry_date="2010-12-31", quantity=50, archived=False
        )
        self.itemNotExpired1 = self.item1.expiry_dates.create(
            expiry_date="2050-12-31", quantity=50, archived=False
        )

        expiry_date_within_30_days = timezone.now() + timedelta(days=10)
        self.itemExpiring = self.item1.expiry_dates.create(
            expiry_date=expiry_date_within_30_days, quantity=50, archived=False
        )

        self.item2 = Item.objects.create(
            name="Item 2",
            type="General",
            unit="units",
            total_quantity=100,
            min_quantity=10,
            is_opened=False,
        )
        self.itemExpired2 = self.item2.expiry_dates.create(
            expiry_date="2015-12-31", quantity=50, archived=False
        )
        self.itemNotExpired2 = self.item2.expiry_dates.create(
            expiry_date="2050-12-31", quantity=50, archived=False
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

    def test_kit_history(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        # Check for AllExpired kit
        self.assertEqual(response.data[0]["kit_name"], "AllExpired")
        self.assertEqual(response.data[0]["expiring_items"], None)
        self.assertEqual(len(response.data[0]["expired_items"]), 2)
        self.assertEqual(response.data[0]["expired_items"][0]["item_name"], "Item 1")
        self.assertEqual(
            response.data[0]["expired_items"][0]["item_expiry_id"],
            self.item_expired1_id,
        )
        self.assertEqual(
            response.data[0]["expired_items"][0]["days_expired_for"],
            (
                datetime.now().date()
                - datetime.strptime("2010-12-31", "%Y-%m-%d").date()
            ).days,
        )
        self.assertEqual(response.data[0]["expired_items"][1]["item_name"], "Item 2")
        self.assertEqual(
            response.data[0]["expired_items"][1]["item_expiry_id"],
            self.item_expired2_id,
        )
        self.assertEqual(
            response.data[0]["expired_items"][1]["days_expired_for"],
            (
                datetime.now().date()
                - datetime.strptime("2015-12-31", "%Y-%m-%d").date()
            ).days,
        )

        # Check for ExpiringOnly kit
        self.assertEqual(response.data[1]["kit_name"], "ExpiringOnly")
        self.assertEqual(len(response.data[1]["expiring_items"]), 1)
        self.assertEqual(response.data[1]["expired_items"], None)
        self.assertEqual(response.data[1]["expiring_items"][0]["item_name"], "Item 1")
        self.assertEqual(
            response.data[1]["expiring_items"][0]["item_expiry_id"],
            self.itemExpiring_id,
        )
        self.assertEqual(response.data[1]["expiring_items"][0]["days_expires_in"], 10)

        # Check for HalfExpired kit
        self.assertEqual(response.data[2]["kit_name"], "HalfExpired")
        self.assertEqual(response.data[2]["expiring_items"], None)
        self.assertEqual(len(response.data[2]["expired_items"]), 1)
        self.assertEqual(response.data[2]["expired_items"][0]["item_name"], "Item 1")
        self.assertEqual(
            response.data[2]["expired_items"][0]["item_expiry_id"],
            self.item_expired1_id,
        )
        self.assertEqual(
            response.data[0]["expired_items"][0]["days_expired_for"],
            (
                datetime.now().date()
                - datetime.strptime("2010-12-31", "%Y-%m-%d").date()
            ).days,
        )

    def tearDown(self):
        Kit.objects.all().delete()
        Blueprint.objects.all().delete()
        ItemExpiry.objects.all().delete()
        Item.objects.all().delete()
        return super().tearDown()
