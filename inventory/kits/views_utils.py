import json

from rest_framework import status
from rest_framework.response import Response

from .models import Kit, Blueprint, LoanHistory
from ..items.models import *
from ..items.views_utils import create_order


def compress_content(content):
    content_dict = {}
    for item_expiry in content:
        item_expiry_id = item_expiry.get("item_expiry_id")
        item_expiry_quantity = item_expiry.get("quantity")
        if item_expiry_id is None or item_expiry_quantity is None:
            raise Exception("Content JSON is missing required data for an item.")

        item_id = ItemExpiry.objects.get(id=item_expiry_id).item.id

        if item_id in content_dict:
            content_dict[item_id]["quantity"] += item_expiry_quantity
        else:
            content_dict[item_id] = {
                "item_id": item_id,
                "quantity": item_expiry_quantity,
            }

    compressed_content = [{"item_id": item["item_id"], "quantity": item["quantity"]} for item in content_dict.values()]
    compressed_content = sorted(compressed_content, key=lambda x: x["item_id"])
    return compressed_content


def attempt_items_withdrawal(content):
    for item in content:
        item_id = item.get("item_expiry_id")
        quantity = item.get("quantity")
        stock = ItemExpiry.objects.get(id=item_id)
        if stock.quantity < quantity:
            return False, stock.item.name

    for item in content:
        item_id = item.get("item_expiry_id")
        quantity = item.get("quantity")
        stock = ItemExpiry.objects.get(id=item_id)
        stock.withdraw(quantity)

    return True, None


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


# Builds payload to call create_order which returns a order_id
def transact_items(content, request, kit, isWithdraw):
    order_items = [
        {"item_expiry_id": item["item_expiry_id"], "ordered_quantity": item["quantity"]}
        for item in content
    ]
    payload = {
        "action": "Withdraw" if isWithdraw else "Deposit",
        "reason": "kit_restock" if isWithdraw else "kit_retire",
        "order_items": order_items,
    }
    order = create_order(payload, request)

    # Update other_info with kit data
    order.other_info = json.dumps({"kit_id": kit.id, "kit_name": kit.name})
    order.save()
    return order.id


def kit_is_complete(kit_id):
    kit = Kit.objects.get(id=kit_id)
    kit_content = compress_content(kit.content)
    blueprint_content = kit.blueprint.complete_content

    for kit_item, blueprint_item in zip(kit_content, blueprint_content):
        if kit_item['item_id'] != blueprint_item['item_id']:
            return False
        if kit_item['quantity'] < blueprint_item['quantity']:
            return False

    return True


def content_matches(compressed_content, blueprint_content):
    for item, blueprint_item in zip(compressed_content, blueprint_content):
        if item['item_id'] != blueprint_item['item_id']:
            return False

    return True


def order_return_matches(content, original_content):
    for item, original_item in zip(content, original_content):
        if item['item_expiry_id'] != original_item['item_expiry_id']:
            return False, True
        if item['quantity'] > original_item['quantity']:
            return False, False

    return True, None


def add_more_than_expected(compressed_content, blueprint_content):
    for item, blueprint_item in zip(compressed_content, blueprint_content):
        if item['quantity'] > blueprint_item['quantity']:
            return True

    return False


def build_empty_compressed_kit(blueprint_id):
    content = Blueprint.objects.get(id=blueprint_id).complete_content

    # Change all quantities to 0
    for item in content:
        item['quantity'] = 0

    return content


def get_restock_options(blueprint_id, given_content):
    current_content = compress_content(given_content) if given_content else build_empty_compressed_kit(blueprint_id)

    blueprint_content = Blueprint.objects.get(id=blueprint_id).complete_content

    restock_options = []

    for current_item, blueprint_item in zip(current_content, blueprint_content):
        if current_item['item_id'] != blueprint_item['item_id']:
            raise Exception("Blueprint content does not match current content.")

        if current_item['quantity'] < blueprint_item['quantity']:
            main_item = Item.objects.get(id=current_item['item_id'])
            missing_quantity = blueprint_item['quantity'] - current_item['quantity']

            options = main_item.expiry_dates.all().order_by('expiry_date')
            item_options = []

            for option in options:
                item_options.append({
                    "item_expiry_id": option.id,
                    "expiry_date": option.expiry_date,
                    "quantity": option.quantity,
                })

            restock_options.append({
                "item_id": main_item.id,
                "item_name": main_item.name,
                "current_quantity": current_item['quantity'],
                "required_quantity": blueprint_item['quantity'],
                "missing_quantity": missing_quantity,
                "item_options": item_options,
                "sufficient_stock": False if main_item.total_quantity < missing_quantity else True,
            })
        elif current_item['quantity'] > blueprint_item['quantity']:
            main_item = Item.objects.get(id=current_item['item_id'])
            missing_quantity = blueprint_item['quantity'] - current_item['quantity']
            restock_options.append({
                "item_id": main_item.id,
                "item_name": main_item.name,
                "current_quantity": current_item['quantity'],
                "required_quantity": blueprint_item['quantity'],
                "missing_quantity": missing_quantity,  # Negative value
                "sufficient_stock": None,
            })

    return restock_options


def merge_contents(kit_content, restock_content):
    merged_content = {}

    for item in kit_content:
        item_expiry_id = item["item_expiry_id"]
        quantity = item["quantity"]
        merged_content[item_expiry_id] = quantity

    for item in restock_content:
        item_expiry_id = item["item_expiry_id"]
        quantity = item["quantity"]
        if item_expiry_id in merged_content:
            merged_content[item_expiry_id] += quantity
        else:
            merged_content[item_expiry_id] = quantity

    # Pop all items with quantity 0
    for item_expiry_id, quantity in list(merged_content.items()):
        if quantity == 0:
            merged_content.pop(item_expiry_id)

    return [{"quantity": quantity, "item_expiry_id": item_expiry_id} for item_expiry_id, quantity in
            merged_content.items()]


def get_stock_change(current_content, previous_content):
    curr = {}
    for item in current_content:
        item_expiry_id = item["item_expiry_id"]
        quantity = item["quantity"]
        curr[item_expiry_id] = quantity

    prev = {}
    for item in previous_content:
        item_expiry_id = item["item_expiry_id"]
        quantity = item["quantity"]
        prev[item_expiry_id] = quantity

    stock_change = []
    for item_expiry_id, quantity in curr.items():
        if item_expiry_id in prev:
            change = quantity - prev[item_expiry_id]
            stock_change.append({"item_expiry_id": item_expiry_id, "quantity": change})
        else:
            stock_change.append({"item_expiry_id": item_expiry_id, "quantity": quantity})

    return stock_change
