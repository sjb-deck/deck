import os
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import TokenObtainPairSerializerWithUserData
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


# Create your views here.
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def edit(request):
    try:
        username = request.data.get("username")
        password = request.data.get("password")
        confirm_password = request.data.get("confirmPassword")
        filename = request.data.get("image")

        if password != confirm_password:
            return Response(
                {"message": "Passwords do not match"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if username != None:
            request.user.username = username

        if password != None:
            request.user.set_password(password)

        if filename != None:
            request.user.extras.profile_pic = filename

        request.user.save()
        return Response({"message": "success"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TokenObtainPairViewWithUserData(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializerWithUserData
