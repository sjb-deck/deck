from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models.ItemModels import Item
from django.core import serializers
from django.contrib.auth.models import User
from accounts.models import UserExtras
from django.forms.models import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import ItemSerializer, UserExtrasSerializer, ExpiryItemSerializer
import json


# Create your views here.
@login_required(login_url="/r'^login/$'")
def inventory_index(request):
    return render(request, "inventory_index.html")


@login_required(login_url="/r'^login/$'")
def items(request):
    return render(request, "items.html")


@login_required(login_url="/r'^login/$'")
def cart(request):
    return render(request, "cart.html")


@login_required(login_url="/r'^login/$'")
def add_item(request):
    return render(request, "add_item.html")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_items(request):
    all_items = Item.objects.prefetch_related("expirydates").all()
    items_data = []

    for item in all_items:
        item_dict = model_to_dict(item)
        item_dict["expirydates"] = [
            model_to_dict(expiry) for expiry in item.expirydates.all()
        ]
        items_data.append(item_dict)

    items_data = ItemSerializer(all_items, many=True).data
    return Response(items_data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_user(request):
    user_data = UserExtrasSerializer(request.user.extras.first()).data
    print(user_data)
    return Response(user_data)


@api_view(["POST"])
@login_required(login_url="/r'^login/$'")
def add_item_post(request):
    if request.method == "POST":
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            new_item = serializer.save()
            return Response({"message": "Form data added successfully"}, status=201)
        else:
            return Response({"errors": serializer.errors}, status=400)
    else:
        return Response({"error": "Invalid request method"}, status=405)


@api_view(["POST"])
@login_required(login_url="/r'^login/$'")
def add_expiry_post(request):
    if request.method == "POST":
        expiry_serializer = ExpiryItemSerializer(data=request.data)
        if expiry_serializer.is_valid():
            expiry_serializer.save()
            return Response({"message": "Form data added successfully yay"}, status=201)
        else:
            return Response({"errors": "serialise fail"}, status=400)
    else:
        return Response({"error": "Invalid request method"}, status=405)
