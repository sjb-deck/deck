from django.db import models
from .ItemModels import Item

# Create your models here.
"""
* A class that encapsulates an Item Expiry.
* An Item has a one to many relationship with ItemExpiry

    ** Attributes
    ----------
    -> expirydate : DateField
        The expiry of this item
    -> quantityopen : IntegerField
        Quantity of opened item for current expirys.
        Defaults to 0
    -> quantityunopened : IntegerField
        Quantity of unopened item for current expirys.
        Defaults to 0
    -> item : Item
        The Item object that this expiry belong to
    -> archived : Boolean
        Flag that decide if the item expiry should be displayed

    ** Methods
    -------
    -> TBD
"""


class ItemExpiry(models.Model):
    expirydate = models.DateField(null=True, blank=True)
    quantityopen = models.IntegerField(null=False, blank=False, default=0)
    quantityunopened = models.IntegerField(null=False, blank=False, default=0)
    item = models.ForeignKey(
        Item, related_name="expirydates", on_delete=models.CASCADE, null=True
    )
    archived = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.expirydate}, {self.item}"
