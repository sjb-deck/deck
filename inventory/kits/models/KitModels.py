from django.db import models

from inventory.kits.globals import KIT_STATUS
from inventory.kits.models.BlueprintsModels import Blueprint

"""
* A class that encapsulates a Kit.

    ** Attributes
    ----------
    -> name : CharField
        Name of the kit.
    -> blueprint : Blueprint
        Blueprint that the kit shall reference to.
    -> status : CharField
        Status of the kit.
    -> content : JSONField
        Contents of the kit.
    ** Methods
    -------
    -> TBD
"""


class Kit(models.Model):
    name = models.CharField(max_length=50)
    blueprint = models.ForeignKey(Blueprint, on_delete=models.RESTRICT)
    status = models.CharField(max_length=50, choices=KIT_STATUS)
    content = models.JSONField()

    def __str__(self) -> str:
        return f"{self.name}"
