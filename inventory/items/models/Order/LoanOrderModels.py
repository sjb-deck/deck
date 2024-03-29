from django.db import models

from .OrderModels import Order

"""
* A class that encapsulates a loan order placed by the user. It is the child of Order.

    ** Attributes
    ----------
    -> loanee_name : CharField
        The name of the loanee
    -> due_date : DateTimeField
        The date and time that the loanee is expected to return the item
    -> return_date : DateTimeField
        The date and time that the loanee returned the item
    -> loan_active : BooleanField
        Whether the loan is active or not

"""


class LoanOrder(Order):
    loanee_name = models.CharField(max_length=50)
    return_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateField(null=False, blank=False)
    loan_active = models.BooleanField(default=True)

    def revert_order(self):
        for item in self.order_items.all():
            item.revert_order_item()
        if self.loan_active:
            self.delete()
        else:
            self.loan_active = True
            self.return_date = None
            self.save()

    def __str__(self) -> str:
        return f"LoanOrder #{self.pk}"
