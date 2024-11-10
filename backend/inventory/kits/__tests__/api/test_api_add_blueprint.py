from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, ItemExpiry
from inventory.kits.models import Blueprint
from rest_framework_simplejwt.tokens import RefreshToken


class TestApiAddBlueprintViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpass", email="testuser@example.com"
        )
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION="Bearer " + self.token)
        self.url = reverse("add_blueprint")
        self.create_items()
        self.content = [
            {"item_id": self.item.id, "quantity": 10},
            {"item_id": self.item_no_expiry.id, "quantity": 5},
        ]
        self.request = {
            "name": "Test Blueprint",
            "content": self.content,
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

    def test_create_new_blueprint(self):
        # create blueprint
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 201)

        # check that blueprint is created
        blueprint = Blueprint.objects.get(id=response.data["blueprint_id"])
        self.assertEqual(blueprint.name, "Test Blueprint")

        # check that blueprint content is created with correct compression
        self.assertEqual(blueprint.complete_content, self.content)

    def test_create_new_blueprint_with_same_name(self):
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 201)

        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Blueprint with this name already exists!"
        )

    def test_create_new_blueprint_with_invalid_name(self):
        name = self.request["name"]
        self.request["name"] = ""
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["name"] = name

    def test_create_new_blueprint_without_required_fields(self):
        name = self.request.pop("name")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["name"] = name

        content = self.request.pop("content")
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Required parameters are missing!")
        self.request["content"] = content

    def test_create_new_blueprint_with_invalid_item_id(self):
        self.request["content"][0]["item_id"] = 999
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data["message"], "Item matching query does not exist."
        )
        self.request["content"][0]["item_id"] = self.item.id

    def test_create_new_blueprint_with_invalid_quantity(self):
        quantity = self.request["content"][0]["quantity"]
        self.request["content"][0]["quantity"] = -1
        response = self.client.post(self.url, self.request, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["message"], "Quantity cannot be negative.")
        self.request["content"][0]["quantity"] = quantity

    def tearDown(self):
        Blueprint.objects.all().delete()
        ItemExpiry.objects.all().delete()
        Item.objects.all().delete()
        return super().tearDown()
