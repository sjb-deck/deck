from django.db import models

from kits.globals import HISTORY_TYPE
from kits.models.KitModels import Kit

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
    -> pre_snapshot : JSONField
        Contents of the kit before the change.
    -> post_snapshot : JSONField
        Contents of the kit after the change.
    ** Methods
    -------
    -> TBD
"""


class History(models.Model):
    kit = models.ForeignKey(Kit, on_delete=models.RESTRICT)
    type = models.CharField(max_length=50, choices=HISTORY_TYPE)
    date = models.DateField()
    person = models.CharField(max_length=50)
    pre_snapshot = models.JSONField()
    post_snapshot = models.JSONField()

    def __str__(self) -> str:
        return f"{self.type} - {self.date}"
