import json

from ..items.models import *


def attempt_items_withdrawal(content):
    for item in content:
        item_id = item.get("item_expiry_id")
        quantity = item.get("quantity")
        stock = ItemExpiry.objects.get(id=item_id)
        if stock.quantity < quantity:
            return False

    for item in content:
        item_id = item.get("item_expiry_id")
        quantity = item.get("quantity")
        stock = ItemExpiry.objects.get(id=item_id)
        stock.withdraw(quantity)

    return True


def attempt_items_deposit(content):
    for item in content:
        item_id = item.get("item_expiry_id")
        quantity = item.get("quantity")
        if not item_id or quantity is None:
            return False

        item_expiry = ItemExpiry.objects.get(id=item_id)

        if item_expiry.quantity is None or quantity < 0 or (item_expiry.quantity + quantity) < 0:
            return False

    for item in content:
        item_id = item.get("item_expiry_id")
        quantity = item.get("quantity")

        item_expiry = ItemExpiry.objects.get(id=item_id)
        item_expiry.deposit(quantity)
        item["quantity"] = 0

    return True
