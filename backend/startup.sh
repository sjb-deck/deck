#!/bin/sh

python manage.py makemigrations &&
python manage.py migrate &&
python manage.py shell -c "
from django.contrib.auth import get_user_model;
from decouple import config
User = get_user_model();
if not User.objects.filter(username=config('DEFAULT_ADMIN_USERNAME')).exists():
    User.objects.create_superuser(config('DEFAULT_ADMIN_USERNAME'), None, config('DEFAULT_ADMIN_PASSWORD'));
"