#!/usr/bin/env bash
# =============================================================================
# NEXUS Infrastructure Provisioning Script
# Configures Grafana, VaultWarden and validates service connectivity
# after docker-compose up.
#
# Usage:
#   ./scripts/provision.sh [--grafana-url URL] [--grafana-pass PASS]
#
# All defaults are read from .env, overridable via CLI flags.
# =============================================================================
set -euo pipefail

# ── Load .env ──────────────────────────────────────────────────────────────
if [[ -f "$(dirname "$0")/../.env" ]]; then
  set -o allexport
  # shellcheck disable=SC1091
  source "$(dirname "$0")/../.env"
  set +o allexport
fi

# ── Defaults (override via env or flags) ──────────────────────────────────
GRAFANA_URL="${GRAFANA_URL:-http://localhost:3000}"
GRAFANA_USER="${GRAFANA_USER:-admin}"
GRAFANA_PASS="${GRAFANA_PASS:-adminpass}"
PROMETHEUS_URL="${PROMETHEUS_URL:-http://localhost:9090}"
LOKI_URL="${LOKI_URL:-http://localhost:3100}"
VAULTWARDEN_URL="${VAULTWARDEN_URL:-http://localhost:8080}"

# ── Colours ────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
fail() { echo -e "${RED}[✗]${NC} $*"; }

# ── Helpers ────────────────────────────────────────────────────────────────
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

# ── Header ─────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "  NEXUS Infrastructure Provisioning"
echo "═══════════════════════════════════════════════"
echo ""

# ── 1. Check all containers are running ───────────────────────────────────
echo "▶  Checking container health…"
REQUIRED=(nexus_app nexus_postgres nexus_redis prometheus loki grafana traefik vaultwarden)
ALL_UP=true
for c in "${REQUIRED[@]}"; do
  STATUS=$(docker inspect --format='{{.State.Status}}' "$c" 2>/dev/null || echo "missing")
  if [[ "$STATUS" == "running" ]]; then
    ok "$c ($STATUS)"
  else
    fail "$c — status: $STATUS"
    ALL_UP=false
  fi
done
if [[ "$ALL_UP" == false ]]; then
  warn "Some containers are not running. Run: docker compose up -d"
  echo ""
fi

# ── 2. Wait for Grafana ───────────────────────────────────────────────────
echo ""
echo "▶  Grafana…"
wait_for "Grafana" "${GRAFANA_URL}/api/health"

# Check Prometheus datasource (auto-provisioned via file)
DS=$(gf_api GET "/api/datasources/name/Prometheus" 2>/dev/null || echo "{}")
if echo "$DS" | grep -q '"type":"prometheus"'; then
  ok "Prometheus datasource already provisioned"
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

# Check Loki datasource
DS=$(gf_api GET "/api/datasources/name/Loki" 2>/dev/null || echo "{}")
if echo "$DS" | grep -q '"type":"loki"'; then
  ok "Loki datasource already provisioned"
else
  warn "Loki datasource not found — provisioning manually…"
  gf_api POST "/api/datasources" '{
    "name": "Loki",
    "type": "loki",
    "access": "proxy",
    "url": "http://loki:3100"
  }' >/dev/null && ok "Loki datasource created"
fi

# Create a service account + token for automation
SA_NAME="nexus-automation"
SA_EXISTING=$(gf_api GET "/api/serviceaccounts/search?query=${SA_NAME}" 2>/dev/null | \
  python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('totalCount',0))" 2>/dev/null || echo "0")

if [[ "$SA_EXISTING" -gt 0 ]]; then
  ok "Service account '${SA_NAME}' already exists"
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
      echo "    → Add GRAFANA_SERVICE_TOKEN=${TOKEN} to .env for CI/CD use"
    fi
  else
    warn "Could not create service account (may already exist under a different query)"
  fi
fi

# ── 3. Prometheus health ──────────────────────────────────────────────────
echo ""
echo "▶  Prometheus…"
wait_for "Prometheus" "${PROMETHEUS_URL}/-/healthy" 30
TARGETS=$(curl -sf "${PROMETHEUS_URL}/api/v1/targets" 2>/dev/null | \
  python3 -c "import sys,json; d=json.load(sys.stdin); \
  active=d.get('data',{}).get('activeTargets',[]); \
  print(f'{len(active)} targets')" 2>/dev/null || echo "unknown")
ok "Prometheus targets: $TARGETS"

# ── 4. Loki health ───────────────────────────────────────────────────────
echo ""
echo "▶  Loki…"
wait_for "Loki" "${LOKI_URL}/ready" 30
ok "Loki ready"

# ── 5. Redis ping ─────────────────────────────────────────────────────────
echo ""
echo "▶  Redis…"
REDIS_PASS="${REDIS_PASSWORD:-another_strong_password}"
PONG=$(docker exec nexus_redis redis-cli -a "${REDIS_PASS}" ping 2>/dev/null || echo "FAIL")
if [[ "$PONG" == "PONG" ]]; then
  ok "Redis responds to PING"
else
  fail "Redis ping failed (password may be wrong or container not running)"
fi

# ── 6. VaultWarden ───────────────────────────────────────────────────────
echo ""
echo "▶  VaultWarden…"
VW_STATUS=$(curl -sf "${VAULTWARDEN_URL}/alive" 2>/dev/null || echo "")
if [[ -n "$VW_STATUS" ]]; then
  ok "VaultWarden is alive at ${VAULTWARDEN_URL}"
  echo "    Admin panel: ${VAULTWARDEN_URL}/admin"
  if [[ -z "${VAULTWARDEN_ADMIN_TOKEN:-}" ]]; then
    warn "VAULTWARDEN_ADMIN_TOKEN not set in .env — admin panel is disabled"
    warn "Set it and add to docker-compose: ADMIN_TOKEN: \${VAULTWARDEN_ADMIN_TOKEN}"
  fi
else
  warn "VaultWarden not reachable at ${VAULTWARDEN_URL}"
  warn "Check: docker logs vaultwarden"
fi

# ── 7. Traefik ───────────────────────────────────────────────────────────
echo ""
echo "▶  Traefik…"
TK=$(curl -sf "http://localhost:80" -o /dev/null -w "%{http_code}" 2>/dev/null || echo "000")
if [[ "$TK" != "000" ]]; then
  ok "Traefik HTTP entrypoint responding (HTTP $TK)"
else
  warn "Traefik port 80 not responding — check: docker logs traefik"
fi

# ── Done ──────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════"
echo "  Provisioning complete"
echo ""
echo "  Grafana   → ${GRAFANA_URL}  (admin / \$GRAFANA_PASS)"
echo "  Prometheus→ ${PROMETHEUS_URL}"
echo "  Loki      → ${LOKI_URL}"
echo "  VaultWarden→ ${VAULTWARDEN_URL}"
echo "═══════════════════════════════════════════════"
echo ""
