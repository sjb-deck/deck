import os

from django import forms
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.urls import reverse

from .forms import CustomUserCreationForm
from .models import UserExtras

from deck.utils import upload_file


class ImageUploadForm(forms.Form):
    """Image upload form."""

    image = forms.ImageField()


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
def edit(request):
    if request.method == "POST":
        new_username = request.POST.get("username", "")
        f = request.FILES.get("image", None)
        request.user.username = new_username
        if f != None:
            _, file_extension = os.path.splitext(f.name)
            img_url = upload_file(
                f"user_dp/{request.user.id}{file_extension}", f.read()
            )
            request.user.extras.profile_pic = img_url
        request.user.save()
        return redirect(reverse("main_index"))
    else:
        return render(request, "user_info.html", {"user": request.user})
