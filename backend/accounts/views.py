import os
from rest_framework import status
from deck.utils import upload_file
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
        confirm_password = request.data.get("confirm_password")
        file = request.data.get("image")

        if password != confirm_password:
            return Response(
                {"message": "Passwords do not match"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if username != None:
            request.user.username = username

        if password != None:
            request.user.set_password(password)

        if file != None:
            _, file_extension = os.path.splitext(file.name)
            img_url = upload_file(
                f"user_dp/{request.user.id}{file_extension}", file.read()
            )
            request.user.extras.profile_pic = img_url

        request.user.save()
        return Response({"message": "success"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TokenObtainPairViewWithUserData(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializerWithUserData
