# myapp/api_urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("items", views.api_items, name="api_items"),
    path("user", views.api_user, name="api_user"),
    path("submit_order", views.submit_order, name="submit_order"),
    path("add_expiry_post", views.add_expiry_post, name="add_expiry_post"),
    path("create_new_expiry", views.create_new_expiry, name="create_new_expiry"),
    path("loans", views.api_loans, name="api_loans"),
    path("loan_return_post", views.loan_return_post, name="loan_return_post"),
    path("orders", views.api_orders, name="api_orders"),
    path("revert_order", views.revert_order, name="revert_order"),
]
