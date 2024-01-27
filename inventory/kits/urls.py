from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = (
    [
        path("", views.kits, name="kits"),
        path("kit_info", views.kit_info, name="kit_info"),
        path("kit_restock", views.kit_restock, name="kit_restock"),
        path("create_blueprint", views.create_blueprint, name="create_blueprint"),
    ]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
