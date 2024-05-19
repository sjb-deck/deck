from django.contrib.auth.models import User
from django.db import models

from django.db.models.signals import post_delete
from django.dispatch import receiver
from deck.utils import delete_file


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


# Delete the image file associated with the user when the user is deleted
@receiver(post_delete, sender=UserExtras)
def post_delete(sender, instance, *args, **kwargs):
    if instance.profile_pic:
        image_path = instance.profile_pic
        delete_file(image_path)
