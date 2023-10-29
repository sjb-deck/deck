from enum import Enum


KIT_STATUS = [
    ("ON_LOAN", "ON_LOAN"),
    ("READY", "READY"),
    ("SERVICING", "SERVICING"),
    ("RETIRED", "RETIRED"),
]


HISTORY_TYPE = [
    ("LOAN", "LOAN"),
    ("RETURN", "RETURN"),
    ("RESTOCK", "RESTOCK"),
    ("CREATION", "CREATION"),
    ("RETIREMENT", "RETIREMENT"),
    ("LOAN AND REVERT", "LOAN AND REVERT"),
]

BLUEPRINT_STATUS = [
    ("ACTIVE", "ACTIVE"),
    ("DELETED", "DELETED"),
]
