from django.utils import timezone
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from accounts.models import User
from inventory.items.models import Item, ItemExpiry
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken


class CheckForAlertsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)

        current_date = timezone.now()

        # Create test data
        self.item1 = Item.objects.create(
            name="Item1", total_quantity=5, min_quantity=10
        )
        self.item2 = Item.objects.create(
            name="Item2", total_quantity=20, min_quantity=15
        )
        self.item3 = Item.objects.create(name="Item3", total_quantity=8, min_quantity=8)
        self.item4 = Item.objects.create(
            name="Item4", total_quantity=5, min_quantity=10
        )

        self.expired_item_expiry = ItemExpiry.objects.create(
            item=self.item1, expiry_date=current_date - timedelta(days=1), quantity=5
        )
        self.expiring_item_expiry = ItemExpiry.objects.create(
            item=self.item2, expiry_date=current_date + timedelta(days=15), quantity=10
        )
        self.non_expiring_item_expiry = ItemExpiry.objects.create(
            item=self.item3, expiry_date=current_date + timedelta(days=45), quantity=8
        )
        self.expired_item_2_expiry = ItemExpiry.objects.create(
            item=self.item4, expiry_date=current_date - timedelta(days=1), quantity=5
        )

    def clear_database(self):
        ItemExpiry.objects.all().delete()
        Item.objects.all().delete()

    def test_no_alerts(self):
        ItemExpiry.objects.all().delete()
        Item.objects.all().delete()
        response = self.client.get(reverse("check_for_alerts"))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["low_quantity_items"], [])
        self.assertEqual(data["expired_items"], [])
        self.assertEqual(data["expiring_items"], [])

    def test_low_quantity_items(self):
        response = self.client.get(reverse("check_for_alerts"))
        self.assertEqual(response.status_code, 200)
        data = response.json()

        low_quantity_items = data["low_quantity_items"]
        self.assertEqual(len(low_quantity_items), 3)
        self.assertIn(
            {"name": self.item1.name, "total_quantity": self.item1.total_quantity},
            low_quantity_items,
        )
        self.assertIn(
            {"name": self.item3.name, "total_quantity": self.item3.total_quantity},
            low_quantity_items,
        )
        self.assertIn(
            {"name": self.item4.name, "total_quantity": self.item4.total_quantity},
            low_quantity_items,
        )

    def test_expired_items(self):
        response = self.client.get(reverse("check_for_alerts"))
        self.assertEqual(response.status_code, 200)
        data = response.json()

        expired_items = data["expired_items"]
        self.assertEqual(len(expired_items), 2)
        self.assertIn(
            {
                "name": self.item1.name,
                "expiry_date": self.expired_item_expiry.expiry_date.strftime(
                    "%Y-%m-%d"
                ),
                "quantity": self.expired_item_expiry.quantity,
                "status": "expired",
            },
            expired_items,
        )
        self.assertIn(
            {
                "name": self.item4.name,
                "expiry_date": self.expired_item_2_expiry.expiry_date.strftime(
                    "%Y-%m-%d"
                ),
                "quantity": self.expired_item_2_expiry.quantity,
                "status": "expired",
            },
            expired_items,
        )

    def test_expiring_items(self):
        response = self.client.get(reverse("check_for_alerts"))
        self.assertEqual(response.status_code, 200)
        data = response.json()

        expiring_items = data["expiring_items"]
        self.assertEqual(len(expiring_items), 1)
        self.assertIn(
            {
                "name": self.item2.name,
                "expiry_date": self.expiring_item_expiry.expiry_date.strftime(
                    "%Y-%m-%d"
                ),
                "quantity": self.expiring_item_expiry.quantity,
                "status": "expiring",
            },
            expiring_items,
        )

    def test_mixed_alerts(self):
        response = self.client.get(reverse("check_for_alerts"))
        self.assertEqual(response.status_code, 200)
        data = response.json()

        low_quantity_items = data["low_quantity_items"]
        self.assertEqual(len(low_quantity_items), 3)
        self.assertIn(
            {"name": self.item1.name, "total_quantity": self.item1.total_quantity},
            low_quantity_items,
        )
        self.assertIn(
            {"name": self.item4.name, "total_quantity": self.item4.total_quantity},
            low_quantity_items,
        )

        expired_items = data["expired_items"]
        self.assertEqual(len(expired_items), 2)
        self.assertIn(
            {
                "name": self.item1.name,
                "expiry_date": self.expired_item_expiry.expiry_date.strftime(
                    "%Y-%m-%d"
                ),
                "quantity": self.expired_item_expiry.quantity,
                "status": "expired",
            },
            expired_items,
        )
        self.assertIn(
            {
                "name": self.item4.name,
                "expiry_date": self.expired_item_2_expiry.expiry_date.strftime(
                    "%Y-%m-%d"
                ),
                "quantity": self.expired_item_2_expiry.quantity,
                "status": "expired",
            },
            expired_items,
        )

        expiring_items = data["expiring_items"]
        self.assertEqual(len(expiring_items), 1)
        self.assertIn(
            {
                "name": self.item2.name,
                "expiry_date": self.expiring_item_expiry.expiry_date.strftime(
                    "%Y-%m-%d"
                ),
                "quantity": self.expiring_item_expiry.quantity,
                "status": "expiring",
            },
            expiring_items,
        )

    def test_no_alerts_with_items(self):
        # Set up items that do not trigger any alerts
        self.clear_database()
        self.item5 = Item.objects.create(
            name="Item5", total_quantity=20, min_quantity=10
        )
        self.item6 = Item.objects.create(
            name="Item6", total_quantity=15, min_quantity=10
        )
        current_date = timezone.now()
        self.item5_expiry = ItemExpiry.objects.create(
            item=self.item5, expiry_date=current_date + timedelta(days=90), quantity=20
        )
        self.item6_expiry = ItemExpiry.objects.create(
            item=self.item6, expiry_date=current_date + timedelta(days=45), quantity=15
        )

        response = self.client.get(reverse("check_for_alerts"))
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["low_quantity_items"], [])
        self.assertEqual(data["expired_items"], [])
        self.assertEqual(data["expiring_items"], [])

    def test_expired_and_expiring_with_varied_quantities(self):
        self.clear_database()
        # Set up items with expired and expiring quantities
        current_date = timezone.now()
        ItemExpiry.objects.create(
            item=Item.objects.create(name="Item8", total_quantity=10, min_quantity=5),
            expiry_date=current_date - timedelta(days=1),
            quantity=10,
            archived=False,
        )
        ItemExpiry.objects.create(
            item=Item.objects.create(name="Item9", total_quantity=10, min_quantity=5),
            expiry_date=current_date + timedelta(days=10),
            quantity=5,
            archived=False,
        )

        response = self.client.get(reverse("check_for_alerts"))
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(len(data["expired_items"]), 1)
        self.assertEqual(len(data["expiring_items"]), 1)
        self.assertEqual(data["expired_items"][0]["name"], "Item8")
        self.assertEqual(data["expiring_items"][0]["name"], "Item9")

    def tearDown(self):
        self.clear_database()
        return super().tearDown()
