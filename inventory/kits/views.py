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
def add_kit(request):
    try:
        blueprint_id = request.data.get("blueprint")
        name = request.data.get("name")
        username = request.user.username

        if blueprint_id is None or not name or not username:
            return Response({"error": "Required parameters are missing!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blueprint = Blueprint.objects.get(id=blueprint_id, status="ACTIVE")
        except Blueprint.DoesNotExist:
            return Response({"error": "No such blueprint found!"}, status=status.HTTP_400_BAD_REQUEST)

        if Kit.objects.filter(name=name).exists():
            return Response({"error": "Kit with this name already exists!"}, status=status.HTTP_400_BAD_REQUEST)

        content = blueprint.complete_content

        if not attempt_items_withdrawal(content):
            return Response({"error": "Not enough items in stock!"}, status=status.HTTP_400_BAD_REQUEST)

        new_kit = Kit.objects.create(
            name=name,
            blueprint=blueprint,
            status="READY",
            content=blueprint.complete_content,
        )

        History.objects.create(
            kit=new_kit,
            type="CREATION",
            date=datetime.date.today(),
            person=username,
            snapshot=blueprint.complete_content
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


@api_view(["GET"])
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

        # Check if all items in content exist in ItemExpiry
        for item in content:
            item_id = item.get("item_expiry_id")
            if not item_id:
                raise Exception("Content JSON is missing required data for an item.")

            if not ItemExpiry.objects.filter(id=item_id).exists():
                return Response({"error": f"Item with ID {item_id} does not exist in ItemExpiry."},
                                status=status.HTTP_400_BAD_REQUEST)

        blueprint = Blueprint.objects.create(
            name=name,
            complete_content=content,
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

        histories = History.objects.filter(kit__id=kit_id).order_by('-date')

        serializer = HistorySerializer(histories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def submit_kit_order(request):
    return Response({"message": "Hello, world!"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def return_kit_order(request):
    return Response({"message": "Hello, world!"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def revert_kit_order(request):
    return Response({"message": "Hello, world!"})
