# Generated by Django 4.1.13 on 2024-03-10 04:11

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="item",
            name="imgpic",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
