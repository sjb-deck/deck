from django.db import models
from inventory.kits.globals import BLUEPRINT_STATUS

"""
* A class that encapsulates a Kit Blueprint. The blueprint acts as an identifier for the type of the kit.

    ** Attributes
    ----------
    -> name : CharField
        Name for the blueprint.
    -> complete_content : JSONField
        Contents of the kit when it is complete.
    ** Methods
    -------
    -> TBD
"""


class Blueprint(models.Model):
    name = models.CharField(max_length=50)
    status = models.CharField(max_length=50, choices=BLUEPRINT_STATUS, default="ACTIVE")
    complete_content = models.JSONField()

    def __str__(self) -> str:
        return f"{self.name}"
