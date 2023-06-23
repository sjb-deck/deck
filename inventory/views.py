from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Item, ItemExpiry
from django.core import serializers
from django.contrib.auth.models import User
from accounts.models import UserExtras
from django.forms.models import model_to_dict
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import ItemSerializer, UserExtrasSerializer


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
def cart(request):
    user_data = serializers.serialize("json", [request.user.extras.first()])
    return render(request, "cart.html", {"userData": user_data})


# APIs


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
