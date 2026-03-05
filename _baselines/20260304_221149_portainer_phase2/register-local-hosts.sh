#!/usr/bin/env bash
# =============================================================================
# NEXUS Local Hosts Registration
# Adds / removes / lists local *.local DNS entries in /etc/hosts so that all
# NEXUS services are reachable by name in your browser at http://<name>.local
#
# Usage:
#   sudo ./scripts/register-local-hosts.sh add      # add all entries
#   sudo ./scripts/register-local-hosts.sh remove   # remove all entries
#   sudo ./scripts/register-local-hosts.sh status   # list current entries
#   sudo ./scripts/register-local-hosts.sh          # same as "add"
#
# After running "add", open your browser and navigate to:
#   http://nexus-app.local          → NEXUS e-commerce app
#   http://nexus-grafana.local      → Grafana dashboards
#   http://nexus-prometheus.local   → Prometheus metrics
#   http://nexus-loki.local         → Loki log explorer
#   http://nexus-vaultwarden.local  → VaultWarden (Bitwarden) password manager
#   http://nexus-n8n.local          → n8n workflow automation
#   http://nexus-uptime.local       → Uptime Kuma monitoring
#   http://nexus-vpn.local          → WireGuard VPN admin (wg-easy)
#   http://nexus-traefik.local      → Traefik reverse-proxy dashboard
# =============================================================================
set -euo pipefail

HOSTS_FILE="/etc/hosts"
MARKER_START="# BEGIN NEXUS LOCAL"
MARKER_END="# END NEXUS LOCAL"

# ── Hosts map ─────────────────────────────────────────────────────────────────
# Format: "hostname description"
# VaultWarden is NOT in this list — it uses http://localhost:8080 directly.
# The web vault requires a TLS secure context; .local hostnames don't qualify.
declare -a NEXUS_HOSTS=(
  "nexus-app.local          NEXUS e-commerce app"
  "nexus-grafana.local      Grafana dashboards"
  "nexus-prometheus.local   Prometheus metrics"
  "nexus-loki.local         Loki log explorer"
  "nexus-n8n.local          n8n workflow automation"
  "nexus-portainer.local    Portainer container management"
  "nexus-uptime.local       Uptime Kuma monitoring"
  "nexus-vpn.local          WireGuard VPN admin"
  "nexus-traefik.local      Traefik reverse-proxy dashboard"
  "nexus-npm.local          Nginx Proxy Manager (SSL certs)"
  "nexus-vaultwarden.local  VaultWarden (redirects to localhost:8080)"
  "nexus-crowdsec.local     CrowdSec Security API"
  "nexus-falco.local        Falco Runtime Security"
)

LOCAL_IP="127.0.0.1"

# ── Colours ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
fail() { echo -e "${RED}[✗]${NC} $*"; exit 1; }
info() { echo -e "${CYAN}[i]${NC} $*"; }

# ── Require root ──────────────────────────────────────────────────────────────
if [[ "$(id -u)" -ne 0 ]]; then
  fail "This script must be run as root (use: sudo $0 $*)"
fi

# ── Helpers ───────────────────────────────────────────────────────────────────
remove_block() {
  # Remove everything between the markers (inclusive)
  if grep -q "$MARKER_START" "$HOSTS_FILE" 2>/dev/null; then
    sed -i "/$MARKER_START/,/$MARKER_END/d" "$HOSTS_FILE"
    ok "Removed existing NEXUS entries from $HOSTS_FILE"
  fi
}

add_block() {
  {
    echo ""
    echo "$MARKER_START"
    for entry in "${NEXUS_HOSTS[@]}"; do
      hostname=$(echo "$entry" | awk '{print $1}')
      description=$(echo "$entry" | cut -d' ' -f2-)
      printf "%-16s %s  # %s\n" "$LOCAL_IP" "$hostname" "$description"
    done
    echo "$MARKER_END"
  } >> "$HOSTS_FILE"
  ok "Added ${#NEXUS_HOSTS[@]} NEXUS entries to $HOSTS_FILE"
}

show_status() {
  echo ""
  echo "═══════════════════════════════════════════════════════"
  echo "  NEXUS Local Service URLs"
  echo "═══════════════════════════════════════════════════════"
  for entry in "${NEXUS_HOSTS[@]}"; do
    hostname=$(echo "$entry" | awk '{print $1}')
    description=$(echo "$entry" | cut -d' ' -f2-)
    in_hosts="no"
    if grep -q "$hostname" "$HOSTS_FILE" 2>/dev/null; then
      in_hosts="yes"
    fi
    printf "  %-34s %s  [hosts: %s]\n" "http://${hostname}" "$description" "$in_hosts"
  done
  # VaultWarden is special — always localhost:8080
  printf "  %-34s %s\n" "http://localhost:8080" "VaultWarden (secure context: localhost)"
  echo "═══════════════════════════════════════════════════════"
  echo ""
}

# ── Main ──────────────────────────────────────────────────────────────────────
CMD="${1:-add}"

case "$CMD" in
  add)
    echo ""
    echo "Adding NEXUS local host entries to $HOSTS_FILE..."
    remove_block
    add_block
    show_status
    info "Traefik must be running (docker compose up -d) for URLs to work"
    ;;
  remove)
    echo ""
    echo "Removing NEXUS local host entries from $HOSTS_FILE..."
    remove_block
    ok "Done — all NEXUS .local entries removed"
    ;;
  status)
    show_status
    ;;
  *)
    echo "Usage: sudo $0 [add|remove|status]"
    exit 1
    ;;
esac
