import csv
import json
import os
from django.contrib.auth.decorators import login_required
from django.db import DatabaseError, transaction
from django.http import HttpResponse
from django.shortcuts import render
from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from django.db.models import F, Q

from inventory.items.serializers import *
from inventory.items.views_utils import *


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
def api_orders(request):
    try:
        option = request.query_params.get("option")
        order_id = request.query_params.get("orderId")
        page = request.query_params.get("page", 1)
        page_size = request.query_params.get("pageSize", 10)

        loanee_name = request.query_params.get("loaneeName")
        item = request.query_params.get("item")
        username = request.query_params.get("username")
        reason = request.query_params.get("reason")

        item_orders = (
            Order.objects.filter(is_reverted=False)
            .exclude(reason="kit_create")
            .exclude(reason="kit_restock")
            .exclude(reason="kit_retire")
            .prefetch_related("order_items__item_expiry__item")
            .select_related("user")
        )
        item_loan_orders = (
            LoanOrder.objects.all()
            .filter(is_reverted=False)
            .prefetch_related("order_items__item_expiry__item")
            .select_related("user")
        )

        if option == "order":
            queryset = item_orders.exclude(reason="loan")
        elif option == "loan":
            queryset = item_loan_orders
        elif option == "loan_active":
            queryset = item_loan_orders.filter(loan_active=True)
        elif order_id:
            queryset = (
                Order.objects.filter(id=order_id)
                .prefetch_related("order_items__item_expiry__item")
                .select_related("user")
            )
        else:
            queryset = item_orders

        if loanee_name:
            queryset = queryset.filter(loanee_name__icontains=loanee_name)
        if item:
            queryset = queryset.filter(
                order_items__item_expiry__item__name__icontains=item
            )
        if username:
            queryset = queryset.filter(user__username__icontains=username)
        if reason:
            queryset = queryset.filter(reason__icontains=reason)

        queryset = queryset.order_by("-date")

        paginator = Paginator(queryset, page_size)
        page_obj = paginator.get_page(page)

        data = {
            "results": OrderSerializer(page_obj, many=True).data,
            "num_pages": paginator.num_pages,
        }
        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_submit_order(request):
    try:
        order = create_order(request.data, request)
        return Response(OrderSerializer(order).data, status=201)
    except Exception as e:
        return Response(
            {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_add_item(request):
    try:
        data = request.data
        expiry_serializer = ItemSerializer(data=data, context={"user": request.user})
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
        item_expiry, _ = create_new_item_expiry(request.data, request)
        return Response(ItemExpirySerializer(item_expiry).data, status=201)
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
    order_id = request.data["id"]
    try:
        if order_id is None:
            return Response({"message": "Invalid request body"}, status=500)
        try:
            order = Order.objects.get(id=order_id)
            if (
                order.reason == "kit_create"
                or order.reason == "kit_restock"
                or order.reason == "kit_retire"
            ):
                raise Exception("Cannot revert kit creation/restock/retire")
            if order.reason == "loan":
                loan_order = LoanOrder.objects.get(id=order_id)
                loan_order.revert_order()
            else:
                order.revert_order()
            return Response({"message": "Successfully reverted order"}, status=200)
        except Exception as e:
            return Response({"message": str(e)}, status=500)
    except:
        return Response({"message": "Something went wrong"}, status=500)


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
    # Check the size of the uploaded file
    if request.FILES["file"].size > 5 * 1024 * 1024:
        return Response(
            {"message": "The uploaded file is too large. Maximum size is 5 MB."},
            status=400,
        )

    reader = csv.reader(request.FILES["file"].read().decode("utf-8-sig").splitlines())
    errors = []
    next(reader)
    try:
        with transaction.atomic():
            for idx, row in enumerate(reader):
                try:
                    if len(row) != 8:
                        errors.append(
                            "Row {}: Expected 8 columns, found {}".format(
                                idx + 1, len(row)
                            )
                        )
                        continue
                    is_valid, error_message = check_correct_csv_format(row, idx)
                    if not is_valid:
                        errors.append(error_message)
                        continue
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
                                "archived": row[7].lower() == "true",
                            }
                        ],
                    }
                    item = ItemSerializer(data=upl, context={"user": request.user})
                    current_item = Item.objects.filter(name=upl["name"])
                    if current_item.exists():
                        new_expiry = {
                            "item": current_item.first().id,
                            "expiry_date": row[5],
                            "quantity": int(row[3]),
                        }
                        create_new_item_expiry(new_expiry, request)
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_for_alerts(request):
    # Get items at or below minimum quantity
    low_quantity_items = Item.objects.filter(total_quantity__lte=F("min_quantity"))

    # Get item expiries that are expiring within 1 month or expired, and not archived
    current_date = timezone.now()
    one_month_later = current_date + timedelta(days=30)
    expired_items = ItemExpiry.objects.filter(Q(expiry_date__lte=current_date))
    expiring_items = ItemExpiry.objects.filter(
        Q(expiry_date__lte=one_month_later) & Q(expiry_date__gte=current_date)
    )

    response_data = {
        "low_quantity_items": [
            {"name": item.name, "total_quantity": item.total_quantity}
            for item in low_quantity_items
        ],
        "expired_items": [
            {
                "name": expiry.item.name,
                "expiry_date": expiry.expiry_date,
                "quantity": expiry.quantity,
                "status": "expired",
            }
            for expiry in expired_items
        ],
        "expiring_items": [
            {
                "name": expiry.item.name,
                "expiry_date": expiry.expiry_date,
                "quantity": expiry.quantity,
                "status": "expiring",
            }
            for expiry in expiring_items
        ],
    }

    return Response(response_data)
