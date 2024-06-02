import os

from django import forms
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.urls import reverse

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .forms import CustomUserCreationForm
from .models import UserExtras

from deck.utils import upload_file


# Create your views here.
@login_required(login_url="/r'^login/$'")
def register(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect(reverse("main_index"))
        else:
            return render(request, "register.html", {"form": form})
    else:
        form = CustomUserCreationForm()
        return render(request, "register.html", {"form": form})


@login_required(login_url="/r'^login/$'")
def edit_page(request):
    return render(request, "user_edit.html")


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
                stauts=status.HTTP_400_BAD_REQUEST,
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
