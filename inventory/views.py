from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Item
from django.core import serializers
from django.http import JsonResponse


# Create your views here.
@login_required(login_url="/r'^login/$'")
def inventory_index(request):
    return render(request, "inventory_index.html")


@login_required(login_url="/r'^login/$'")
def items(request):
    all_items = Item.objects.all()
    serialized_data = serializers.serialize("json", all_items)
    return render(request, "items.html", {"allItems": serialized_data})
