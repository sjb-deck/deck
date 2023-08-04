import json

from django.contrib.auth.decorators import login_required
from django.forms.models import model_to_dict
from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import *
from .models.Item.ItemModels import Item
from .serializers import *
from .views_utils import manage_items_change, manage_items_return


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


@login_required(login_url="/r'^login/$'")
def loan_return(request):
    return render(request, "loan_return.html")


@login_required(login_url="/r'^login/$'")
def admin(request):
    return render(request, "admin.html")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_items(request):
    try:
        items_data = ItemSerializer(Item.objects.all(), many=True).data
        return Response(items_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_user(request):
    try:
        user_data = UserSerializer(request.user).data
        return Response(user_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders(request, option="all", order_id=None):
    # TODO: Add validation
    try:
        if option == "order":
            data = OrderSerializer(Order.objects.exclude(reason="loan"), many=True).data
        elif option == "loan":
            data = OrderSerializer(
                LoanOrder.objects.filter(loan_active=True), many=True
            ).data
        elif option == "get":
            data = OrderSerializer(Order.objects.get(id=order_id)).data
        else:
            data = OrderSerializer(Order.objects.all(), many=True).data
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_submit_order(request):
    try:
        data = request.data
        serializer = OrderSerializer(data=data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            order = serializer.save()
            manage_items_change(order)
            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_201_CREATED,
            )
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_add_item(request):
    try:
        expiry_serializer = ItemSerializer(data=request.data)
        if expiry_serializer.is_valid(raise_exception=True):
            item = expiry_serializer.save()
            return Response(ItemSerializer(item).data, status=201)
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_new_expiry(request, item_id):
    try:
        item = Item.objects.get(id=item_id)  # TODO: to check if the item has an expiry
        expiry_serializer = ItemExpirySerializer(data=request.data)
        if expiry_serializer.is_valid(raise_exception=True):
            expiry = expiry_serializer.save()
            expiry.item = item
            item.total_quantity += expiry.quantity
            item.save()
            expiry.save()
            return Response(ItemSerializer(item).data, status=201)
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def loan_return_post(request):
    try:
        loan_return_serializer = LoanReturnSerializer(data=request.data)
        if loan_return_serializer.is_valid(raise_exception=True):
            loan_order = loan_return_serializer.save()
            return Response(OrderSerializer(loan_order).data, status=201)
        else:
            return Response({"message": "Error during serialization"}, status=400)
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def revert_order(request):
    order_id = request.data
    try:
        if order_id is None:
            return Response({"error": "Invalid request body"}, status=400)
        try:
            instance = Order.objects.get(pk=order_id)
            manage_items_return(instance)
            instance.delete()
            return Response({"message": "Order successfully deleted"}, status=200)
        except:
            return Response({"error": "Order not found"}, status=404)
    except:
        return Response({"error": "Something went wrong"}, status=404)
