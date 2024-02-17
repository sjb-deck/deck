import json

from rest_framework import status
from rest_framework.response import Response

from .models import Kit, Blueprint, LoanHistory
from ..items.models import *
from ..items.views_utils import create_order


# @description: This function compresses a json containing item_expiry_id and quantities into a json containing item_id
#               and quantities. The resulting quantity is the sum of all quantities of the same item_id. The function
#               also sorts the json by item_id for zip comparison later.
# @param: content - a json containing item_expiry_id and quantities
# @return: compressed_content - a json containing item_id and quantities
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

    compressed_content = [
        {"item_id": item["item_id"], "quantity": item["quantity"]}
        for item in content_dict.values()
    ]
    compressed_content = sorted(compressed_content, key=lambda x: x["item_id"])
    return compressed_content


# @description: This function checks if items in the content provided are withdraw-able (enough quantity in stock),
#               then proceeds to withdraw the items.
# @param: content - a json containing item_expiry_id and quantities
# @return: True, None - if all items are withdraw-able
#          False, item_name - if any item is not withdraw-able
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


# @description: This function checks if items in the content provided are deposit-able (quantity is not negative),
#               then proceeds to deposit the items.
# @param: content - a json containing item_expiry_id and quantities
# @return: True - if all items are deposit-able
#          False - if any item is not deposit-able
def attempt_items_deposit(content):
    for item in content:
        item_id = item.get("item_expiry_id")
        quantity = item.get("quantity")
        if not item_id or quantity is None:
            return False

        item_expiry = ItemExpiry.objects.get(id=item_id)

        if (
            item_expiry.quantity is None
            or quantity < 0
            or (item_expiry.quantity + quantity) < 0
        ):
            return False

    for item in content:
        item_id = item.get("item_expiry_id")
        quantity = item.get("quantity")

        item_expiry = ItemExpiry.objects.get(id=item_id)
        item_expiry.deposit(quantity)
        item["quantity"] = 0

    return True


# @description: This function builds the payload to call create_order which returns an order_id
# @param: content - a json containing item_expiry_id and quantities
#         request - the request object
#         kit - the kit object
#         is_withdraw - a boolean indicating if the order to restock or to retire the kit
#         is_create_kit - a boolean indicating if the order is to create a kit, default is False
# @return: order_id - the id of the order created
def transact_items(content, request, kit, is_withdraw, is_create_kit=False):
    order_items = [
        {"item_expiry_id": item["item_expiry_id"], "ordered_quantity": item["quantity"]}
        for item in content
    ]
    payload = {
        "action": "Withdraw" if is_withdraw else "Deposit",
        "reason": "kit_create"
        if is_create_kit
        else ("kit_restock" if is_withdraw else "kit_retire"),
        "order_items": order_items,
    }

    order = create_order(payload, request)

    # Update other_info with kit data
    order.other_info = json.dumps({"kit_id": kit.id, "kit_name": kit.name})
    order.save()
    return order.id


# @description: This function checks if the kit is complete, but does not check for overloads, since handling overloads
#               is not part of the responsibility of this apis using this function.
# @param: kit_id - the id of the kit
# @return: True - if the kit is complete
#          False - if the kit is not complete
def kit_is_complete(kit_id):
    kit = Kit.objects.get(id=kit_id)
    kit_content = compress_content(kit.content)  # sorted by item_id
    blueprint_content = sorted(
        kit.blueprint.complete_content, key=lambda x: x["item_id"]
    )

    if len(kit_content) < len(blueprint_content):
        return False

    # assume now there are equal number of items in kit and blueprint and they are sorted
    for kit_item, blueprint_item in zip(kit_content, blueprint_content):
        if kit_item["quantity"] > blueprint_item["quantity"]:
            return False
        if kit_item["quantity"] < blueprint_item["quantity"]:
            return False

    return True


# @description: This function checks if the content of the kit is at least valid; Does not need to be complete, but must
#               not be overloaded.
# @param: content - the content of the kit
#         blueprint_content - the original content of the kit
# @return: True, True - if the kit content is valid and not overloaded
#          True, False - if the kit content is valid but overloaded
#          False, None - if the kit content is not valid, content does not match blueprint
def check_valid_kit_content(compressed_content, blueprint_content):
    blueprint_content = sorted(blueprint_content, key=lambda x: x["item_id"])
    blueprint_content_dict = {item["item_id"]: item for item in blueprint_content}

    for item in compressed_content:
        if item["item_id"] not in blueprint_content_dict:
            return False, None

    for item in compressed_content:
        if item["quantity"] > blueprint_content_dict[item["item_id"]]["quantity"]:
            return True, False

    return True, True


# @description: This function checks if the returning content matches the original content of the kit, which does not
#               need to be necessarily complete if force loan was initiated.
# @param: content - the returning content of the kit
#         original_content - the original content of the kit
def order_return_matches(content, original_content):
    for item, original_item in zip(content, original_content):
        if item["item_expiry_id"] != original_item["item_expiry_id"]:
            return False, True
        if item["quantity"] > original_item["quantity"]:
            return False, False

    return True, None


def build_empty_compressed_kit(blueprint_id):
    content = Blueprint.objects.get(id=blueprint_id).complete_content

    # Change all quantities to 0
    for item in content:
        item["quantity"] = 0

    return content


# @description: This function gets options to stock up a kit from its current state, which might be empty if creating a
#               new kit.
# @param: blueprint_id - the id of the blueprint of the kit
#         given_content - the current content of the kit, if any
def get_restock_options(blueprint_id, given_content):
    current_content = (
        compress_content(given_content)
        if given_content
        else build_empty_compressed_kit(blueprint_id)
    )

    blueprint_content = Blueprint.objects.get(id=blueprint_id).complete_content

    # Check that there is no unexpected item in current_content that is not in blueprint_content
    for item in current_content:
        if item["item_id"] not in [item["item_id"] for item in blueprint_content]:
            raise Exception(
                "Unexpected item in current content that is not defined in kit blueprint!"
            )

    restock_options = []
    current_content_dict = {item["item_id"]: item for item in current_content}

    for item in blueprint_content:
        main_item = Item.objects.get(id=item["item_id"])
        curr_quantity = (
            current_content_dict[item["item_id"]]["quantity"]
            if item["item_id"] in current_content_dict
            else 0
        )
        missing_quantity = None

        if item["item_id"] not in current_content_dict:
            missing_quantity = item["quantity"]
        elif curr_quantity < item["quantity"]:
            missing_quantity = item["quantity"] - curr_quantity
        elif current_content_dict[item["item_id"]]["quantity"] > item["quantity"]:
            raise Exception(
                "Current content has more than expected quantity of an item!"
            )
        else:  # current_content_dict[item["item_id"]]["quantity"] == item["quantity"]
            continue

        options = (
            main_item.expiry_dates.all().filter(archived=False).order_by("expiry_date")
        )
        item_options = []

        for option in options:
            item_options.append(
                {
                    "item_expiry_id": option.id,
                    "expiry_date": option.expiry_date,
                    "quantity": option.quantity,
                }
            )

        restock_options.append(
            {
                "item_id": main_item.id,
                "item_name": main_item.name,
                "current_quantity": curr_quantity,
                "required_quantity": item["quantity"],
                "missing_quantity": missing_quantity,
                "item_options": item_options,
                "sufficient_stock": False
                if main_item.total_quantity < missing_quantity
                else True,
            }
        )

    return restock_options


# @description: This function merges the content of a kit and the restocking content, and returns the merged content.
# @param: kit_content - the current content of the kit
#         restock_content - the restocking content of the kit
# @return: merged_content - the merged content of the kit, which is the predicted new kit that will then be checked for
#                           validity separately.
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

    return [
        {"quantity": quantity, "item_expiry_id": item_expiry_id}
        for item_expiry_id, quantity in merged_content.items()
    ]


# @description: This function checks for what items are used in the kit following a return of the kit, by comparing the
#               current content with the previous snapshot.
# @param: current_content - the current content of the kit
#         previous_content - the previous snapshot content of the kit
# @return: stock_change - a list of items that are used in the kit, with their quantity used
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
            stock_change.append(
                {"item_expiry_id": item_expiry_id, "quantity": quantity}
            )

    return stock_change
