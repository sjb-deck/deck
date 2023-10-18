# myapp/api_urls.py
from django.urls import path

from . import views

urlpatterns = [
    path("items", views.api_items, name="api_items"),
    path("user", views.api_user, name="api_user"),
    path("orders", views.api_orders, name="api_orders"),
    path("orders/<str:option>", views.api_orders, name="api_orders_option"),
    path(
        "orders/<str:option>/<int:order_id>", views.api_orders, name="api_order_items"
    ),
    path("submit_order", views.api_submit_order, name="submit_order"),
    path("add_item", views.api_add_item, name="api_add_item"),
    path("add_expiry", views.create_new_expiry, name="create_new_expiry"),
    path("loan_return_post", views.loan_return_post, name="loan_return_post"),
    path("revert_order", views.revert_order, name="revert_order"),
    path("export_items", views.export_items_csv, name="export_items"),
    path("import_items", views.import_items_csv, name="import_items"),
]
