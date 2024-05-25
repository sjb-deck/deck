import os
import django


def setup_django_env():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "deck.settings")
    django.setup()
