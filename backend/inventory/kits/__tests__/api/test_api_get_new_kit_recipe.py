from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry
from inventory.kits.models import Blueprint


class TestApiGetNewKitRecipeViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.client.login(username="testuser", password="testpass")
        self.create_items()
        self.compressed_blueprint_content = [
            {"item_id": self.item.id, "quantity": 10},
            {"item_id": self.item_no_expiry.id, "quantity": 5},
        ]
        self.create_blueprint()
        self.item_expiry1_id = self.itemExpiry1.id
        self.item_expiry2_id = self.itemExpiry2.id
        self.item_no_expiry_id = self.itemExpiry_no_expiry.id
        self.blueprint_id = self.blueprint.id

    def create_blueprint(self):
        self.blueprint = Blueprint.objects.create(
            name="Test Blueprint",
            complete_content=self.compressed_blueprint_content,
        )

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

    def test_get_recipe(self):
        response = self.client.get(
            reverse("get_new_kit_recipe", args=[self.blueprint_id]), None, format="json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["item_id"], self.item.id)
        self.assertEqual(response.data[0]["required_quantity"], 10)
        self.assertEqual(
            response.data[0]["item_options"][0]["item_expiry_id"], self.itemExpiry1.id
        )
        self.assertEqual(response.data[0]["item_options"][0]["quantity"], 50)
        self.assertEqual(
            response.data[0]["item_options"][1]["item_expiry_id"], self.itemExpiry2.id
        )
        self.assertEqual(response.data[0]["item_options"][1]["quantity"], 50)

        self.assertEqual(response.data[1]["item_id"], self.item_no_expiry.id)
        self.assertEqual(response.data[1]["required_quantity"], 5)
        self.assertEqual(
            response.data[1]["item_options"][0]["item_expiry_id"],
            self.itemExpiry_no_expiry.id,
        )
        self.assertEqual(response.data[1]["item_options"][0]["quantity"], 50)

    def test_get_recipe_with_invalid_blueprint(self):
        response = self.client.get(
            reverse("get_new_kit_recipe", args=[0]), None, format="json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Blueprint matching query does not exist."
        )

    def tearDown(self):
        ItemExpiry.objects.all().delete()
        Item.objects.all().delete()
        Blueprint.objects.all().delete()
        return super().tearDown()
