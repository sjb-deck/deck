from inventory.items.models import Item, ItemExpiry, Order, OrderItem


def initialize_log():
    return {
        "ERRORS": [],
        "WARNINGS": [],
        "INFO": [],
    }


# Checks integrity of items and item expiries
# 1. Check if item total quantity is valid
# 2. Check if item is below min quantity
# 3. Check if item expiry should be archived
# 4. Check if item expiry should not be archived
# 5. Check if item in item_expiry is in items
def check_items(log):
    all_items = Item.objects.all()
    all_item_expiries = ItemExpiry.objects.all()
    for item in all_items:
        if item.is_below_min_quantity():
            log["WARNINGS"].append(f"{item.name} is below min quantity")
        if not item.is_total_qty_valid():
            log["ERRORS"].append(f"{item.name} total quantity is not valid")
    for item_expiry in all_item_expiries:
        if item_expiry.should_archive() and not item_expiry.archived:
            log["WARNINGS"].append(
                f"{item_expiry.expiry_date} {item_expiry.item.name} should be archived"
            )
        if item_expiry.archived and not item_expiry.should_archive():
            log["ERRORS"].append(
                f"{item_expiry.expiry_date} {item_expiry.item.name} should not be archived"
            )
        if item_expiry.item not in all_items:
            log["ERRORS"].append(f"{item_expiry.item.name} is not in items")
    return log


# Checks integrity of orders and order items
# 1. Check if order (loan order and non-loan order) is in valid state
# 2. Check if order item is in valid state
def check_orders(log):
    all_orders = Order.objects.all()
    all_order_items = OrderItem.objects.all()
    for order in all_orders:
        try:
            order.check_valid_state()
        except Exception as e:
            log["ERRORS"].append(f"[{order}] is not in valid state: {e}")
    for order_item in all_order_items:
        try:
            order_item.check_valid_state()
        except Exception as e:
            log["ERRORS"].append(f"{order_item} is not in valid state: {e}")

    return log


# Checks if there are any entries that can be deleted
# 1. Check if item expiry can be deleted (archived, and not used in any orders ie. no entries in OrderItem)
def check_deletable_entries(log):
    item_expiries = ItemExpiry.objects.filter(archived=True)
    for item_expiry in item_expiries:
        if item_expiry.items_ordered.count() == 0:
            log["INFO"].append(f"{item_expiry} can be deleted")


def run_routine():
    log = initialize_log()
    log = check_items(log)
    log = check_orders(log)
    log = check_deletable_entries(log)
    return log
