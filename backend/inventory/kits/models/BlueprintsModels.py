from django.db import models

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
    archived = models.BooleanField(default=False)
    complete_content = models.JSONField()

    def __str__(self) -> str:
        return f"{self.name}"
