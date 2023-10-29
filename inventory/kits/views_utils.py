import json

from .models import Kit
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


def kit_is_complete(kit_id):
    kit = Kit.objects.get(id=kit_id)
    kit_content = kit.content
    blueprint_content = kit.blueprint.complete_content

    for kit_item, blueprint_item in zip(kit_content, blueprint_content):
        if kit_item['item_expiry_id'] != blueprint_item['item_expiry_id']:
            return False
        if kit_item['quantity'] > blueprint_item['quantity']:
            return False
        if kit_item['quantity'] < blueprint_item['quantity']:
            return False

    return True


def content_matches(content, blueprint_content):
    for item, blueprint_item in zip(content, blueprint_content):
        if item['item_expiry_id'] != blueprint_item['item_expiry_id']:
            return False

    return True
