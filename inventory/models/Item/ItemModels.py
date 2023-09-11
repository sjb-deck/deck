from django.db import models

from inventory.globals import typechoices

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
    imgpic = models.ImageField(null=True, blank=True, upload_to="item_img")
    total_quantity = models.IntegerField(null=False, blank=False, default=0)
    min_quantity = models.IntegerField(null=True, blank=True, default=0)
    is_opened = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.name}"
