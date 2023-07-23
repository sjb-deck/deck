# Generated by Django 4.1.10 on 2023-07-23 08:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Item",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50)),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("Bandages", "Bandages"),
                            ("Solution", "Solution"),
                            ("Dressing", "Dressing"),
                            ("Universal Precaution", "Universal Precaution"),
                            ("General", "General"),
                        ],
                        default="General",
                        max_length=50,
                    ),
                ),
                ("unit", models.CharField(default="units", max_length=50)),
                (
                    "imgpic",
                    models.ImageField(blank=True, null=True, upload_to="item_img"),
                ),
                ("total_quantity", models.IntegerField(default=0)),
                ("min_quantity", models.IntegerField(blank=True, default=0, null=True)),
                ("is_opened", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="ItemExpiry",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("expiry_date", models.DateField(blank=True, null=True)),
                ("quantity", models.IntegerField(default=0)),
                ("archived", models.BooleanField(default=False)),
                (
                    "item",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="expiry_dates",
                        to="inventory.item",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "action",
                    models.CharField(
                        choices=[("Withdraw", "Withdraw"), ("Deposit", "Deposit")],
                        max_length=50,
                    ),
                ),
                (
                    "reason",
                    models.CharField(
                        choices=[
                            ("kit_restock", "Kit Restock"),
                            ("loan", "Loan"),
                            ("unserviceable", "Unserviceable"),
                            ("others", "Others"),
                            ("item_restock", "Item Restock"),
                        ],
                        max_length=50,
                    ),
                ),
                ("date", models.DateTimeField(auto_now_add=True)),
                ("other_info", models.CharField(blank=True, max_length=100, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="orders",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="LoanOrder",
            fields=[
                (
                    "order_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="inventory.order",
                    ),
                ),
                ("loanee_name", models.CharField(max_length=50)),
                ("return_date", models.DateTimeField(blank=True, null=True)),
                ("loan_active", models.BooleanField(default=True)),
            ],
            bases=("inventory.order",),
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("ordered_quantity", models.IntegerField(default=0)),
                ("returned_quantity", models.IntegerField(blank=True, null=True)),
                (
                    "item_expiry",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="inventory.itemexpiry",
                    ),
                ),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="order_items",
                        to="inventory.order",
                    ),
                ),
            ],
        ),
    ]
