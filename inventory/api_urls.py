# myapp/api_urls.py
from django.urls import path

from inventory.items import views as item_views
from inventory import views

item_api_urls = [
    path("items", item_views.api_items, name="api_items"),
    path("orders", item_views.api_orders, name="api_orders"),
    path("submit_order", item_views.api_submit_order, name="submit_order"),
    path("add_item", item_views.api_add_item, name="api_add_item"),
    path("add_expiry", item_views.create_new_expiry, name="create_new_expiry"),
    path("loan_return_post", item_views.loan_return_post, name="loan_return_post"),
    path("revert_order", item_views.revert_order, name="revert_order"),
    path("export_items", item_views.export_items_csv, name="export_items"),
    path("import_items", item_views.import_items_csv, name="import_items"),
]

urlpatterns = [
    path("user", views.api_user, name="api_user"),
] + item_api_urls
