import datetime
import json
from django.db import transaction

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import *
from ..items.models import *
from .views_utils import *


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_kits(request):
    try:
        kits = Kit.objects.all().exclude(status='RETIRED')
        kit_serializer = KitSerializer(kits, many=True)
        blueprint = Blueprint.objects.filter(archived=False)
        blueprint_serializer = BlueprintSerializer(blueprint, many=True)

        return Response({
            'kits': kit_serializer.data,
            'blueprints': blueprint_serializer.data,
        })
    except Exception as e:
        return Response(e.args, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_new_kit_recipe(request, blueprint_id):
    try:
        # Check that blueprint exists and is not archived
        blueprint = Blueprint.objects.get(id=blueprint_id, archived=False)
        if not blueprint:
            return Response({"message": "No such blueprint found."}, status=status.HTTP_404_NOT_FOUND)

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
        username = request.user.username

        if blueprint_id is None or not name or not username or not content:
            return Response({"message": "Required parameters are missing!"}, status=status.HTTP_400_BAD_REQUEST)

        if Kit.objects.filter(name=name).exclude(status='RETIRED').exists():
            return Response({"message": "Kit with this name already exists!"}, status=status.HTTP_400_BAD_REQUEST)

        blueprint = Blueprint.objects.get(id=blueprint_id, archived=False)
        compressed_content = compress_content(content)

        if not content_matches(compressed_content, blueprint.complete_content):
            return Response({"message": "Content does not match blueprint!"}, status=status.HTTP_400_BAD_REQUEST)

        if add_more_than_expected(compressed_content, blueprint.complete_content):
            return Response({"message": "Added content is more than expected."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            new_kit = Kit.objects.create(
                name=name,
                blueprint=blueprint,
                status="READY",
                content=content,
            )

            order_id = transact_items(content, request, new_kit, is_withdraw=True, is_create_kit=True)

            History.objects.create(
                kit=new_kit,
                type="CREATION",
                date=datetime.date.today(),
                person=username,
                snapshot=content,
                order_id=order_id
            )

        return Response({"message": "Kit added successfully!", "kit_id": new_kit.id}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def retire_kit(request, kit_id):
    try:
        kit = Kit.objects.get(id=kit_id)
        content = kit.content

        if kit.status != "READY":
            return Response({"message": "Kit is not ready and cannot be retired."}, status=status.HTTP_400_BAD_REQUEST)

        order_id = transact_items(content, request, kit, is_withdraw=False)

        History.objects.create(
            kit=kit,
            type="RETIREMENT",
            date=datetime.date.today(),
            person=request.user.username,
            snapshot=None,
            order_id=order_id
        )

        kit.status = "RETIRED"
        kit.content = None
        kit.save()

        return Response({"message": "Kit retired and contents deposited successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_blueprint(request):
    try:
        name = request.data.get("name")
        content = request.data.get("content")

        if not name or not content:
            return Response({"message": "Required parameters are missing!"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if name already exists
        if Blueprint.objects.filter(name=name).exists():
            return Response({"message": "Blueprint with this name already exists!"}, status=status.HTTP_400_BAD_REQUEST)

        # Compress different expiry into one item
        blueprint_content = compress_content(content)

        blueprint = Blueprint.objects.create(
            name=name,
            complete_content=blueprint_content,
        )

        return Response({
            "message": "Blueprint added successfully!",
            "blueprint_id": blueprint.id
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def kit_history(request, kit_id):
    try:
        if not Kit.objects.filter(id=kit_id).exists():
            return Response({"message": "No such kit found."}, status=status.HTTP_404_NOT_FOUND)

        histories = History.objects.filter(kit__id=kit_id).order_by('-id')

        serializer = HistorySerializer(histories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_kit_order(request):
    try:
        kit_id = request.data.get("kit_id")
        force = request.data.get("force")
        loanee_name = request.data.get("loanee_name")
        due_date = request.data.get("due_date")

        # Check if kit is available
        kit = Kit.objects.get(id=kit_id)
        if kit.status != "READY":
            return Response({"message": "Kit is not ready and available."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if kit is complete
        if not kit_is_complete(kit_id) and not force:
            return Response({"message": "Kit is not complete and normal loan if not possible."}, status=status.HTTP_400_BAD_REQUEST)

        LoanHistory.objects.create(
            kit=kit,
            type='LOAN',
            date=timezone.now(),
            person=request.user.username,
            snapshot=kit.content,
            loanee_name=loanee_name,
            due_date=due_date,
            return_date=None
        )

        kit.status = "LOANED"
        kit.save()

        return Response({"message": "Kit loaned successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def return_kit_order(request):
    try:
        kit_id = request.data.get("kit_id")
        content = request.data.get("content")

        # Check if kit is loaned
        kit = Kit.objects.get(id=kit_id)

        if kit.status != "LOANED":
            return Response({"message": "Kit is not loaned and cannot be returned."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if uncompressed content matches
        loan_history = LoanHistory.objects.filter(kit=kit, return_date__isnull=True).latest('date')

        res = order_return_matches(content, loan_history.snapshot)
        if not res[0]:
            if res[1]:
                return Response({"message": "Expected content does not match."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"message": "Attempting to return more than borrowed not allowed."}, status=status.HTTP_400_BAD_REQUEST)

        # Update loan history
        loan_history.return_date = timezone.now()
        loan_history.snapshot = content
        loan_history.save()

        kit.content = content
        kit.status = "READY"
        kit.save()

        return Response({"message": "Kit returned successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def restock_options(request, kit_id):
    try:
        kit = Kit.objects.get(id=kit_id)
        blueprint_id = kit.blueprint.id

        if kit.status != "READY":
            return Response({"message": "Kit is not ready and cannot be restocked."}, status=status.HTTP_400_BAD_REQUEST)

        if kit_is_complete(kit_id):
            return Response({"message": "Kit is already complete."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(get_restock_options(blueprint_id, kit.content), status=status.HTTP_200_OK)

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
        projected_content = merge_contents(kit.content, restock_expiries)
        compressed_projected_content = compress_content(projected_content)

        if not content_matches(compressed_projected_content, blueprint.complete_content):
            return Response({"message": "Content does not match blueprint!"}, status=status.HTTP_400_BAD_REQUEST)

        if add_more_than_expected(compressed_projected_content, blueprint.complete_content):
            return Response({"message": "Added content is more than expected."}, status=status.HTTP_400_BAD_REQUEST)

        order_id = transact_items(restock_expiries, request, kit, is_withdraw=True)

        kit.content = projected_content
        kit.save()

        History.objects.create(
            kit=kit,
            type="RESTOCK",
            date=datetime.date.today(),
            person=request.user.username,
            snapshot=projected_content,
            order_id=order_id
        )

        return Response({"message": "Kit restocked successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def revert_kit_order(request, kit_id):
    try:
        # Check if kit is loaned
        kit = Kit.objects.get(id=kit_id)

        if kit.status != "LOANED":
            return Response({"message": "Kit is not loaned and cannot be reverted."}, status=status.HTTP_400_BAD_REQUEST)

        history = History.objects.filter(kit__id=kit_id).latest('id')
        if history.type != "LOAN":
            return Response({"message": "Kit is not loaned recently and cannot be reverted."}, status=status.HTTP_400_BAD_REQUEST)

        loan_history = LoanHistory.objects.get(id=history.id)
        if loan_history.return_date is not None:
            return Response({"message": "Kit is not loaned and cannot be reverted."}, status=status.HTTP_400_BAD_REQUEST)

        loan_history.delete()

        kit.status = "READY"
        kit.save()

        return Response({"message": "Kit loan reverted successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def revert_restock(request, kit_id):
    try:
        kit = Kit.objects.get(id=kit_id)

        if kit.status != "READY":
            return Response({"message": "Kit is not ready and cannot be reverted."}, status=status.HTTP_400_BAD_REQUEST)

        history = History.objects.filter(kit__id=kit_id).latest('id')
        if history.type != "RESTOCK":
            return Response({"message": "Kit is not restocked recently and cannot be reverted."}, status=status.HTTP_400_BAD_REQUEST)

        Order.objects.get(id=history.order_id).revert_order()

        history.delete()

        previous_history = History.objects.filter(kit__id=kit_id).order_by('-id')[1]
        kit.content = previous_history.snapshot  # status is still READY
        kit.save()

        return Response({"message": "Kit restock reverted successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def revert_return_order(request, kit_id):
    try:
        # Check if kit has been returned
        kit = Kit.objects.get(id=kit_id)

        if kit.status != "READY":
            return Response({"message": "Kit is not returned yet and cannot be reverted."}, status=status.HTTP_400_BAD_REQUEST)

        history = History.objects.filter(kit__id=kit_id).latest('id')
        if history.type != "LOAN":
            return Response({"message": "Kit is not returned recently and cannot be reverted."}, status=status.HTTP_400_BAD_REQUEST)

        loan_history = LoanHistory.objects.get(id=history.id)
        if loan_history.return_date is None:
            return Response({"message": "Kit is not returned yet and cannot be reverted."}, status=status.HTTP_400_BAD_REQUEST)

        previous_loan_history = History.objects.filter(kit__id=kit_id).order_by('-id')[1]

        loan_history.return_date = None
        loan_history.snapshot = previous_loan_history.snapshot
        loan_history.save()

        kit.status = "LOANED"
        kit.content = previous_loan_history.snapshot
        kit.save()

        return Response({"message": "Kit return reverted successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
