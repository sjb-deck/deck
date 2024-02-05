from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserExtras


@receiver(post_save, sender=User)
def create_user_extras(sender, instance, created, **kwargs):
    if created:
        UserExtras.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_extras(sender, instance, **kwargs):
    instance.extras.save()
