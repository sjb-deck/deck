from .models import ItemExpiry


def manage_items_change(order_items, action):
    for item in order_items:
        item_expiry = ItemExpiry.objects.get(id=item["item_expiry"])
        if action == "Withdraw":
            item_expiry.withdraw(item["opened_quantity"], item["unopened_quantity"])
        elif action == "Deposit":
            item_expiry.deposit(item["opened_quantity"], item["unopened_quantity"])
        else:
            raise Exception("Items could not be updated!")
