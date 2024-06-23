from django.urls import path
from inventory.items import views

urlpatterns = [
    path("", views.api_items, name="api_items"),
    path("/orders", views.api_orders, name="api_orders"),  # TODO
    path("/submit_order", views.api_submit_order, name="submit_order"),
    path("/add_item", views.api_add_item, name="api_add_item"),
    path("/add_expiry", views.create_new_expiry, name="create_new_expiry"),
    path("/loan_return_post", views.loan_return_post, name="loan_return_post"),  # TODO
    path("/revert_order", views.revert_order, name="revert_order"),  # TODO
    path("/export_items", views.export_items_csv, name="export_items"),
    path("/import_items", views.import_items_csv, name="import_items"),
    path("/check_for_alerts", views.check_for_alerts, name="check_for_alerts"),
]
