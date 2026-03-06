#!/bin/bash
set -e

# helper script to start every service with a single command
# usage: ./scripts/start-all.sh [--no-dev]
# without flags it will bring up the compose stacks and then kick off the
# Next.js dev server (port 3030) in the foreground.  pass --no-dev to skip
# the dev server if you just want the containers running.

# ensure we're not root (dev.sh insists on that)
if [ "$(id -u)" = "0" ]; then
  echo "[error] please run as a normal user (add yourself to the docker group)" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd -P)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd -P)"
cd "$PROJECT_ROOT"

COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-nexus-v2}"
export COMPOSE_PROJECT_NAME

compose_cmd() {
  docker compose --project-directory "$PROJECT_ROOT" -p "$COMPOSE_PROJECT_NAME" "$@"
}

# export sensible defaults
: "${POSTGRES_PASSWORD:=password}"
: "${REDIS_PASSWORD:=password}"

# remove stale override if rust service has returned
if [ -f no-rust.yml ] && [ -d rust-agents/crates/service ]; then
  rm -f no-rust.yml
fi

# 1. docker-compose stack for Nexus app & infra
echo "Starting main compose stack..."

# decide whether to include the production app container.  default behaviour
# for development is to *omit* nexus-app since we'll run the server locally.
include_app=false
for arg in "$@"; do
  case "$arg" in
    --build-app|--with-app) include_app=true ;;
  esac
done

# production stack service list (non-profile services)
if $include_app; then
  services="nexus-app postgres postgres-ai redis traefik vaultwarden prometheus blackbox-exporter pushgateway alertmanager loki grafana node_exporter postgres_exporter redis_exporter postgres-ai-exporter wireguard wireguard-exporter telegram-notify uptime-kuma n8n nginx-proxy-manager cadvisor portainer crowdsec falco trivy-cron lldap keycloak semaphore"
else
  services="postgres postgres-ai redis traefik vaultwarden prometheus blackbox-exporter pushgateway alertmanager loki grafana node_exporter postgres_exporter redis_exporter postgres-ai-exporter wireguard wireguard-exporter telegram-notify uptime-kuma n8n nginx-proxy-manager cadvisor portainer crowdsec falco trivy-cron lldap keycloak semaphore"
fi

if [ -d rust-agents/crates/service ]; then
  echo "(detected rust service directory — including nexus-rust-service)" >&2
  services="$services nexus-rust-service"
else
  echo "(rust service directory not found — skipping nexus-rust-service)" >&2
  # clean up any leftover override file from a previous run
  rm -f no-rust.yml
fi
# shellcheck disable=SC2086
echo "service list: $services" >&2

compose_cmd config --quiet

set -x
# rebuild nexus-app image when --build-app is requested, then start everything
if $include_app; then
  compose_cmd up -d --build --pull missing nexus-app
fi
# shellcheck disable=SC2086
compose_cmd up -d --pull missing $services

# if we are skipping the app container, note that user must run dev server
if ! $include_app; then
  echo "(nexus-app container omitted; assuming you're running Next.js locally)" >&2
fi
set +x

# 2. optional dev server (skip if running container with --build-app)
if ! $include_app; then
  if [ "$1" != "--no-dev" ]; then
    echo "Launching Next.js development server on port ${PORT:-3030}..."
    exec sh ./scripts/dev.sh
  else
    echo "--no-dev specified, skipping Next.js dev server"
  fi
else
  echo "(nexus-app container running — skipping local dev server)"
fi
