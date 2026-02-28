# File: scripts/run-with-sudo.sh
#!/bin/sh
# helper for environments where you must use sudo to run docker/next
# it preserves POSTGRES_PASSWORD and REDIS_PASSWORD via -E and warns about root.

# Usage: sudo -E sh scripts/run-with-sudo.sh [dev|down|volume-rm]

CMD=${1:-dev}

: "${POSTGRES_PASSWORD:=password}"
: "${REDIS_PASSWORD:=password}"

if [ "$(id -u)" != "0" ]; then
  echo "This script is intended to be invoked via sudo so it can talk to docker."
  echo "You may want to add your user to the docker group and run the commands without sudo."
  echo
fi

case "$CMD" in
  dev)
    echo "Starting containers and Next.js dev server (preserving env)"
    sudo -E sh ./scripts/dev.sh
    ;;
  down)
    echo "Stopping containers"
    sudo -E docker compose down
    ;;
  volume-rm)
    echo "Removing postgres data volume (destructive)"
    sudo -E docker volume rm nexus_v2_postgres_data
    ;;
  *)
    echo "Unknown command: $CMD"
    echo "Available: dev, down, volume-rm"
    exit 1
    ;;
esac
