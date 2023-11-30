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
    item_expiry = models.ForeignKey(
        ItemExpiry, on_delete=models.CASCADE, related_name="items_ordered"
    )
    ordered_quantity = models.IntegerField(null=False, blank=False, default=0)
    returned_quantity = models.IntegerField(null=True, blank=True)

    def revert_order_item(self):
        item_expiry = self.item_expiry
        if self.order.reason == "loan":
            return self.revert_loan_order_item()
        elif self.order.action == "Deposit":
            item_expiry.withdraw(self.ordered_quantity)
        elif self.order.action == "Withdraw":
            item_expiry.deposit(self.ordered_quantity)

    def revert_loan_order_item(self):
        """
        Possible states:
        1. Loan order is active: Deposit the ordered qty and delete order
        2. Loan order is not active: Withdraw the returned qty and set loan to active
        """
        item_expiry = self.item_expiry
        loan_order = self.order.loanorder
        if loan_order.loan_active:
            item_expiry.deposit(self.ordered_quantity)
        else:
            item_expiry.withdraw(self.returned_quantity)
            self.returned_quantity = None
            self.save()

    def __str__(self) -> str:
        return f"{self.order}, {self.item_expiry}"
