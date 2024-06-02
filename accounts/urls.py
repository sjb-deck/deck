from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = (
    [
        path("register", views.register, name="register"),
        path("edit", views.edit, name="edit"),
        path("api/", include("accounts.api_urls")),
    ]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
