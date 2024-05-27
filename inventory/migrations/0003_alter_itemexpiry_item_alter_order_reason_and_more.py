# Generated by Django 4.1.13 on 2024-05-19 04:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("inventory", "0002_alter_item_imgpic"),
    ]

    operations = [
        migrations.AlterField(
            model_name="itemexpiry",
            name="item",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="expiry_dates",
                to="inventory.item",
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="order",
            name="reason",
            field=models.CharField(
                choices=[
                    ("kit_restock", "Kit Restock"),
                    ("kit_create", "Kit Create"),
                    ("kit_retire", "Kit Retire"),
                    ("loan", "Loan"),
                    ("unserviceable", "Unserviceable"),
                    ("others", "Others"),
                    ("item_restock", "Item Restock"),
                    ("item_create", "Item Create"),
                ],
                max_length=50,
            ),
        ),
        migrations.AlterField(
            model_name="order",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="orders",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="orderitem",
            name="item_expiry",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="items_ordered",
                to="inventory.itemexpiry",
            ),
        ),
        migrations.AlterField(
            model_name="orderitem",
            name="order",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.RESTRICT,
                related_name="order_items",
                to="inventory.order",
            ),
        ),
    ]
