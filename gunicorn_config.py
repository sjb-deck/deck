# gunicorn_config.py

bind = "0.0.0.0:8000"
module = "deck.wsgi:application"

workers = 4
worker_connections = 1000
threads = 4
