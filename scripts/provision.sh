#!/usr/bin/env bash
# =============================================================================
# NEXUS Infrastructure Provisioning Script
# Run this ONCE after first `docker compose up -d` to:
#   • Generate WireGuard PASSWORD_HASH and add to .env (if not already set)
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
  # Safely load .env without sourcing (avoids issues with special chars like <>)
  while IFS='=' read -r key value; do
    [[ ! "$key" =~ ^#|^[[:space:]]*$ ]] && export "$key=$value"
  done < "$ENV_FILE"
fi

# ── Defaults ──────────────────────────────────────────────────────────────
# Grafana/Prometheus/Loki are NOT exposed directly on host ports.
# Reach them via Traefik using Host headers (Traefik listens on :80).
TRAEFIK_HTTP="http://localhost"
GRAFANA_HOST="nexus-grafana.local"
PROMETHEUS_HOST="nexus-prometheus.local"
LOKI_HOST="nexus-loki.local"
GRAFANA_USER="${GRAFANA_USER:-admin}"
GRAFANA_PASS="${GRAFANA_PASS:-admin}"
# VaultWarden is reachable directly via localhost port mapping
VAULTWARDEN_URL="${VAULTWARDEN_URL:-http://localhost:8080}"
POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-nexus_postgres}"
POSTGRES_USER="${POSTGRES_USER:-nexus}"
POSTGRES_DB="${POSTGRES_DB:-postgres}"

# ── Colours ───────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
fail() { echo -e "${RED}[✗]${NC} $*"; }
info() { echo -e "${CYAN}[i]${NC} $*"; }

# ── Helpers ───────────────────────────────────────────────────────────────

# wait_for NAME URL [MAX_ATTEMPTS] [HOST_HEADER]
# Polls URL (via Traefik Host header if HOST_HEADER is provided) until 2xx/3xx
wait_for() {
  local name="$1" url="$2" max="${3:-60}" host="${4:-}"
  local extra_args=()
  if [[ -n "$host" ]]; then
    extra_args+=(-H "Host: $host")
  fi
  echo -n "    Waiting for $name"
  for _ in $(seq 1 "$max"); do
    # -s silent, do NOT use -f (we want to detect any HTTP response, not just 2xx)
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" "${extra_args[@]}" "$url" 2>/dev/null || echo "000")
    if [[ "$code" != "000" && "$code" != "502" && "$code" != "503" ]]; then
      echo; ok "$name is up (HTTP $code)"; return 0
    fi
    echo -n '.'
    sleep 2
  done
  echo; fail "$name did not become ready after $((max*2))s"; return 1
}

# gf_api METHOD /path [body]
# Calls Grafana API via Traefik Host header routing
gf_api() {
  local method="$1" path="$2" body="${3:-}"
  local base_args=(-s -H "Host: ${GRAFANA_HOST}" -u "${GRAFANA_USER}:${GRAFANA_PASS}")
  if [[ -n "$body" ]]; then
    curl "${base_args[@]}" -X "$method" \
      -H 'Content-Type: application/json' \
      -d "$body" \
      "${TRAEFIK_HTTP}${path}"
  else
    curl "${base_args[@]}" -X "$method" \
      "${TRAEFIK_HTTP}${path}"
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

# ── 2. WireGuard — generate PASSWORD_HASH if missing ─────────────────────
# wg-easy v14+ REMOVED support for plain PASSWORD env var.
# It REQUIRES a bcrypt hash in PASSWORD_HASH instead.
echo ""
echo "▶  WireGuard password hash…"
if [[ -n "${WIREGUARD_PASSWORD_HASH:-}" ]]; then
  ok "WIREGUARD_PASSWORD_HASH already set in .env"
else
  warn "WIREGUARD_PASSWORD_HASH not set — generating now…"
  WG_PASS="${WIREGUARD_PASS:-changeme}"
  # Use wg-easy's own wgpw command to generate the bcrypt hash
  RAW_HASH=$(docker run --rm ghcr.io/wg-easy/wg-easy wgpw "$WG_PASS" 2>/dev/null || echo "")
  # Extract the bcrypt hash (matches $2b$ or $2a$ prefix)
  HASH=$(echo "$RAW_HASH" | grep -oE '\$2[aby]\$[0-9]+\$[./0-9A-Za-z]{53}' | head -1 || echo "")
  if [[ -n "$HASH" ]]; then
    # Escape dollar signs for safe .env storage (wrap in single quotes)
    echo "WIREGUARD_PASSWORD_HASH='${HASH}'" >> "$ENV_FILE"
    ok "Hash generated and appended to .env"
    info "Password: ${WG_PASS} → hash appended as WIREGUARD_PASSWORD_HASH"
    info "Restarting WireGuard to apply the hash…"
    docker compose -f "${SCRIPT_DIR}/../docker-compose.yml" up -d wireguard >/dev/null 2>&1 \
      && ok "WireGuard restarted" || warn "Could not restart WireGuard"
  else
    warn "Could not generate hash automatically"
    info "Run manually: docker run --rm ghcr.io/wg-easy/wg-easy wgpw YOUR_PASS"
    info "Then add:    WIREGUARD_PASSWORD_HASH='<hash>' to .env"
    info "Then:        docker compose up -d wireguard"
  fi
fi

# ── 3. Create n8n Postgres database ──────────────────────────────────────
# n8n does NOT auto-create its database.
echo ""
echo "▶  n8n database…"
if docker exec nexus_postgres_infra psql -U nexus_infra -d nexus_infra \
    -tAc "SELECT 1 FROM pg_database WHERE datname='n8n'" 2>/dev/null | grep -q 1; then
  ok "n8n database already exists"
else
  if docker exec nexus_postgres_infra psql -U nexus_infra -d nexus_infra \
      -c "CREATE DATABASE n8n;" 2>&1; then
    ok "n8n database created — restarting n8n to pick it up…"
    docker restart n8n >/dev/null 2>&1 && ok "n8n restarted" || warn "Could not restart n8n"
  else
    fail "Could not create n8n database"
    info "Debug: docker exec nexus_postgres_infra psql -U nexus_infra -d nexus_infra -c '\\l'"
  fi
fi

# ── 3a. Create HR Postgres database ──────────────────────────────────────
# HR database for employee/staff management (separate from store database)
echo ""
echo "▶  HR database…"
if docker exec "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
    -tAc "SELECT 1 FROM pg_database WHERE datname='nexus_hr'" 2>/dev/null | grep -q 1; then
  ok "HR database already exists"
else
  if docker exec "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
      -c "CREATE DATABASE nexus_hr;" 2>&1; then
    ok "HR database created"
  else
    fail "Could not create HR database"
    info "Debug: docker exec nexus_postgres psql -U nexus -d postgres -c '\\l'"
  fi
fi

# ── 4. Wait for Grafana ───────────────────────────────────────────────────
echo ""
echo "▶  Grafana…"
if wait_for "Grafana" "${TRAEFIK_HTTP}/api/health" 60 "${GRAFANA_HOST}"; then

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

# ── 5. Prometheus health ──────────────────────────────────────────────────
echo ""
echo "▶  Prometheus…"
if wait_for "Prometheus" "${TRAEFIK_HTTP}/-/healthy" 30 "${PROMETHEUS_HOST}"; then
  TARGETS=$(curl -s -H "Host: ${PROMETHEUS_HOST}" "${TRAEFIK_HTTP}/api/v1/targets" 2>/dev/null | \
    python3 -c "import sys,json; d=json.load(sys.stdin); \
    active=d.get('data',{}).get('activeTargets',[]); \
    print(f'{len(active)} active targets')" 2>/dev/null || echo "unknown")
  ok "Prometheus targets: $TARGETS"
fi

# ── 6. Loki health ────────────────────────────────────────────────────────
echo ""
echo "▶  Loki…"
wait_for "Loki" "${TRAEFIK_HTTP}/ready" 30 "${LOKI_HOST}" && ok "Loki ready" || true

# ── 7. Redis ping ─────────────────────────────────────────────────────────
echo ""
echo "▶  Redis…"
REDIS_PASS="${REDIS_PASSWORD:-}"
PONG=$(docker exec nexus_redis redis-cli ${REDIS_PASS:+-a "$REDIS_PASS"} ping 2>/dev/null || echo "FAIL")
if [[ "$PONG" == "PONG" ]]; then
  ok "Redis responds to PING"
else
  fail "Redis ping failed — check: docker logs nexus_redis"
fi

# ── 8. VaultWarden ────────────────────────────────────────────────────────
# NOTE: VaultWarden requires a TLS secure context for its web vault.
# Access it at http://localhost:8080 (localhost IS a secure context).
echo ""
echo "▶  VaultWarden…"
VW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${VAULTWARDEN_URL}/alive" 2>/dev/null || echo "000")
if [[ "$VW_STATUS" != "000" ]]; then
  ok "VaultWarden is alive (HTTP ${VW_STATUS})"
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

# ── 9. Uptime Kuma ────────────────────────────────────────────────────────
echo ""
echo "▶  Uptime Kuma…"
UK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: nexus-uptime.local" "${TRAEFIK_HTTP}" 2>/dev/null || echo "000")
if [[ "$UK_STATUS" != "000" ]]; then
  ok "Uptime Kuma responding (HTTP ${UK_STATUS}) → http://nexus-uptime.local"
else
  warn "Uptime Kuma not reachable — check: docker logs uptime_kuma"
fi

# ── 10. n8n health ────────────────────────────────────────────────────────
echo ""
echo "▶  n8n…"
N8N_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: nexus-n8n.local" "${TRAEFIK_HTTP}" 2>/dev/null || echo "000")
if [[ "$N8N_STATUS" != "000" && "$N8N_STATUS" != "502" && "$N8N_STATUS" != "503" ]]; then
  ok "n8n responding (HTTP ${N8N_STATUS}) → http://nexus-n8n.local"
else
  warn "n8n not reachable yet (HTTP ${N8N_STATUS}) — may still be starting"
  info "Wait 30 s and retry: curl -s -H 'Host: nexus-n8n.local' http://localhost -o /dev/null -w '%{http_code}'"
fi

# ── 11. WireGuard ─────────────────────────────────────────────────────────
echo ""
echo "▶  WireGuard…"
WG_STATUS=$(docker inspect --format='{{.State.Status}}' wireguard 2>/dev/null || echo "missing")
if [[ "$WG_STATUS" == "running" ]]; then
  ok "WireGuard container is running → http://nexus-vpn.local"
  info "Web UI password: set via WIREGUARD_PASS in .env (hash stored as WIREGUARD_PASSWORD_HASH)"
else
  warn "WireGuard status: ${WG_STATUS}"
  if ! lsmod 2>/dev/null | grep -q wireguard; then
    info "WireGuard kernel module not loaded — try: sudo modprobe wireguard"
  fi
  if [[ ! -c /dev/net/tun ]]; then
    info "/dev/net/tun not found — try: sudo modprobe tun"
  fi
  info "Check logs: docker logs wireguard"
fi

# ── 12. Traefik ───────────────────────────────────────────────────────────
echo ""
echo "▶  Traefik…"
TK=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:80" 2>/dev/null || echo "000")
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
info "Tip: sudo ./scripts/register-local-hosts.sh add  (if .local URLs don't resolve)"
