from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Item, ItemExpiry
from django.core import serializers
from django.contrib.auth.models import User
from accounts.models import UserExtras
from django.forms.models import model_to_dict
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
def itemlist(request):
    all_items = Item.objects.prefetch_related(
        "expirydates"
    ).all()  # gets all items from the database
    items_data = []

    # this will format all_items to also include item expiry
    # can take a look at inventory/models/ItemExpiryModels.py and inventory/models/ItemModels.py
    # from there we can see that ItemExpiry is a child of Item
    # ie. one item has 0, one or more ItemExpiry (one to many relationship)
    for item in all_items:
        item_dict = model_to_dict(item)
        item_dict["expirydates"] = [
            model_to_dict(expiry) for expiry in item.expirydates.all()
        ]
        items_data.append(item_dict)

    items_data = json.dumps(
        items_data, default=str
    )  # converts items_data to json format
    # gets currently logged in user object with request.user
    # request.user.extras.first() gets the UserExtra object of the currently logged in user
    # UserExtra object is defined here accounts/models.py
    # it consist of role of user, name of user and profile picture of user
    user_data = serializers.serialize("json", [request.user.extras.first()])

    # this will render the itemlist.html page with the data we want to display
    # itemlist.html is located in inventory/templates/itemlist.html
    return render(
        request, "item_list.html", {"allItems": items_data, "userData": user_data}
    )

    # Background of models in Django:
    # We have foreign keys that links models together
    # eg. ItemExpiry has a foreign key to Item (so we can access the parent Item object from an ItemExpiry object)
    # eg. UserExtras has a foreign key to User (so we can access the parent User object from a UserExtras object)
    # with an item expiry object we can do itemexpiry.item to get the parent Item object
    # When we want to access ItemExpiry objects from an Item object, we can use item.expirydates.all()
    # (expirydates is the related name of the foreign key in ItemExpiry)
    # (look at line 35 of inventory/models/ItemExpiryModels.py)
    # similarly in the case of UserExtras, we can use request.user.extras.first() to get the UserExtras object of the currently logged in user
    # We need to include .first() because request.user.extras is a list of UserExtras objects or .all() if you want all UserExtras objects
