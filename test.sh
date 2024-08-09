#!/bin/bash

# Check if an argument is passed
if [ -z "$1" ]; then
  # No argument passed, use the default value
  ARGS=""
else
  # Use the provided argument
  ARGS="$1"
fi

# Run the Docker Compose command with the specified ARGS
docker compose run --rm --env ARGS="$ARGS" backend_test

# Remove the Docker image
docker rmi deck-backend_test