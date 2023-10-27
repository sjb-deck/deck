from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


from .serializers import *
from ..items.models import *


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_kits(request):
    try:
        kits = Kit.objects.all()
        serializer = KitSerializer(kits, many=True)
        blueprints = Blueprint.objects.values_list('name', flat=True).distinct()

        return Response({
            'kits': serializer.data,
            'blueprints': list(blueprints)
        })
    except Exception as e:
        return Response(e.args, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def add_kit(request):
    try:
        blueprint_id = request.data.get("blueprint")
        name = request.data.get("name")

        if not blueprint_id or not name:
            return Response({"error": "Required parameters are missing!"}, status=status.HTTP_400_BAD_REQUEST)

        blueprint = Blueprint.objects.get(id=blueprint_id)

        Kit.objects.create(
            name=name,
            blueprint=blueprint,
            status="READY",
            content=blueprint.complete_content,
        )

        return Response({"message": "Kit added successfully!"},
                        status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def retire_kit(request):
    try:
        kit_id = request.GET.get("kit_id")

        if not kit_id:
            return Response({"error": "Required parameters are missing!"}, status=status.HTTP_400_BAD_REQUEST)

        kit = Kit.objects.get(id=kit_id)
        content = kit.content

        # Check that all items can be deposited
        for item in content:
            item_id = item.get("id")
            quantity = item.get("quantity")
            if not item_id or quantity is None:
                raise Exception("Content JSON is missing required data.")

            item_expiry = ItemExpiry.objects.get(id=item_id)

            if item_expiry.quantity is None or quantity < 0 or (item_expiry.quantity + quantity) < 0:
                raise Exception(f"Cannot deposit {quantity} for item with ID {item_id}.")

        # Deposit all items
        for item in content:
            item_id = item.get("id")
            quantity = item.get("quantity")

            item_expiry = ItemExpiry.objects.get(id=item_id)
            item_expiry.deposit(quantity)

        kit.status = "RETIRED"
        kit.save()

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
            item_id = item.get("id")
            if not item_id:
                raise Exception("Content JSON is missing required data for an item.")

            if not ItemExpiry.objects.filter(id=item_id).exists():
                return Response({"error": f"Item with ID {item_id} does not exist in ItemExpiry."},
                                status=status.HTTP_400_BAD_REQUEST)

        Blueprint.objects.create(
            name=name,
            content=content,
        )

        return Response({"message": "Blueprint added successfully!"},
                        status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def kit_history(request):
    return Response({"message": "Hello, world!"})


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
