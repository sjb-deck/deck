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
        Order, on_delete=models.RESTRICT, related_name="order_items"
    )
    item_expiry = models.ForeignKey(
        ItemExpiry, on_delete=models.RESTRICT, related_name="items_ordered"
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
        # Special case: If the order is to create an item, then delete the item
        if self.order.reason == "item_creation":
            self.delete()
            item_expiry.delete()
            if item_expiry.item.expiry_dates.count() == 0:
                item_expiry.item.delete()

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

    def check_valid_state(self):
        """
        Checks that the current instance of OrderItem is in a valid state:
        1. If loan order, if loan order is active, then returned_quantity should be None
        2. If loan order, if loan order is not active, then returned_quantity should not be None
        3. If not loan order, returned_quantity should be None
        4. ordered_quantity should be greater than 0
        5. returned_quantity should be less than or equal to ordered_quantity
        """
        if self.order.reason == "loan":
            if self.order.loanorder.loan_active and self.returned_quantity is not None:
                raise Exception("Loan is active but returned quantity is not None")
            if not self.order.loanorder.loan_active and self.returned_quantity is None:
                raise Exception("Loan is returned but returned quantity is None")
        else:
            if self.returned_quantity is not None:
                raise Exception("Returned quantity is not None for non-loan order")
        if self.ordered_quantity <= 0:
            raise Exception("Ordered quantity is less than or equal to 0")
        if (
            self.returned_quantity is not None
            and self.returned_quantity > self.ordered_quantity
        ):
            raise Exception("Returned quantity is greater than ordered quantity")

    def __str__(self) -> str:
        return f"{self.order}, {self.item_expiry}"
