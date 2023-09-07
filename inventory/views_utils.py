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
