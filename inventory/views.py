from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from inventory.items.views import *


# Create your views here.
@login_required(login_url="/r'^login/$'")
def inventory_index(request):
    return render(request, "inventory_index.html")


@login_required(login_url="/r'^login/$'")
def admin(request):
    return render(request, "admin.html")


@login_required(login_url="/r'^login/$'")
def loan_return(request):
    return render(request, "loan_return.html")

@login_required(login_url="/r'^login/$'")
def alerts(request):
    return render(request, "alerts.html")


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
