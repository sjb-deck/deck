from django.contrib.auth.models import User
from django.db import models
from django.db import transaction

from inventory.items.globals import action_choices, action_reasons

"""
* A class that encapsulates an Order placed by the user.

    ** Attributes
    ----------
    -> action : CharField
        Withdraw or Deposit (limited to choices specified in action_choices)
    -> reason : CharField
        Reason for withdrawal or deposit (limited to choices specified in action_options)
    -> date : DateTimeField
        Date of withdrawal or deposit
    -> user : ForeignKey
        User who made the withdrawal or deposit
    -> other_info : CharField
        Other information about the withdrawal or deposit

    -> TODO: Link OrderItems to Order for quicker queries
        
    ** Methods
    -------
    -> TBD
"""


class Order(models.Model):
    action = models.CharField(max_length=50, choices=action_choices)
    reason = models.CharField(max_length=50, choices=action_reasons)
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.RESTRICT, related_name="orders")
    other_info = models.CharField(max_length=100, null=True, blank=True)

    def revert_order(self):
        with transaction.atomic():
            for item in self.order_items.all():
                item.revert_order_item()
            self.delete()

    def check_valid_state(self):
        """
        Checks the following:
        1. Order reason is Others, then other_info should not be None
        """
        if self.reason == "Others" and self.other_info is None:
            raise Exception("Order reason is Others but other_info is None")

    def __str__(self) -> str:
        return f"{self.action}, {self.reason}, {self.date}, {self.user}"
