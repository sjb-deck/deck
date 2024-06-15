from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from inventory import views

urlpatterns = (
    [
        path("items", include("inventory.items.urls")),
        path("kits", include("inventory.kits.urls")),
    ]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
