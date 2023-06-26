from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = (
    [
        path("api/", include("inventory.api_urls")),
        path("", views.inventory_index, name="inventory_index"),
        path("items", views.items, name="items"),
        path("cart", views.cart, name="cart"),
        path("add_item", views.add_item, name="add_item"),
        path("add_item_post", views.add_item_post, name="add_item_post"),
        path("add_expiry_post", views.add_expiry_post, name="add_expiry_post"),
    ]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
