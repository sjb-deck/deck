# myapp/api_urls.py
from django.urls import path

from inventory.items import views as item_views
from inventory.kits import views as kit_views
from inventory import views

item_api_urls = [
    path("items", item_views.api_items, name="api_items"),
    path("orders", item_views.api_orders, name="api_orders"),
    path("orders/<str:option>", item_views.api_orders, name="api_orders_option"),
    path(
        "orders/<str:option>/<int:order_id>",
        item_views.api_orders,
        name="api_order_items",
    ),
    path("submit_order", item_views.api_submit_order, name="submit_order"),
    path("add_item", item_views.api_add_item, name="api_add_item"),
    path("add_expiry", item_views.create_new_expiry, name="create_new_expiry"),
    path("loan_return_post", item_views.loan_return_post, name="loan_return_post"),
    path("revert_order", item_views.revert_order, name="revert_order"),
    path("export_items", item_views.export_items_csv, name="export_items"),
    path("import_items", item_views.import_items_csv, name="import_items"),
    path("kits", kit_views.api_kits, name="api_kits"),
    path("add_kit", kit_views.add_kit, name="add_kit"),
    path(
        "get_new_kit_recipe/<int:blueprint_id>",
        kit_views.get_new_kit_recipe,
        name="get_new_kit_recipe",
    ),
    path("retire_kit/<int:kit_id>", kit_views.retire_kit, name="retire_kit"),
    path("add_blueprint", kit_views.add_blueprint, name="add_blueprint"),
    path("kit_history/<int:kit_id>", kit_views.kit_history, name="kit_history"),
    path("submit_kit_order", kit_views.submit_kit_order, name="submit_kit_order"),
    path("return_kit_order", kit_views.return_kit_order, name="return_kit_order"),
    path(
        "restock_options/<int:kit_id>",
        kit_views.restock_options,
        name="restock_options",
    ),
    path("restock_kit", kit_views.restock_kit, name="restock_kit"),
    path(
        "revert_kit/<int:history_id>",
        kit_views.revert_kit,
        name="revert_kit",
    ),
]

urlpatterns = [
    path("user", views.api_user, name="api_user"),
] + item_api_urls
