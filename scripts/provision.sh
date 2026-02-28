#!/usr/bin/env bash
# =============================================================================
# NEXUS Infrastructure Provisioning Script
# Run this ONCE after first `docker compose up -d` to:
#   • Create the n8n Postgres database
#   • Validate Grafana datasources (auto-provisioned, but verifies them)
#   • Verify all service health endpoints
#
# Usage:
#   ./scripts/provision.sh
# =============================================================================
set -euo pipefail

# ── Load .env ──────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../.env"
if [[ -f "$ENV_FILE" ]]; then
  set -o allexport
  # shellcheck disable=SC1091
  source "$ENV_FILE"
  set +o allexport
fi

# ── Defaults ──────────────────────────────────────────────────────────────
GRAFANA_URL="${GRAFANA_URL:-http://localhost:3000}"
GRAFANA_USER="${GRAFANA_USER:-admin}"
GRAFANA_PASS="${GRAFANA_PASS:-admin}"
PROMETHEUS_URL="${PROMETHEUS_URL:-http://localhost:9090}"
LOKI_URL="${LOKI_URL:-http://localhost:3100}"
# VaultWarden is now reachable directly via the localhost port mapping
VAULTWARDEN_URL="${VAULTWARDEN_URL:-http://localhost:8080}"
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-nexus_postgres}"
POSTGRES_USER="${POSTGRES_USER:-nexus}"

# ── Colours ───────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
fail() { echo -e "${RED}[✗]${NC} $*"; }
info() { echo -e "${CYAN}[i]${NC} $*"; }

# ── Helpers ───────────────────────────────────────────────────────────────
wait_for() {
  local name="$1" url="$2" max="${3:-60}"
  echo -n "    Waiting for $name"
  for i in $(seq 1 "$max"); do
    if curl -sf "$url" >/dev/null 2>&1; then
      echo; ok "$name is up"; return 0
    fi
    echo -n '.'
    sleep 2
  done
  echo; fail "$name did not become ready after $((max*2))s"; return 1
}

gf_api() {
  local method="$1" path="$2" body="${3:-}"
  if [[ -n "$body" ]]; then
    curl -sf -X "$method" \
      -u "${GRAFANA_USER}:${GRAFANA_PASS}" \
      -H 'Content-Type: application/json' \
      -d "$body" \
      "${GRAFANA_URL}${path}"
  else
    curl -sf -X "$method" \
      -u "${GRAFANA_USER}:${GRAFANA_PASS}" \
      "${GRAFANA_URL}${path}"
  fi
}

# ── Header ────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "  NEXUS Infrastructure Provisioning"
echo "═══════════════════════════════════════════════"
echo ""

# ── 1. Check all containers are running ──────────────────────────────────
echo "▶  Checking container health…"
REQUIRED=(nexus_postgres nexus_redis prometheus loki grafana traefik vaultwarden uptime_kuma n8n wireguard)
ALL_UP=true
for c in "${REQUIRED[@]}"; do
  STATUS=$(docker inspect --format='{{.State.Status}}' "$c" 2>/dev/null || echo "missing")
  if [[ "$STATUS" == "running" ]]; then
    ok "$c ($STATUS)"
  else
    warn "$c — status: $STATUS"
    ALL_UP=false
  fi
done
if [[ "$ALL_UP" == false ]]; then
  warn "Some containers are not running. Run: docker compose up -d"
  echo ""
fi

# ── 2. Create n8n Postgres database ──────────────────────────────────────
# n8n does NOT auto-create its database. The nexus user is a Postgres
# superuser (POSTGRES_USER), so it has CREATEDB privilege.
echo ""
echo "▶  n8n database…"
if docker exec "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" \
    -tAc "SELECT 1 FROM pg_database WHERE datname='n8n'" 2>/dev/null | grep -q 1; then
  ok "n8n database already exists"
else
  if docker exec "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" \
      -c "CREATE DATABASE n8n;" >/dev/null 2>&1; then
    ok "n8n database created — n8n will start successfully on next restart"
    info "Restarting n8n container to pick up the new database…"
    docker restart n8n >/dev/null 2>&1 && ok "n8n restarted" || warn "Could not restart n8n (may not be running yet)"
  else
    fail "Could not create n8n database — is nexus_postgres running?"
  fi
fi

# ── 3. Wait for Grafana ───────────────────────────────────────────────────
echo ""
echo "▶  Grafana…"
if wait_for "Grafana" "${GRAFANA_URL}/api/health"; then

  # Prometheus datasource (should be auto-provisioned from file)
  DS=$(gf_api GET "/api/datasources/name/Prometheus" 2>/dev/null || echo "{}")
  if echo "$DS" | grep -q '"type":"prometheus"'; then
    ok "Prometheus datasource provisioned"
  else
    warn "Prometheus datasource not found — provisioning manually…"
    gf_api POST "/api/datasources" '{
      "name": "Prometheus",
      "type": "prometheus",
      "access": "proxy",
      "url": "http://prometheus:9090",
      "isDefault": true
    }' >/dev/null && ok "Prometheus datasource created"
  fi

  # Loki datasource
  DS=$(gf_api GET "/api/datasources/name/Loki" 2>/dev/null || echo "{}")
  if echo "$DS" | grep -q '"type":"loki"'; then
    ok "Loki datasource provisioned"
  else
    warn "Loki datasource not found — provisioning manually…"
    gf_api POST "/api/datasources" '{
      "name": "Loki",
      "type": "loki",
      "access": "proxy",
      "url": "http://loki:3100"
    }' >/dev/null && ok "Loki datasource created"
  fi

  # Service account for CI/CD automation
  SA_NAME="nexus-automation"
  SA_EXISTING=$(gf_api GET "/api/serviceaccounts/search?query=${SA_NAME}" 2>/dev/null | \
    python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('totalCount',0))" 2>/dev/null || echo "0")
  if [[ "$SA_EXISTING" -gt 0 ]]; then
    ok "Grafana service account '${SA_NAME}' already exists"
  else
    SA=$(gf_api POST "/api/serviceaccounts" \
      "{\"name\":\"${SA_NAME}\",\"role\":\"Admin\",\"isDisabled\":false}" 2>/dev/null || echo "{}")
    SA_ID=$(echo "$SA" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "")
    if [[ -n "$SA_ID" ]]; then
      TOKEN=$(gf_api POST "/api/serviceaccounts/${SA_ID}/tokens" \
        "{\"name\":\"provision-token\",\"secondsToLive\":0}" 2>/dev/null | \
        python3 -c "import sys,json; print(json.load(sys.stdin).get('key',''))" 2>/dev/null || echo "")
      ok "Service account '${SA_NAME}' created (id=${SA_ID})"
      if [[ -n "$TOKEN" ]]; then
        echo "    Token: ${TOKEN}"
        echo "    → Add GRAFANA_SERVICE_TOKEN=${TOKEN} to .env"
      fi
    else
      warn "Could not create service account (may already exist)"
    fi
  fi
fi

# ── 4. Prometheus health ──────────────────────────────────────────────────
echo ""
echo "▶  Prometheus…"
if wait_for "Prometheus" "${PROMETHEUS_URL}/-/healthy" 30; then
  TARGETS=$(curl -sf "${PROMETHEUS_URL}/api/v1/targets" 2>/dev/null | \
    python3 -c "import sys,json; d=json.load(sys.stdin); \
    active=d.get('data',{}).get('activeTargets',[]); \
    print(f'{len(active)} active targets')" 2>/dev/null || echo "unknown")
  ok "Prometheus targets: $TARGETS"
fi

# ── 5. Loki health ────────────────────────────────────────────────────────
echo ""
echo "▶  Loki…"
wait_for "Loki" "${LOKI_URL}/ready" 30 && ok "Loki ready" || true

# ── 6. Redis ping ─────────────────────────────────────────────────────────
echo ""
echo "▶  Redis…"
REDIS_PASS="${REDIS_PASSWORD:-}"
PONG=$(docker exec nexus_redis redis-cli ${REDIS_PASS:+-a "$REDIS_PASS"} ping 2>/dev/null || echo "FAIL")
if [[ "$PONG" == "PONG" ]]; then
  ok "Redis responds to PING"
else
  fail "Redis ping failed — check: docker logs nexus_redis"
fi

# ── 7. VaultWarden ────────────────────────────────────────────────────────
# NOTE: VaultWarden requires a TLS secure context for its web vault.
# Access it at http://localhost:8080 (localhost IS a secure context).
# http://nexus-vaultwarden.local will show a 'secure context required' error.
echo ""
echo "▶  VaultWarden…"
VW_STATUS=$(curl -sf "${VAULTWARDEN_URL}/alive" 2>/dev/null || echo "")
if [[ -n "$VW_STATUS" ]]; then
  ok "VaultWarden is alive"
  echo "    Web vault:   ${VAULTWARDEN_URL}"
  echo "    Admin panel: ${VAULTWARDEN_URL}/admin"
  if [[ -z "${VAULTWARDEN_ADMIN_TOKEN:-}" ]]; then
    warn "VAULTWARDEN_ADMIN_TOKEN not set — admin panel requires it"
    info "Generate: openssl rand -base64 48"
  fi
else
  warn "VaultWarden not reachable at ${VAULTWARDEN_URL}"
  info "Check: docker logs vaultwarden"
fi

# ── 8. Uptime Kuma ────────────────────────────────────────────────────────
echo ""
echo "▶  Uptime Kuma…"
UK_STATUS=$(curl -sf "http://localhost" -H "Host: nexus-uptime.local" -o /dev/null -w "%{http_code}" 2>/dev/null || echo "000")
if [[ "$UK_STATUS" != "000" ]]; then
  ok "Uptime Kuma responding (HTTP ${UK_STATUS}) → http://nexus-uptime.local"
else
  warn "Uptime Kuma not reachable — check: docker logs uptime_kuma"
fi

# ── 9. n8n health ─────────────────────────────────────────────────────────
echo ""
echo "▶  n8n…"
N8N_STATUS=$(curl -sf "http://localhost" -H "Host: nexus-n8n.local" -o /dev/null -w "%{http_code}" 2>/dev/null || echo "000")
if [[ "$N8N_STATUS" != "000" ]]; then
  ok "n8n responding (HTTP ${N8N_STATUS}) → http://nexus-n8n.local"
else
  warn "n8n not reachable yet — it may still be starting or the database was just created"
  info "Wait 30 seconds and retry: curl -s http://localhost -H 'Host: nexus-n8n.local' -o /dev/null -w '%{http_code}'"
fi

# ── 10. WireGuard ─────────────────────────────────────────────────────────
echo ""
echo "▶  WireGuard…"
WG_STATUS=$(docker inspect --format='{{.State.Status}}' wireguard 2>/dev/null || echo "missing")
if [[ "$WG_STATUS" == "running" ]]; then
  ok "WireGuard container is running → http://nexus-vpn.local"
  info "Web UI password: \$WIREGUARD_PASS from .env"
else
  warn "WireGuard status: ${WG_STATUS}"
  info "Ensure the host kernel supports WireGuard: lsmod | grep wireguard"
  info "If missing: sudo modprobe wireguard"
fi

# ── 11. Traefik ───────────────────────────────────────────────────────────
echo ""
echo "▶  Traefik…"
TK=$(curl -sf "http://localhost:80" -o /dev/null -w "%{http_code}" 2>/dev/null || echo "000")
if [[ "$TK" != "000" ]]; then
  ok "Traefik port 80 responding (HTTP ${TK}) → http://nexus-traefik.local"
else
  warn "Traefik port 80 not responding — check: docker logs traefik"
fi

# ── Done ──────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "  Provisioning complete"
echo ""
echo "  Service            Local URL"
echo "  ─────────────────────────────────────────────"
echo "  Grafana            http://nexus-grafana.local"
echo "  Prometheus         http://nexus-prometheus.local"
echo "  Loki               http://nexus-loki.local"
echo "  VaultWarden        http://localhost:8080  ← use this (secure context)"
echo "  n8n                http://nexus-n8n.local"
echo "  Uptime Kuma        http://nexus-uptime.local"
echo "  WireGuard          http://nexus-vpn.local"
echo "  Traefik dashboard  http://nexus-traefik.local"
echo "═══════════════════════════════════════════════"
echo ""
info "Run first: sudo ./scripts/register-local-hosts.sh add"
