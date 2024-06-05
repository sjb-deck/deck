from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from inventory import views

urlpatterns = (
    [
        path("", views.inventory_index, name="inventory_index"),
        path("api/", include("inventory.api_urls")),
        path("items/", include("inventory.items.urls")),
        path("kits/", include("inventory.kits.urls")),
        path("admin", views.admin, name="admin"),
        path("loan_return", views.loan_return, name="loan_return"),
        path("notifications", views.notifications, name="notifications"),
    ]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
