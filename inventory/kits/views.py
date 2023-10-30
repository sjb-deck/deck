import datetime
import json

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
        kits = Kit.objects.all()
        kit_serializer = KitSerializer(kits, many=True)
        blueprint = Blueprint.objects.filter(status="ACTIVE")
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
        # Check that blueprint exists and is active
        blueprint = Blueprint.objects.get(id=blueprint_id, status="ACTIVE")
        if not blueprint:
            return Response({"error": "No such blueprint found."}, status=status.HTTP_404_NOT_FOUND)

        recipe = get_restock_options(blueprint_id, None)

        return Response(recipe, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_kit(request):
    try:
        blueprint_id = request.data.get("blueprint")
        name = request.data.get("name")
        content = request.data.get("content")
        username = request.user.username

        if blueprint_id is None or not name or not username or not content:
            return Response({"error": "Required parameters are missing!"}, status=status.HTTP_400_BAD_REQUEST)

        if Kit.objects.filter(name=name).exists():
            return Response({"error": "Kit with this name already exists!"}, status=status.HTTP_400_BAD_REQUEST)

        blueprint = Blueprint.objects.get(id=blueprint_id, status="ACTIVE")
        compressed_content = compress_content(content)

        if not content_matches(compressed_content, blueprint.complete_content):
            return Response({"error": "Content does not match blueprint!"}, status=status.HTTP_400_BAD_REQUEST)

        if add_more_than_expected(compressed_content, blueprint.complete_content):
            return Response({"error": "Added content is more than expected."}, status=status.HTTP_400_BAD_REQUEST)

        res = attempt_items_withdrawal(content)
        item_insufficient = res[1]
        if not res[0]:
            return Response({"error": f"Insufficient stock for {item_insufficient}."}, status=status.HTTP_400_BAD_REQUEST)

        new_kit = Kit.objects.create(
            name=name,
            blueprint=blueprint,
            status="READY",
            content=content,
        )

        History.objects.create(
            kit=new_kit,
            type="CREATION",
            date=datetime.date.today(),
            person=username,
            snapshot=content
        )

        return Response({"message": "Kit added successfully!"},
                        status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def retire_kit(request, kit_id):
    try:
        kit = Kit.objects.get(id=kit_id)
        content = kit.content

        if kit.status != "READY":
            return Response({"error": "Kit is not ready and cannot be retired."}, status=status.HTTP_400_BAD_REQUEST)

        if not attempt_items_deposit(content):
            return Response({"error": "Fail to deposit and cannot retire kit."}, status=status.HTTP_400_BAD_REQUEST)

        kit.status = "RETIRED"
        kit.save()

        History.objects.create(
            kit=kit,
            type="RETIREMENT",
            date=datetime.date.today(),
            person=request.user.username,
            snapshot=content
        )

        return Response({"message": "Kit retired and contents deposited successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_blueprint(request):
    try:
        name = request.data.get("name")
        content = request.data.get("content")

        if not name or not content:
            return Response({"error": "Required parameters are missing!"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if name already exists
        if Blueprint.objects.filter(name=name).exists():
            return Response({"error": "Blueprint with this name already exists!"}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def kit_history(request, kit_id):
    try:
        if not Kit.objects.filter(id=kit_id).exists():
            return Response({"error": "No such kit found."}, status=status.HTTP_404_NOT_FOUND)

        histories = History.objects.filter(kit__id=kit_id)

        serializer = HistorySerializer(histories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
            return Response({"error": "Kit is not ready and available."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if kit is complete
        if not kit_is_complete(kit_id) and not force:
            return Response({"error": "Kit is not complete and normal loan if not possible."}, status=status.HTTP_400_BAD_REQUEST)

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
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def return_kit_order(request):
    try:
        kit_id = request.data.get("kit_id")
        content = request.data.get("content")

        # Check if kit is loaned
        kit = Kit.objects.get(id=kit_id)
        if kit.status != "LOANED":
            return Response({"error": "Kit is not loaned and cannot be returned."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if content matches
        compressed_content = compress_content(content)
        if content_matches(compressed_content, kit.blueprint.complete_content) is False:
            return Response({"error": "Expected content does not match."}, status=status.HTTP_400_BAD_REQUEST)

        if return_more_than_borrowed(compressed_content, kit_id):
            return Response({"error": "Returned content is more than expected."}, status=status.HTTP_400_BAD_REQUEST)

        # Update loan history
        loan_history = LoanHistory.objects.filter(kit=kit, return_date__isnull=True).latest('date')

        loan_history.return_date = timezone.now()
        loan_history.snapshot = content
        loan_history.save()

        kit.content = content
        kit.status = "READY"
        kit.save()

        return Response({"message": "Kit returned successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def revert_kit_order(request, kit_id):
    try:
        # Check if kit is loaned
        kit = Kit.objects.get(id=kit_id)

        if kit.status != "LOANED":
            return Response({"error": "Kit is not loaned and cannot be reverted."}, status=status.HTTP_400_BAD_REQUEST)

        loan_history = LoanHistory.objects.filter(kit__id=kit_id, return_date__isnull=True).latest('date')

        loan_history.return_date = timezone.now()
        loan_history.type = "LOAN AND REVERT"
        loan_history.save()

        kit.status = "READY"
        kit.save()

        return Response({"message": "Kit reverted successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def restock_options(request, kit_id):
    try:
        kit = Kit.objects.get(id=kit_id)
        blueprint_id = kit.blueprint.id

        if kit.status != "READY":
            return Response({"error": "Kit is not ready and cannot be restocked."}, status=status.HTTP_400_BAD_REQUEST)

        if kit_is_complete(kit_id):
            return Response({"error": "Kit is already complete."}, status=status.HTTP_400_BAD_REQUEST)
        return Response(get_restock_options(blueprint_id, kit.content), status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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
            return Response({"error": "Content does not match blueprint!"}, status=status.HTTP_400_BAD_REQUEST)

        if add_more_than_expected(compressed_projected_content, blueprint.complete_content):
            return Response({"error": "Added content is more than expected."}, status=status.HTTP_400_BAD_REQUEST)

        res = attempt_items_withdrawal(restock_expiries)
        item_insufficient = res[1]
        if not res[0]:
            return Response({"error": f"Insufficient stock for {item_insufficient}."},
                            status=status.HTTP_400_BAD_REQUEST)

        kit.content = projected_content
        kit.save()

        History.objects.create(
            kit=kit,
            type="RESTOCK",
            date=datetime.date.today(),
            person=request.user.username,
            snapshot=projected_content
        )

        return Response({"message": "Kit restocked successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
