from django.db import models

from .ItemModels import Item

# Create your models here.
"""
* A class that encapsulates an Item Expiry.
* An Item has a one to many relationship with ItemExpiry

    ** Attributes
    ----------
    -> expiry_date : DateField
        The expiry of this item
    -> quantity : IntegerField
        Quantity of opened item for current expirys.
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
    expiry_date = models.DateField(null=True, blank=True)
    quantity = models.IntegerField(null=False, blank=False, default=0)
    item = models.ForeignKey(
        Item, related_name="expiry_dates", on_delete=models.CASCADE, null=True
    )
    archived = models.BooleanField(default=False)

    def withdraw(self, quantity):
        self.quantity -= quantity
        self.save()

        self.item.total_quantity -= quantity
        self.item.save()

    def deposit(self, quantity):
        self.quantity += quantity
        self.save()

        self.item.total_quantity += quantity
        self.item.save()

    def __str__(self) -> str:
        return f"{self.expiry_date}, {self.item}"
