from django.db import models

from .OrderModels import Order

"""
* A class that encapsulates a loan order placed by the user. It is the child of Order.

    ** Attributes
    ----------
    -> loanee_name : CharField
        The name of the loanee
    -> stipulated_return_date : DateTimeField
        The date and time that the loanee is expected to return the item
    -> return_date : DateTimeField
        The date and time that the loanee returned the item
    -> loan_active : BooleanField
        Whether the loan is active or not

"""


class LoanOrder(Order):
    loanee_name = models.CharField(max_length=50)
    return_date = models.DateTimeField(null=True, blank=True)
    stipulated_return_date = models.DateTimeField(null=False, blank=False)
    loan_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"LoanOrder #{self.pk}"
