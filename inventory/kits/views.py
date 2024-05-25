import datetime
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .serializers import *
from ..items.models import *
from .views_utils import *


@login_required(login_url="/r'^login/$'")
def create_blueprint(request):
    return render(request, "create_blueprint.html")


@login_required(login_url="/r'^login/$'")
def kit_info(request):
    return render(request, "kit_info.html")


@login_required(login_url="/r'^login/$'")
def kits(request):
    return render(request, "kits.html")


def kit_restock(request):
    return render(request, "kit_restock.html")


@login_required(login_url="/r'^login/$'")
def kit_loan_return(request):
    return render(request, "kit_loan_return.html")


def cart(request):
    return render(request, "kit_cart.html")


@login_required(login_url="/r'^login/$'")
def kit_create(request):
    return render(request, "kit_create.html")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_kits(request):
    try:
        kit_id = request.query_params.get("kitId")
        if kit_id:
            kits = Kit.objects.filter(id=kit_id)
            kit_serializer = KitSerializer(kits, many=True)
            if not kit_serializer.data:
                return Response(
                    {"message": "No such kit found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            return Response(kit_serializer.data[0], status=status.HTTP_200_OK)
        kits = Kit.objects.all().exclude(status="RETIRED")
        kit_serializer = KitSerializer(kits, many=True)
        blueprint = Blueprint.objects.filter(archived=False)
        blueprint_serializer = BlueprintSerializer(blueprint, many=True)

        return Response(
            {
                "kits": kit_serializer.data,
                "blueprints": blueprint_serializer.data,
            }
        )
    except Exception as e:
        return Response(e.args, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_new_kit_recipe(request, blueprint_id):
    try:
        # Check that blueprint exists and is not archived
        blueprint = Blueprint.objects.get(id=blueprint_id, archived=False)
        if not blueprint:
            return Response(
                {"message": "No such blueprint found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        recipe = get_restock_options(blueprint_id, None)

        return Response(recipe, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_kit(request):
    try:
        blueprint_id = request.data.get("blueprint")
        name = request.data.get("name")
        content = request.data.get("content")
        username = request.user

        if blueprint_id is None or not name or not username or not content:
            return Response(
                {"message": "Required parameters are missing!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if Kit.objects.filter(name=name).exclude(status="RETIRED").exists():
            return Response(
                {"message": "Kit with this name already exists!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        blueprint = Blueprint.objects.get(id=blueprint_id, archived=False)
        compressed_content = compress_content(content)

        content_match, not_overloaded = check_valid_kit_content(
            compressed_content, blueprint.complete_content
        )

        if not content_match:
            return Response(
                {"message": "Content does not match blueprint!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not not_overloaded:
            return Response(
                {"message": "Added content is more than expected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            new_kit = Kit.objects.create(
                name=name,
                blueprint=blueprint,
                status="READY",
                content=content,
            )

            order_id = transact_items(
                content, request, new_kit, is_withdraw=True, is_create_kit=True
            )

            History.objects.create(
                kit=new_kit,
                type="CREATION",
                person=username,
                snapshot=content,
                order_id=order_id,
            )

        return Response(
            {
                "message": "Kit added successfully!",
                "kit_id": new_kit.id,
                "order_id": order_id,
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def retire_kit(request, kit_id):
    try:
        kit = Kit.objects.get(id=kit_id)
        content = kit.content

        if kit.status != "READY":
            return Response(
                {"message": "Kit is not ready and cannot be retired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order_id = transact_items(content, request, kit, is_withdraw=False)

        History.objects.create(
            kit=kit,
            type="RETIREMENT",
            person=request.user,
            snapshot=None,
            order_id=order_id,
        )

        kit.status = "RETIRED"
        kit.content = None
        kit.save()

        return Response(
            {
                "message": "Kit retired and contents deposited successfully!",
                "order_id": order_id,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_blueprint(request):
    try:
        name = request.data.get("name")
        content = request.data.get("content")

        if not name or not content:
            return Response(
                {"message": "Required parameters are missing!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if name already exists
        if Blueprint.objects.filter(name=name).exists():
            return Response(
                {"message": "Blueprint with this name already exists!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if content is valid
        for item in content:
            if item["quantity"] < 0:
                return Response(
                    {"message": "Quantity cannot be negative."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if not Item.objects.filter(id=item["item_id"]).exists():
                return Response(
                    {"message": "Item matching query does not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        blueprint = Blueprint.objects.create(
            name=name,
            complete_content=content,
        )

        return Response(
            {"message": "Blueprint added successfully!", "blueprint_id": blueprint.id},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def kit_history(request):
    try:
        kit_id = request.query_params.get("kitId")
        kit_name = request.query_params.get("kitName")
        type = request.query_params.get("type")
        loanee_name = request.query_params.get("loaneeName")
        user = request.query_params.get("user")

        if kit_id:
            kit = Kit.objects.get(id=kit_id)
            histories = History.objects.filter(kit=kit).order_by("-id")
        elif kit_name:
            histories = History.objects.filter(kit__name__icontains=kit_name).order_by(
                "-id"
            )
        elif type:
            histories = History.objects.filter(type__icontains=type).order_by("-id")
        elif loanee_name:
            histories = LoanHistory.objects.filter(
                loanee_name__icontains=loanee_name
            ).order_by("-id")
        elif user:
            histories = History.objects.filter(
                person__username__icontains=user
            ).order_by("-id")
        else:
            histories = History.objects.all().order_by("-id")

        # Create a paginator
        paginator = PageNumberPagination()
        paginator.page_size = 10

        # Apply pagination to the queryset
        result_page = paginator.paginate_queryset(histories, request)

        serializer = HistorySerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_kit_order(request):
    try:
        kit_ids = request.data.get("kit_ids")
        force = request.data.get("force")
        loanee_name = request.data.get("loanee_name")
        due_date = request.data.get("due_date")

        if not kit_ids or not loanee_name or not due_date or force is None:
            raise ValueError("Required parameters are missing!")

        if len(kit_ids) == 0:
            raise ValueError("No kits selected, empty array.")

        # Check date format
        due_date_obj = datetime.datetime.strptime(due_date, "%Y-%m-%d").date()

        if due_date_obj < datetime.date.today():
            raise ValueError("Due date cannot be in the past.")

        with transaction.atomic():
            try:
                for kit_id in kit_ids:
                    # Check if kit is available
                    kit = Kit.objects.get(id=kit_id)
                    if kit.status != "READY":
                        raise ValueError("Kit is not ready and available.")

                    if not kit_is_complete(kit_id) and not force:
                        raise ValueError(
                            f"Kit with id={kit_id} is not complete and cannot be loaned."
                        )

                    LoanHistory.objects.create(
                        kit=kit,
                        type="LOAN",
                        person=request.user,
                        snapshot=kit.content,
                        loanee_name=loanee_name,
                        due_date=due_date,
                        return_date=None,
                    )

                    kit.status = "LOANED"
                    kit.save()
            except (ValueError, Kit.DoesNotExist) as e:
                raise ValueError(str(e))

        return Response(
            {"message": "Kit(s) loaned successfully!"}, status=status.HTTP_200_OK
        )

    except ValueError as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def return_kit_order(request):
    try:
        kit_id = request.data.get("kit_id")
        content = request.data.get("content")

        if not kit_id or not content:
            return Response(
                {"message": "Required parameters are missing!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for item in content:
            if item["quantity"] < 0:
                return Response(
                    {"message": "Quantity cannot be negative."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Check if kit is loaned
        kit = Kit.objects.get(id=kit_id)

        if kit.status != "LOANED":
            return Response(
                {"message": "Kit is not loaned and cannot be returned."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if uncompressed content matches
        loan_history = LoanHistory.objects.filter(
            kit=kit, return_date__isnull=True
        ).latest("date")

        res = order_return_matches(content, loan_history.snapshot)
        if not res[0]:
            if res[1]:
                return Response(
                    {"message": "Expected content does not match."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                return Response(
                    {"message": "Attempting to return more than borrowed not allowed."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Remove 0 quantities
        content = [item for item in content if item["quantity"] != 0]

        # Update loan history
        loan_history.return_date = timezone.now()
        loan_history.snapshot = content
        loan_history.save()

        kit.content = content
        kit.status = "READY"
        kit.save()

        return Response(
            {"message": "Kit returned successfully!"}, status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def restock_options(request, kit_id):
    try:
        kit = Kit.objects.get(id=kit_id)
        blueprint_id = kit.blueprint.id

        if kit.status != "READY":
            return Response(
                {"message": "Kit is not ready and cannot be restocked."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if kit_is_complete(kit_id):
            return Response(
                {"message": "Kit is already complete."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            get_restock_options(blueprint_id, kit.content), status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def restock_kit(request):
    try:
        kit_id = request.data.get("kit_id")
        restock_expiries = request.data.get("content")
        blueprint = Blueprint.objects.get(id=Kit.objects.get(id=kit_id).blueprint.id)

        kit = Kit.objects.get(id=kit_id)

        # Check if kit is "READY"
        if kit.status != "READY":
            return Response(
                {"message": "Kit is not ready and cannot be restocked."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if any quantity is zero
        for item in restock_expiries:
            if item["quantity"] == 0:
                return Response(
                    {"message": "Quantity cannot be zero."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        projected_content = merge_contents(kit.content, restock_expiries)
        compressed_projected_content = compress_content(projected_content)

        content_match, not_overloaded = check_valid_kit_content(
            compressed_projected_content, blueprint.complete_content
        )

        if not content_match:
            return Response(
                {"message": "Content does not match blueprint!"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not not_overloaded:
            return Response(
                {"message": "Added content is more than expected."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order_id = transact_items(restock_expiries, request, kit, is_withdraw=True)

        kit.content = projected_content
        kit.save()

        History.objects.create(
            kit=kit,
            type="RESTOCK",
            person=request.user,
            snapshot=projected_content,
            order_id=order_id,
        )

        return Response(
            {"message": "Kit restocked successfully!", "order_id": order_id},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def revert_kit(request, history_id):
    try:
        # Check if history is the latest of a kit and get its type
        history = History.objects.get(id=history_id)
        kit = history.kit
        kit_latest_history = History.objects.filter(kit__id=kit.id).latest("id")
        if history.id != kit_latest_history.id:
            return Response(
                {
                    "message": "This is not the latest operation of the kit and cannot be reverted.",
                    "kit_id": kit.id,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        history_type = history.type
        if history_type == "LOAN":
            loan_history = LoanHistory.objects.get(id=history_id)
            if loan_history.return_date is None:
                if kit.status != "LOANED":
                    return Response(
                        {
                            "message": "Severe error detected. Kit is not in loaned state and cannot be reverted. Please "
                            "contact admin.",
                            "kit_id": kit.id,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                loan_history.delete()
                kit.status = "READY"
                kit.save()

                return Response(
                    {"message": "Kit loan reverted successfully!", "kit_id": kit.id},
                    status=status.HTTP_200_OK,
                )
            else:  # there is a return date indicating that the kit is returned
                if kit.status != "READY":
                    return Response(
                        {
                            "message": "Severe error detected. Kit is not in ready state and cannot be reverted. Please "
                            "contact admin.",
                            "kit_id": kit.id,
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                previous_loan_history = History.objects.filter(kit__id=kit.id).order_by(
                    "-id"
                )[1]
                loan_history.return_date = None
                loan_history.snapshot = previous_loan_history.snapshot
                loan_history.save()

                kit.status = "LOANED"
                kit.content = previous_loan_history.snapshot
                kit.save()

                return Response(
                    {"message": "Kit return reverted successfully!", "kit_id": kit.id},
                    status=status.HTTP_200_OK,
                )

        elif history_type == "RESTOCK":
            if kit.status != "READY":
                return Response(
                    {
                        "message": "Severe error detected. Kit is not in ready state and cannot be reverted. Please "
                        "contact admin.",
                        "kit_id": kit.id,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            Order.objects.get(id=history.order_id).revert_order()
            previous_history = History.objects.filter(kit__id=kit.id).order_by("-id")[1]
            kit.content = previous_history.snapshot  # status is still READY
            kit.save()
            history.delete()

            return Response(
                {"message": "Kit restock reverted successfully!", "kit_id": kit.id},
                status=status.HTTP_200_OK,
            )

        elif history_type == "RETIREMENT":
            if kit.status != "RETIRED":
                return Response(
                    {
                        "message": "Severe error detected. Kit is not in retired state and cannot be reverted. Please "
                        "contact admin.",
                        "kit_id": kit.id,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            Order.objects.get(id=history.order_id).revert_order()
            previous_history = History.objects.filter(kit__id=kit.id).order_by("-id")[1]
            kit.content = previous_history.snapshot
            kit.status = "READY"
            kit.save()
            history.delete()

            return Response(
                {"message": "Kit retirement reverted successfully!", "kit_id": kit.id},
                status=status.HTTP_200_OK,
            )

        else:
            return Response(
                {"message": "This operation cannot be reverted.", "kit_id": kit.id},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_kits_expiry(request):
    expiry_kits = []

    all_kits = Kit.objects.all()

    for kit in all_kits:
        expiring_items = []
        expired_items = []
        items = kit.content
        for item_expiry in items:
            item_id = item_expiry["item_expiry_id"]
            quantity = item_expiry["quantity"]
            item_expiry_object = ItemExpiry.objects.get(id=item_id)
            expiry_date = item_expiry_object.expiry_date
            item_object = item_expiry_object.item
            if expiry_date is not None:
                if expiry_date <= datetime.date.today():
                    expired_items.append(
                        {
                            "item_expiry_id": item_id,
                            "item_name": item_object.name,
                            "expiry_date": expiry_date,
                            "quantity": quantity,
                            "days_expired_for": (
                                datetime.date.today() - expiry_date
                            ).days,
                        }
                    )
                elif expiry_date <= datetime.date.today() + datetime.timedelta(days=30):
                    expiring_items.append(
                        {
                            "item_expiry_id": item_id,
                            "item_name": item_object.name,
                            "expiry_date": expiry_date,
                            "quantity": quantity,
                            "days_expires_in": (
                                expiry_date - datetime.date.today()
                            ).days,
                        }
                    )

        if expiring_items:
            expiring_items.sort(key=lambda x: x["expiry_date"])

        # Sort the expired_items list
        if expired_items:
            expired_items.sort(key=lambda x: x["expiry_date"])

        if expiring_items or expired_items:
            expiry_kits.append(
                {
                    "kit_id": kit.id,
                    "kit_name": kit.name,
                    "expiring_items": expiring_items if expiring_items else None,
                    "expired_items": expired_items if expired_items else None,
                }
            )

    return Response(expiry_kits)
