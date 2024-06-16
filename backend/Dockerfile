# backend/Dockerfile

FROM python:3.11 as base

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

# Development stage
FROM base as development

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# Production stage
FROM base as production

COPY . .

CMD ["gunicorn", "--config", "gunicorn_config.py", "deck.wsgi:application"]
