from django.db import models
from django.contrib.auth.models import User


class UserExtras(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="extras")
    profilepic = models.ImageField(null=True, blank=True, upload_to="user_dp")
    role = models.CharField(max_length=50, default="User")
    name = models.CharField(max_length=50, blank=True)

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = self.user.username
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.username
