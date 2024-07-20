# backend/Dockerfile

FROM python:3.11 as base

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
