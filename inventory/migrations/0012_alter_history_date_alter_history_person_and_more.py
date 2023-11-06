# Generated by Django 4.1.10 on 2023-11-06 15:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("inventory", "0011_alter_order_reason"),
    ]

    operations = [
        migrations.AlterField(
            model_name="history",
            name="date",
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name="history",
            name="person",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.RESTRICT,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="loanhistory",
            name="due_date",
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name="loanhistory",
            name="return_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]