from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models.Item.ItemModels import Item
from django.forms.models import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import (
    ItemSerializer,
    UserExtrasSerializer,
    ExpiryItemSerializer,
    OrderSerializer,
    LoanOrderSerializer,
)
from .models import *


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
    return Response(user_data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_order(request):
    if request.method != "POST":
        return Response(
            {"error": "Invalid request method"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    data = request.data
    serializer = OrderSerializer(data=data, context={"request": request})
    is_valid = serializer.is_valid()

    if is_valid:
        order = serializer.save()
    else:
        return Response(
            {"error": "Invalid order data", "details": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # create additional loan order object if it is a loan order
    if (data.get("action") == "Withdraw") and (data.get("reason") == "loan"):
        data["order"] = order.id
        loan_serializer = LoanOrderSerializer(data=data, context={"order_id": order.id})
        if loan_serializer.is_valid(raise_exception=True):
            loan = loan_serializer.save()
        else:
            return Response(
                {"error": "Invalid loan order data", "details": loan_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # withdraw and deposit to item expiry
    for item in data["order_items"]:
        item_expiry = ItemExpiry.objects.get(id=item["item_expiry"])
        if data["action"] == "Withdraw":
            item_expiry.withdraw(item["opened_quantity"], item["unopened_quantity"])
        elif data["action"] == "Deposit":
            item_expiry.deposit(item["opened_quantity"], item["unopened_quantity"])

    return Response(
        {"message": "Order submitted successfully"}, status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
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

@api_view(["GET"])
def get_orders(request):
    data = LoanOrder.objects.all()
    print(data)
    return Response({""})
