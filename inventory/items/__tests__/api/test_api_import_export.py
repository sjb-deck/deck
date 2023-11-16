import csv
import io
import os
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from django.test import TestCase
from accounts.models import User, UserExtras
from inventory.items.models import Item, Order


class TestApiImportExportViews(TestCase):
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
        self.import_url = reverse("import_items")
        self.export_url = reverse("export_items")
        self.file_name = "test.csv"
        self.get_csv_data()
        self.clear_relevant_models()
        self.create_items()

    def create_items(self):
        item1 = Item.objects.create(
            name="CSV Item Test 1",
            type="General",
            unit="units",
            total_quantity=100,
            min_quantity=10,
            is_opened=True,
        )
        item1_expiry1 = item1.expiry_dates.create(
            expiry_date="2023-12-31", quantity=50, archived=True
        )
        item1_expiry2 = item1.expiry_dates.create(
            expiry_date="2024-12-30", quantity=50, archived=False
        )

        item2 = Item.objects.create(
            name="CSV Item Test 2",
            type="General",
            unit="units",
            total_quantity=40,
            min_quantity=10,
            is_opened=False,
        )
        item2_expiry1 = item2.expiry_dates.create(
            expiry_date="2023-12-31", quantity=16, archived=False
        )
        item2_expiry2 = item2.expiry_dates.create(
            expiry_date="2024-10-10", quantity=24, archived=True
        )

    def get_csv_data(self):
        self.valid_exported_csv = [
            ["name", "type", "unit", "expiry_date", "total_quantity", "opened"],
            ["CSV Item Test 1", "General", "units", "2023-12-31", "100", "True"],
            ["CSV Item Test 1", "General", "units", "2024-12-30", "100", "True"],
            ["CSV Item Test 2", "General", "units", "2023-12-31", "40", "False"],
            ["CSV Item Test 2", "General", "units", "2024-10-10", "40", "False"],
        ]

        self.valid_csv = [
            [
                "name",
                "type",
                "units",
                "total_quantity",
                "is_opened",
                "expiry_date",
                "expiry_quantity",
                "archived",
            ],
            [
                "CSV Item Test 5",
                "General",
                "units",
                "100",
                "True",
                "2023-12-31",
                "50",
                "0",
            ],
            [
                "CSV Item Test 5",
                "General",
                "units",
                "45",
                "True",
                "2024-12-31",
                "50",
                "0",
            ],
            [
                "CSV Item Test 1",
                "General",
                "units",
                "57",
                "True",
                "2025-12-31",
                "50",
                "0",
            ],
        ]

        self.invalid_csv_duplicate_expiry = [
            [
                "name",
                "type",
                "units",
                "total_quantity",
                "is_opened",
                "expiry_date",
                "expiry_quantity",
                "archived",
            ],
            [
                "CSV Item Test 5",
                "General",
                "units",
                "45",
                "True",
                "2026-12-31",
                "50",
                "0",
            ],
            [
                "CSV Item Test 1",
                "General",
                "units",
                "45",
                "True",
                "2023-12-31",
                "50",
                "0",
            ],
        ]

        self.invalid_csv_incorrect_values = [
            [
                "name",
                "type",
                "units",
                "total_quantity",
                "is_opened",
                "expiry_date",
                "expiry_quantity",
                "archived",
            ],
            [
                "CSV Item Test 4",
                "General",
                "units",
                "100",
                "True",
                "2023-12-31",
                "50",
                "0",
            ],
            [
                "CSV Item Test 1",
                "General",
                "units",
                "45",
                "True",
                "2026-12-31",
                "50",
                "0",
            ],
            [
                "Wrong Entry",
                "General",
                "units",
                "abc",
                "False",
                "2024-12-31",
                "50",
                "0",
            ],
            [
                "Wrong Entry2",
                "General",
                "units",
                "45",
                "False",
                "10/10/2024",
                "50",
                "0",
            ],
        ]

    def test_export_csv(self):
        response = self.client.get(self.export_url)
        content = response.content.decode("utf-8")
        reader = csv.reader(io.StringIO(content))
        body = list(reader)

        self.assertEqual(body, self.valid_exported_csv)

    def test_import_valid_csv(self):
        with open(self.file_name, "w", newline="") as file:
            writer = csv.writer(file)
            for row in self.valid_csv:
                writer.writerow(row)

        data = open(self.file_name, "rb")
        payload = SimpleUploadedFile(
            content=data.read(), name=data.name, content_type="multipart/form-data"
        )
        response = self.client.post(
            self.import_url, {"file": payload}, format="multipart"
        )
        self.assertEqual(response.status_code, 201)

        item1 = Item.objects.get(name="CSV Item Test 1")
        item1_new_expiry = item1.expiry_dates.get(expiry_date="2025-12-31")
        item2 = Item.objects.get(name="CSV Item Test 5")

        self.assertEqual(item1_new_expiry.item.id, item1.id)
        self.assertEqual(item1.total_quantity, 157)
        self.assertEqual(item2.total_quantity, 145)

        # check that order is created
        self.assertEqual(Order.objects.count(), 2)

    def test_import_invalid_csv_duplicate_expiry(self):
        with open(self.file_name, "w", newline="") as file:
            writer = csv.writer(file)
            for row in self.invalid_csv_duplicate_expiry:
                writer.writerow(row)

        data = open(self.file_name, "rb")
        payload = SimpleUploadedFile(
            content=data.read(), name=data.name, content_type="multipart/form-data"
        )
        response = self.client.post(
            self.import_url, {"file": payload}, format="multipart"
        )
        self.assertEqual(response.status_code, 400)

        item1 = Item.objects.get(name="CSV Item Test 1")
        item5 = Item.objects.filter(name="CSV Item Test 5").first()

        self.assertEqual(item1.total_quantity, 100)
        self.assertIsNone(item5)

    def test_import_invalid_csv_incorrect_values(self):
        with open(self.file_name, "w", newline="") as file:
            writer = csv.writer(file)
            for row in self.invalid_csv_incorrect_values:
                writer.writerow(row)

        data = open(self.file_name, "rb")
        payload = SimpleUploadedFile(
            content=data.read(), name=data.name, content_type="multipart/form-data"
        )
        response = self.client.post(
            self.import_url, {"file": payload}, format="multipart"
        )
        self.assertEqual(response.status_code, 400)

        item1 = Item.objects.get(name="CSV Item Test 1")
        wrong_entry = Item.objects.filter(name="Wrong Entry").first()
        wrong_entry2 = Item.objects.filter(name="Wrong Entry2").first()

        self.assertEqual(item1.total_quantity, 100)
        self.assertIsNone(wrong_entry)
        self.assertIsNone(wrong_entry2)

    def clear_relevant_models(self):
        Item.objects.all().delete()

    def tearDown(self):
        self.clear_relevant_models()
        if os.path.exists(self.file_name):
            os.remove(self.file_name)
        return super().tearDown()
