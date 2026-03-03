#!/usr/bin/env bash

# Fetch WEBHOOK_TOKEN_DOCKER safely from .env
WEBHOOK_TOKEN_DOCKER=$(grep "^WEBHOOK_TOKEN_DOCKER=" .env | cut -d '=' -f 2-)

for id in $(docker ps -q); do
  name=$(docker inspect --format='{{.Name}}' $id | sed 's/^\///')
  image=$(docker inspect --format='{{.Config.Image}}' $id)
  
  echo "Registering $name ($id)..."
  
  curl -s -X POST http://localhost:3030/api/docker/register \
    -H "Authorization: Bearer $WEBHOOK_TOKEN_DOCKER" \
    -H "Content-Type: application/json" \
    -d "{
      \"containerId\": \"$id\",
      \"containerName\": \"$name\",
      \"image\": \"$image\",
      \"networks\": [\"internal\"]
    }"
  echo ""
done

echo "Done!"
