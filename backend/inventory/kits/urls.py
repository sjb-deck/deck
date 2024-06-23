from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from . import views

urlpatterns = (
    [
        path("", views.api_kits, name="api_kits"),
        path("/add_kit", views.add_kit, name="add_kit"),
        path(
            "/get_new_kit_recipe/<int:blueprint_id>",
            views.get_new_kit_recipe,
            name="get_new_kit_recipe",
        ),
        path("/retire_kit/<int:kit_id>", views.retire_kit, name="retire_kit"),
        path("/add_blueprint", views.add_blueprint, name="add_blueprint"),
        path("/kit_history", views.kit_history, name="kit_history"),
        path("/submit_kit_order", views.submit_kit_order, name="submit_kit_order"),
        path("/return_kit_order", views.return_kit_order, name="return_kit_order"),
        path(
            "/restock_options/<int:kit_id>",
            views.restock_options,
            name="restock_options",
        ),
        path("/restock_kit", views.restock_kit, name="restock_kit"),
        path(
            "/revert_kit/<int:history_id>",
            views.revert_kit,
            name="revert_kit",
        ),
        path("/check_kits_expiry", views.check_kits_expiry, name="check_kits_expiry"),
    ]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
