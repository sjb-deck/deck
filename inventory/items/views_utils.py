import datetime
from inventory.items.serializers import (
    OrderSerializer,
    AddItemExpirySerializer,
    ItemSerializer,
)
from django.db import transaction
from inventory.items.globals import typechoices


def manage_items_change(order):
    action = order.action
    for item in order.order_items.all():
        item_expiry = item.item_expiry
        if action == "Withdraw":
            item_expiry.withdraw(item.ordered_quantity)
        elif action == "Deposit":
            item_expiry.deposit(item.ordered_quantity)


def create_order(data, request):
    serializer = OrderSerializer(data=data, context={"request": request})
    if serializer.is_valid(raise_exception=True):
        order = serializer.save()
        manage_items_change(order)
        return order


def create_payload_for_new_expiry_order(data, item_expiry_id):
    payload = {
        "action": "Deposit",
        "reason": "item_restock",
        "order_items": [
            {
                "item_expiry_id": item_expiry_id,
                "ordered_quantity": data["quantity"],
            }
        ],
    }
    return payload


def create_new_item_expiry(data, request):
    expiry_serializer = AddItemExpirySerializer(
        data=data, context={"user": request.user}
    )
    if expiry_serializer.is_valid(raise_exception=True):
        with transaction.atomic():
            expiry = expiry_serializer.save()
            payload = create_payload_for_new_expiry_order(data, expiry.id)
            order = create_order(payload, request)
            order.save()
    return expiry, order


def check_correct_csv_format(row, idx):
    types = [str, str, str, int, bool, str, int, bool]
    for i, val in enumerate(row):
        # check if boolean
        if types[i] == bool:
            if val.lower() not in ["true", "false"]:
                return False, "Row {}: Expected boolean, found {}".format(idx + 1, val)
        # check if non negative integer
        elif types[i] == int:
            try:
                int(val)
                if int(val) < 0:
                    return (
                        False,
                        "Row {}: Expected non negative integer, found {}".format(
                            idx + 1, val
                        ),
                    )
            except ValueError:
                return False, "Row {}: Expected integer, found {}".format(idx + 1, val)
        # check if valid type
        elif i == 1:
            item_types = [i[0] for i in typechoices]
            if val not in item_types:
                return False, "Row {}: Expected {}, found {}".format(
                    idx + 1, item_types, val
                )
        elif not isinstance(val, types[i]):
            return False, "Row {}: Expected {}, found {}".format(idx + 1, types[i], val)
    return True, ""
