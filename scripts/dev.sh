#!/bin/sh
set -e

# ensure we have sensible defaults for passwords (not for production!)
: "${POSTGRES_PASSWORD:=password}"
: "${REDIS_PASSWORD:=password}"

# warn if running as root (sudo strips environment variables)
if [ "$(id -u)" = "0" ]; then
  echo "[warn] running as root; environment variables may not be preserved."
  echo "        avoid using sudo or export POSTGRES_PASSWORD & REDIS_PASSWORD before sudo."
fi

printf "Starting postgres and redis containers...\n"
# bring up essential services; make sure password env vars are exported
# docker compose will substitute ${POSTGRES_PASSWORD} etc.
docker compose up -d postgres redis

# wait for postgres to become healthy
printf "Waiting for postgres to accept connections...\n"
# use docker exec psql to poll
until docker exec -i nexus_v2_db pg_isready -U nexus >/dev/null 2>&1; do
  sleep 1
done

# retrieve container IP and export DATABASE_URL so prismaclient connects correctly
IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' nexus_v2_db)
export DATABASE_URL="postgresql://nexus:${POSTGRES_PASSWORD}@${IP}:5432/nexus_v2"

printf "Using DATABASE_URL=%s\n" "$DATABASE_URL"

# allow optional GROK_API_KEY from environment
: "${GROK_API_KEY:=}"

# perform agents sync before starting server
if command -v npm >/dev/null 2>&1; then
  echo "Syncing agents..."
  npm run agent:sync || true
fi

# finally start the Next.js dev server
# run in the same process so environment variables remain set
exec npx next dev -p "${PORT:-3030}"
