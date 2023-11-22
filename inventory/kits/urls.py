from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from inventory.kits import views

urlpatterns = (
    [path("", views.kits, name="kits")]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
