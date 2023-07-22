import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models.Item.ItemModels import Item
from django.forms.models import model_to_dict
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import *
from .models import *
from .views_utils import manage_items_change


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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_loans(request):
    user = request.user
    orders = LoanOrder.objects.filter(user=user, loan_active=True)

    order_items_json = []
    for order in orders:
        order_items = OrderItem.objects.filter(order=order)
        loan_order = LoanOrder.objects.get(order_ptr=order.id)
        order_items_data = []
        for order_item in order_items:
            item_expiry = order_item.item_expiry
            item = item_expiry.item
            item_data = {
                "name": item.name,
                "expiry": item_expiry.expirydate.strftime("%Y-%m-%d")
                if item_expiry and item_expiry.expirydate
                else None,
                "type": item.type,
                "quantity_opened": order_item.opened_quantity,
                "quantity_unopened": order_item.unopened_quantity,
                "unit": item.unit,
                "imgpic": item.imgpic.url if item.imgpic else None,
            }
            order_items_data.append(item_data)

        order_items_data.sort(key=lambda x: x["name"])

        # Include metadata about the order
        order_data = {
            "order_id": order.id,
            "order_date": order.date.strftime("%Y-%m-%d %H:%M:%S"),
            "order_action": order.action,
            "order_reason": order.reason,
            "loanee_name": loan_order.loanee_name,
            "return_date": loan_order.return_date.strftime("%Y-%m-%d")
            if loan_order.return_date
            else None,
            "order_items": order_items_data,
        }
        order_items_json.append(order_data)

    order_items_json.sort(key=lambda x: x["return_date"])

    return Response(order_items_json)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_orders(request):
    all_loans = LoanOrder.objects.all()
    all_non_loans = Order.objects.filter(loanorder__isnull=True)

    loan_orders = LoanOrderSerializer(all_loans, many=True).data
    non_loan_orders = OrderSerializer(all_non_loans, many=True).data

    return Response({"loan_orders": loan_orders, "orders": non_loan_orders}, status=200)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_order(request):
    if request.method != "POST":
        return Response(
            {"error": "Invalid request method"},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    data = request.data

    action_type = ActionTypeSerializer(data=data)
    if action_type.is_valid(raise_exception=True):
        action = data["action"]
        reason = data["reason"]

    if action == "Withdraw" and reason == "loan":
        loan_serializer = LoanOrderSerializer(data=data, context={"request": request})
        if loan_serializer.is_valid(raise_exception=True):
            loan = loan_serializer.save()
            manage_items_change(data["order_items"], action)
            return Response(
                {"message": "Loan order submitted successfully"},
                status=status.HTTP_201_CREATED,
            )

    # Fall through here if action is not withdraw and reason is not loan
    serializer = OrderSerializer(data=data, context={"request": request})
    if serializer.is_valid(raise_exception=True):
        order = serializer.save()
        manage_items_change(data["order_items"], action)
        return Response(
            {"message": "Order submitted successfully"},
            status=status.HTTP_201_CREATED,
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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_new_expiry(request):
    if request.method == "POST":
        serializer = ItemExpiryDateSerializer(data=request.data)
        if serializer.is_valid():
            quantityopen = serializer.validated_data.get("quantityopen")
            quantityunopened = serializer.validated_data.get("quantityunopened")
            serializer.validated_data["quantityopen"] = 0
            serializer.validated_data["quantityunopened"] = 0
            serializer.save()
            obj_id = serializer.instance.pk
            obj = ItemExpiry.objects.filter(id=obj_id)[0]
            obj.deposit(quantityopen, quantityunopened)

            return Response({"Message": "Created expiryItem successfully"}, status=200)
        else:
            return Response({"Error": "Bad Request"}, status=400)
    else:
        return Response({"Error": "Invalid request method"}, status=405)

def loan_return_post(request):
    if request.method == "POST":
        loan_return_serializer = LoanReturnSerializer(data=request.data)
        if loan_return_serializer.is_valid(raise_exception=True):
            # Check if all exists here, do not attempt to save, else have to delete if something is not found later
            for item in request.data["items"]:
                print(item)
                try:
                    item_expiry = ItemExpiry.objects.get(
                        item__name=item["item_name"], expirydate=item["item_expiry"]
                    )
                except ItemExpiry.DoesNotExist:
                    return Response({"error": "Item expiry does not exist"}, status=400)

            for item in request.data["items"]:
                item_expiry = ItemExpiry.objects.get(
                    item__name=item["item_name"], expirydate=item["item_expiry"]
                )
                item_expiry.deposit(item["return_opened"], item["return_unopened"])

            loan_order = LoanOrder.objects.get(id=request.data["order_id"])
            loan_order.loan_active = False
            loan_order.save()

            return Response({"message": "Loan returned successfully"}, status=201)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def revert_order(request):
    try:
        target_id = request.data.get("id")
        if target_id is None:
            return Response({"error": "Invalid request body"}, status=400)
        try:
            instance = Order.objects.get(pk=target_id)
            instance.delete()
            return Response({"message": "Order successfully deleted"}, status=200)
        except:
            return Response({"error": "Order not found"}, status=404)
    except:
        return Response({"error": "Something went wrong"}, status=404)