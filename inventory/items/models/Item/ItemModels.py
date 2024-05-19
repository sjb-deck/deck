from django.db import models

from inventory.items.globals import typechoices
from django.db.models.signals import post_delete
from django.dispatch import receiver
from deck.utils import delete_file

# Create your models here.
"""
* A class that encapsulates an Item.

    ** Attributes
    ----------
    -> name : CharField
        Name of the item
    -> type : CharField
        Item type (limited to choices specified in typechoices),
        defaults to 'General'
    -> unit : CharField
        Metric to measure quantity. Defualts to 'units'
    -> image : CharField
        Directory path to image. Can be blank
    -> total_quantity : IntegerField
        Quantity of item for all expirys.
        Defaults to 0
    -> min_quantity : IntegerField
        Minimum quantity for item for all expirys before warning.
        Defaults to 0
    -> is_opened : BooleanField
        Whether item is opened or not.

    ** Methods
    -------
    -> TBD
"""


class Item(models.Model):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50, choices=typechoices, default="General")
    unit = models.CharField(max_length=50, default="units")
    imgpic = models.CharField(max_length=200, blank=True, null=True)
    total_quantity = models.IntegerField(null=False, blank=False, default=0)
    min_quantity = models.IntegerField(null=True, blank=True, default=0)
    is_opened = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.name}"


# Delete the image file associated with the item when the item is deleted
@receiver(post_delete, sender=Item)
def post_delete(sender, instance, *args, **kwargs):
    if instance.imgpic:
        image_path = instance.imgpic
        delete_file(image_path)
