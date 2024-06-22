from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.http import HttpResponse
import requests
from decouple import config


@login_required(login_url="/r'^login/$'")
def main_index(request):
    return render(request, "main_index.html")


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        toRedirect = request.POST.get("next", "/")
        user = authenticate(request, username=username, password=password)

        # We currently only have one app, so if the user is redirected to the root,
        # we will redirect them to the inventory page
        if toRedirect == "/":
            toRedirect = "/inventory"

        if user != None:
            login(request, user)
            return JsonResponse(data={"toRedirect": toRedirect}, status=200)
        else:
            return JsonResponse(
                data={"success": False, "responseText": "Invalid Credentials"},
                status=401,
            )
    else:
        response = render(request, "login.html")
        response.set_cookie(key="csrftoken", value=get_token(request))
        response.set_cookie(key="next", value=request.GET.get("next", "/"))
        return response


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login_view"))


@login_required(login_url="/r'^login/$'")
def get_image(request, image_path):
    username = config("NEXTCLOUD_USERNAME")
    password = config("NEXTCLOUD_APP_PASSWORD")
    url = f"https://nextcloud.nhhs-sjb.org/remote.php/dav/files/{username}/Shared/deck/{image_path}"
    response = requests.get(url, auth=(username, password), stream=True)

    if response.status_code == 200:
        return HttpResponse(
            response.content, content_type=response.headers["Content-Type"]
        )
    else:
        return HttpResponse("Not Found", status=404)
