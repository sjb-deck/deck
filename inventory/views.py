from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from inventory.items.views import *


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
