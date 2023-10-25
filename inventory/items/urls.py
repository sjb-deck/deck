from django.urls import path, include
from inventory.items import views

urlpatterns = (
    [
        path("api/", include("inventory.api_urls")),
        path("", views.items, name="items"),
        path("cart", views.cart, name="cart"),
        path("add_item", views.add_item, name="add_item"),
        path("receipt", views.order_receipt, name="order_receipt"),
        path("item_list", views.item_list, name="item_list"),
    ]
)
