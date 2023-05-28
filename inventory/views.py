from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Item
from django.core import serializers
from django.contrib.auth.models import User
from accounts.models import UserExtras


# Create your views here.
@login_required(login_url="/r'^login/$'")
def inventory_index(request):
    return render(request, "inventory_index.html")


@login_required(login_url="/r'^login/$'")
def items(request):
    all_items = Item.objects.all()
    items_data = serializers.serialize("json", all_items)
    user_data = serializers.serialize("json", [request.user.extras.first()])
    return render(
        request, "items.html", {"allItems": items_data, "userData": user_data}
    )
