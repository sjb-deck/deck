from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import UserExtras, User


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("username", "password1", "password2")

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
        profile = UserExtras.objects.create(user=user)
        return user
