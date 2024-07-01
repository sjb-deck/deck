from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView,
)
from .views import TokenObtainPairViewWithUserData
from accounts import views

urlpatterns = (
    [
        path(
            "token/",
            TokenObtainPairViewWithUserData.as_view(),
            name="token_obtain_pair",
        ),
        path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
        path("token/blacklist/", TokenBlacklistView.as_view(), name="token_blacklist"),
        path("edit", views.edit, name="edit"),
    ]
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
