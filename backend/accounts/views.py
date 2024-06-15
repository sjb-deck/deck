import os
from django.contrib.auth.decorators import login_required
from deck.utils import upload_file
from django.http import JsonResponse
from rest_framework.decorators import api_view
from accounts.serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import TokenObtainPairSerializerWithUserData


# Create your views here.
@api_view(["POST"])
@login_required(login_url="/r'^login/$'")
def edit(request):
    new_username = request.POST.get("username", "")
    f = request.FILES.get("image", None)
    request.user.username = new_username
    if f != None:
        _, file_extension = os.path.splitext(f.name)
        img_url = upload_file(f"user_dp/{request.user.id}{file_extension}", f.read())
        request.user.extras.profile_pic = img_url
    request.user.save()
    return JsonResponse(data=UserSerializer(request.user), status=200)


class TokenObtainPairViewWithUserData(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializerWithUserData
