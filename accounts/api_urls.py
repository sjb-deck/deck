from django.urls import path
from accounts import views

urlpatterns = [
    path("edit", views.edit, name="edit"),
]
