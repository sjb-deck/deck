# myapp/api_urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("items", views.api_items, name="api_items"),
    path("user", views.api_user, name="api_user"),
]
