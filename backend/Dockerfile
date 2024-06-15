# backend/Dockerfile

FROM python:3.11 as development

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

FROM python:3.11 as production

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .


CMD ["gunicorn", "--config", "gunicorn_config.py", "deck.wsgi:application"]
