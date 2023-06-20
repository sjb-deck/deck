from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models.ItemModels import Item
from django.core import serializers
from django.contrib.auth.models import User
from accounts.models import UserExtras
from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ItemSerializer
import json


# Create your views here.
@login_required(login_url="/r'^login/$'")
def inventory_index(request):
    return render(request, "inventory_index.html")


@login_required(login_url="/r'^login/$'")
def items(request):
    all_items = Item.objects.prefetch_related("expirydates").all()
    items_data = []

    for item in all_items:
        item_dict = model_to_dict(item)
        item_dict["expirydates"] = [
            model_to_dict(expiry) for expiry in item.expirydates.all()
        ]
        items_data.append(item_dict)

    items_data = json.dumps(items_data, default=str)
    user_data = serializers.serialize("json", [request.user.extras.first()])
    return render(
        request, "items.html", {"allItems": items_data, "userData": user_data}
    )


@login_required(login_url="/r'^login/$'")
def add_item(request):
    all_items = Item.objects.prefetch_related("expirydates").all()
    items_data = []

    for item in all_items:
        item_dict = model_to_dict(item)
        item_dict["expirydates"] = [
            model_to_dict(expiry) for expiry in item.expirydates.all()
        ]
        items_data.append(item_dict)

    items_data = json.dumps(items_data, default=str)
    user_data = serializers.serialize("json", [request.user.extras.first()])
    return render(
        request, "add_item.html", {"allItems": items_data, "userData": user_data}
    )


@api_view(["POST"])
@login_required(login_url="/r'^login/$'")
def add_item_post(request):
    if request.method == "POST":
        serializer = ItemSerializer(data=request.data)
        if serializer.is_valid():
            new_item = serializer.save()
            return Response({"message": "Form data added successfully"})
        else:
            return Response({"errors": serializer.errors}, status=400)
    else:
        return Response({"error": "Invalid request method"}, status=405)
