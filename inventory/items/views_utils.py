from inventory.items.serializers import OrderSerializer

import json


def manage_items_change(order):
    try:
        action = order.action
        for item in order.order_items.all():
            item_expiry = item.item_expiry
            if action == "Withdraw":
                item_expiry.withdraw(item.ordered_quantity)
            elif action == "Deposit":
                item_expiry.deposit(item.ordered_quantity)
    except Exception as e:
        print("Error when updating quantity")
        raise e


def create_order(data, request):
    try:
        serializer = OrderSerializer(data=data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            order = serializer.save()
            manage_items_change(order)
            return order
    except Exception as e:
        print("Error when creating order")
        raise e
