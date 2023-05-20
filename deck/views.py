from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse


@login_required(login_url="/r'^login/$'")
def main_index(request):
    return render(request, "main_index.html")


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        to_redirect = request.POST["to_redirect"]
        user = authenticate(request, username=username, password=password)

        if user != None:
            login(request, user)
            return JsonResponse(
                data={"success": True, "to_redirect": to_redirect}, status=200
            )
        else:
            return JsonResponse(
                data={"success": False, "responseText": "Invalid Credentials"},
                status=401,
            )
    else:
        to_redirect = request.GET.get("next")
        return render(request, "login.html", {"to_redirect": to_redirect})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login_view"))
