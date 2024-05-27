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
        Item, related_name="expiry_dates", on_delete=models.RESTRICT
    )
    archived = models.BooleanField(default=False)

    def withdraw(self, quantity):
        if quantity > self.quantity:
            raise Exception("Cannot withdraw more than quantity")
        if quantity < 0:
            raise Exception("Cannot withdraw negative quantity")
        if quantity is None:
            raise Exception("Cannot withdraw None quantity")

        self.quantity -= quantity
        self.save()

        self.item.total_quantity -= quantity
        self.item.save()

        if self.should_archive():
            self.archived = True
            self.save()

    def deposit(self, quantity):
        if quantity < 0:
            raise Exception("Cannot deposit negative quantity")
        if quantity is None:
            raise Exception("Cannot deposit None quantity")

        self.quantity += quantity
        self.save()

        self.item.total_quantity += quantity
        self.item.save()

        if self.archived and not self.should_archive:
            self.archived = False
            self.save()

    def should_archive(self):
        """
        Checks if we should archive. When do we need to archive?
        1. When the quantity of an item expiry is 0
        2. When there are no active loans that are associated with that item expiry
        """
        return self.quantity == 0 and not self.is_in_active_loan()

    def is_in_active_loan(self):
        return (
            self.items_ordered.all()
            .filter(order__reason="loan", order__loanorder__loan_active=True)
            .exists()
        )

    def __str__(self) -> str:
        return f"{self.expiry_date}, {self.item}"
