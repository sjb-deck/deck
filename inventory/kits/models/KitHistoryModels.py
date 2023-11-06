from django.db import models

from inventory.kits.globals import HISTORY_TYPE
from inventory.kits.models.KitModels import Kit
from django.contrib.auth.models import User

"""
* A class that encapsulates a Kit History.

    ** Attributes
    ----------
    -> kit : Kit
        Kit that the history shall reference to.
    -> type : CharField
        Type of the history.
    -> date : Blueprint
        Blueprint that the kit shall reference to.
    -> person : CharField
        Person loaning or restocking the kit.
    -> snapshot : JSONField
        Contents of the kit after the change.
    ** Methods
    -------
    -> TBD
"""


class History(models.Model):
    kit = models.ForeignKey(Kit, on_delete=models.RESTRICT)
    type = models.CharField(max_length=50, choices=HISTORY_TYPE)
    date = models.DateTimeField(auto_now_add=True)
    person = models.ForeignKey(User, on_delete=models.RESTRICT)
    snapshot = models.JSONField(null=True, blank=True)
    order_id = models.IntegerField(null=True, blank=True, default=None)

    def __str__(self) -> str:
        return f"{self.type} - {self.date}"


class LoanHistory(History):
    loanee_name = models.CharField(max_length=50)
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.loanee_name} - {self.due_date}"
