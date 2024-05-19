from django.db import models
from django.db import transaction

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
        with transaction.atomic():
            for item in self.order_items.all():
                item.revert_order_item()
            if self.loan_active:
                self.order_items.all().delete()
                self.is_reverted = True
                self.save()
            else:
                self.loan_active = True
                self.return_date = None
                self.save()

    def check_valid_state(self):
        """
        Checks that current instance of LoanOrder is in one of the valid states:
        1. Loan is active and return_date is None
        2. Loan is not active and return_date is not None
        """
        if self.loan_active and self.return_date is not None:
            raise Exception("Loan is active but return date is not None")
        if not self.loan_active and self.return_date is None:
            raise Exception("Loan is not active but return date is None")

    def __str__(self) -> str:
        return f"LoanOrder #{self.pk}"
