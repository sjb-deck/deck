from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = (
    [
        path("", views.inventory_index, name="inventory_index"),
        path("items", views.items, name="items"),
        path("itemlist", views.itemlist, name="itemlist"), # register the url here. This will direct a user to the itemlist function in views.py
    ]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
