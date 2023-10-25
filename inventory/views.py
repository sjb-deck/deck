import csv
from django.contrib.auth.decorators import login_required
from django.db import DatabaseError, transaction
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from inventory.items.serializers import *
from inventory.items.views_utils import manage_items_change


# Create your views here.
@login_required(login_url="/r'^login/$'")
def inventory_index(request):
    return render(request, "inventory_index.html")


@login_required(login_url="/r'^login/$'")
def admin(request):
    return render(request, "admin.html")


@login_required(login_url="/r'^login/$'")
def loan_return(request):
    return render(request, "loan_return.html")