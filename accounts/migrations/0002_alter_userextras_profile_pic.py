# Generated by Django 4.1.13 on 2024-03-09 17:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userextras",
            name="profile_pic",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]