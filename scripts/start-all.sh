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

# if the rust microservice folder is missing (e.g. in this stripped-down
# environment) then exclude that service to avoid build failures.
# use a plain string so the script works under /bin/sh as well as bash.
if $include_app; then
  services="nexus-app postgres redis traefik vaultwarden prometheus loki grafana wireguard telegram-notify uptime-kuma"
else
  services="postgres redis traefik vaultwarden prometheus loki grafana wireguard telegram-notify uptime-kuma"
fi

if [ -d rust-agents/crates/service ]; then
  echo "(detected rust service directory)" >&2
  services="$services nexus-rust-service"
else
  echo "(rust service directory not found; using override to skip build)" >&2
  # create override file that replaces the build instruction with a noop image
  cat > no-rust.yml <<'EOF'
services:
  nexus-rust-service:
    image: busybox
    build: false
EOF
  services="$services nexus-rust-service"
fi
# shellcheck disable=SC2086
echo "service list: $services" >&2
# show exact command being executed
set -x
# if we created an override file, pass it to compose
if [ -f no-rust.yml ]; then
  # shellcheck disable=SC2086
  docker compose -f docker-compose.yml -f no-rust.yml up -d $services
else
  # shellcheck disable=SC2086
  docker compose up -d $services
fi

# if we are skipping the app container, note that user must run dev server
if ! $include_app; then
  echo "(nexus-app container omitted; assuming you're running Next.js locally)" >&2
fi
set +x

# 2. vpn/monitoring stack if present
# Start only the services unique to the vpn-stack; skip prometheus/grafana/vaultwarden
# because those are already owned by the main compose stack above.
if [ -d vpn-stack ]; then
  echo "Starting vpn-stack services..."
  (cd vpn-stack && docker compose up -d wg-easy crowdsec node-exporter cadvisor wazuh.indexer wazuh.manager wazuh.dashboard) || true
fi

# 3. optional dev server
if [ "$1" != "--no-dev" ]; then
  echo "Launching Next.js development server on port ${PORT:-3030}..."
  exec sh ./scripts/dev.sh
else
  echo "--no-dev specified, skipping Next.js dev server"
fi
