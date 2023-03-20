from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from .forms import CustomUserCreationForm

# Create your views here.
@login_required(login_url="/r'^login/$'")
def register(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect(reverse('main_index'))
        else: 
            return render(request, 'register.html', {'form': form})
    else:
        form = CustomUserCreationForm()
        return render(request, "register.html", {'form': form})