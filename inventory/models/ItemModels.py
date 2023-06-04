from django.db import models
from ..globals import typechoices

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
    -> total_quantityopen : IntegerField
        Quantity of opened item for all expirys.
        Defaults to 0
    -> total_quantityunopened : IntegerField
        Quantity of unopened item for all expirys.
        Defaults to 0
    -> min_quantityopen : IntegerField
        Minimum quantity for opened item for all expirys before warning.
        Defaults to 0
    -> min_quantityunopened : IntegerField
        Minimum quantity for unopened item for all expirys before warning.
        Defaults to 0

    ** Methods
    -------
    -> TBD
"""


class Item(models.Model):
    name = models.CharField(max_length=50)
    type = models.CharField(max_length=50, choices=typechoices, default="General")
    unit = models.CharField(max_length=50, default="units")
    imgpic = models.ImageField(null=True, blank=True, upload_to="item_img")
    total_quantityopen = models.IntegerField(null=False, blank=False, default=0)
    total_quantityunopened = models.IntegerField(null=False, blank=False, default=0)
    min_quantityopen = models.IntegerField(null=True, blank=True, default=0)
    min_quantityunopened = models.IntegerField(null=True, blank=True, default=0)
