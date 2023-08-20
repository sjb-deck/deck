from django.db import models

from ..Item import ItemExpiry
from .OrderModels import Order

"""
* A class that encapsulates an order item that belongs to an order.

    ** Attributes
    ----------
    -> order : ForeignKey
        The order that this item belongs to
    -> item_expiry : ForeignKey
        The ItemExpiryModel that this order item belongs to
    -> ordered_quantity : IntegerField
        The quantity that is withdrawn or deposited
    -> returned_quantity : IntegerField
        Only used for loan orders. The quantity that is returned by the loanee
    
"""


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="order_items"
    )
    item_expiry = models.ForeignKey(ItemExpiry, on_delete=models.CASCADE)
    ordered_quantity = models.IntegerField(null=False, blank=False, default=0)
    returned_quantity = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.order}, {self.item_expiry}"
