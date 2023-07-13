from django.db import models
from .OrderModels import Order
from ..Item import ItemExpiry

"""
* A class that encapsulates an order item that belongs to an order.

    ** Attributes
    ----------
    -> order : ForeignKey
        The order that this item belongs to
    -> item_expiry : ForeignKey
        The ItemExpiryModel that this order item belongs to
    -> opened_quantity : IntegerField
        The opened_quantity that is withdrawn or deposited
    -> unopened_quantity : IntegerField
        The unopened_quantity that is withdrawn or deposited
    
"""


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item_expiry = models.ForeignKey(ItemExpiry, on_delete=models.CASCADE)
    opened_quantity = models.IntegerField(null=False, blank=False, default=0)
    unopened_quantity = models.IntegerField(null=False, blank=False, default=0)

    def __str__(self) -> str:
        return f"{self.order}, {self.item_expiry}, {self.opened_quantity}, {self.unopened_quantity}"
