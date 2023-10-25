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
def items(request):
    return render(request, "items.html")


@login_required(login_url="/r'^login/$'")
def cart(request):
    return render(request, "cart.html")


@login_required(login_url="/r'^login/$'")
def add_item(request):
    return render(request, "add_item.html")


@login_required(login_url="/r'^login/$'")
def order_receipt(request):
    return render(request, "order_receipt.html")


@login_required(login_url="/r'^login/$'")
def item_list(request):
    return render(request, "item_list.html")


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
def create_new_expiry(request):
    try:
        expiry_serializer = AddItemExpirySerializer(data=request.data)
        if expiry_serializer.is_valid(raise_exception=True):
            expiry = expiry_serializer.save()
            return Response(ItemSerializer(expiry.item).data, status=201)
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
            return Response({"error": "Invalid request body"}, status=500)
        try:
            order = Order.objects.get(id=order_id)
            if order.reason == "loan":
                loan_order = LoanOrder.objects.get(id=order_id)
                loan_order.revert_order()
            else:
                order.revert_order()
            return Response({"message": "Successfully reverted order"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    except:
        return Response({"error": "Something went wrong"}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def export_items_csv(request):
    response = HttpResponse(content_type="text/csv")
    writer = csv.writer(response)
    writer.writerow(["name", "type", "unit", "expiry_date", "total_quantity", "opened"])
    items_data = Item.objects.all()

    for item in items_data:
        expiry_dates = item.expiry_dates.all()
        for expiry in expiry_dates:
            writer.writerow(
                [
                    item.name,
                    item.type,
                    item.unit,
                    expiry.expiry_date,
                    item.total_quantity,
                    item.is_opened,
                ]
            )

    response["Content-Disposition"] = "attachment; filename=items.csv"

    return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def import_items_csv(request):
    reader = csv.reader(request.FILES["file"].read().decode("utf-8-sig").splitlines())
    errors = []
    next(reader)
    try:
        with transaction.atomic():
            for idx, row in enumerate(reader):
                try:
                    upl = {
                        "name": row[0],
                        "type": row[1],
                        "unit": row[2],
                        "total_quantity": row[3],
                        "is_opened": row[4].lower() == "true",
                        "expiry_dates": [
                            {
                                "expiry_date": row[5],
                                "quantity": row[6],
                                "archived": row[7],
                            }
                        ],
                    }
                    item = ItemSerializer(data=upl)
                    current_item = Item.objects.filter(name=upl["name"])
                    if current_item.exists():
                        new_expiry = {
                            "item": current_item.first().id,
                            "expiry_date": row[5],
                            "quantity": row[3],
                        }
                        expiry_serializer = AddItemExpirySerializer(data=new_expiry)
                        if expiry_serializer.is_valid(raise_exception=True):
                            expiry_serializer.save()
                    elif item.is_valid(raise_exception=True):
                        item.save()
                except Exception as e:
                    errors.append("Row {}: {}".format(idx + 1, str(e)))
            if errors:
                # Forces a rollback for atomicity
                raise DatabaseError
    except:
        return Response({"message": errors}, status=400)

    return Response({"message": "Success"}, status=201)
