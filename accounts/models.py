from django.db import models
from django.contrib.auth.models import User


class UserExtras(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="extras")
    profilepic = models.ImageField(null=True, blank=True, upload_to="user_dp")
    role = models.CharField(max_length=50, default="User")

    def __str__(self):
        return self.user.username
