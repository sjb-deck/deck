from django.contrib.auth.models import User
from django.db import models


class UserExtras(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="extras")
    profile_pic = models.CharField(max_length=200, blank=True, null=True)
    role = models.CharField(max_length=50, default="User")
    name = models.CharField(max_length=50, blank=True)

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.user.username
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.username
