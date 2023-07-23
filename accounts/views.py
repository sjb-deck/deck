import os

from django import forms
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render
from django.urls import reverse

from .forms import CustomUserCreationForm
from .models import UserExtras


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
            form = ImageUploadForm(request.POST, request.FILES)
            if form.is_valid():
                m = UserExtras.objects.get(user=request.user)
                if bool(m.profile_pic) is not False:
                    image_path = m.profile_pic.path
                    if os.path.exists(image_path):
                        os.remove(image_path)
                m.profile_pic = form.cleaned_data["image"]
                m.save()
        return redirect(reverse("main_index"))
    else:
        return render(request, "user_info.html", {"user": request.user})
