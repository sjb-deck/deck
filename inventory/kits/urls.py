from django.urls import path, include
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("kit_info", views.kit_info, name="kit_info"),
    path("create_blueprint", views.create_blueprint, name="create_blueprint"),
]
