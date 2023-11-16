from inventory.items.serializers import OrderSerializer, AddItemExpirySerializer, ItemSerializer
from django.db import transaction



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
    expiry_serializer = AddItemExpirySerializer(data=data)
    if expiry_serializer.is_valid(raise_exception=True):
        with transaction.atomic():
            expiry = expiry_serializer.save()
            payload = create_payload_for_new_expiry_order(data, expiry.id)
            order = create_order(payload, request)
            order.save()
    return expiry, order
  