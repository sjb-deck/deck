from django.db import models
from .OrderModels import Order

"""
* A class that encapsulates a loan order placed by the user. It is the child of Order.

    ** Attributes
    ----------
    -> order : ForeignKey
        The order that this item belongs to
    -> loanee_name : CharField
        The name of the loanee
    -> return_date : DateField
        The date that the loanee is expected to return the item

"""


class LoanOrder(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    loanee_name = models.CharField(max_length=50)
    return_date = models.DateField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.order}, {self.loanee_name}"
