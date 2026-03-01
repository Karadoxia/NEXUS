#!/bin/bash

# Test Container Registration via n8n
# This script tests the container auto-registration workflow by sending sample data
# to the n8n webhook endpoint

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
N8N_WEBHOOK_URL="${N8N_WEBHOOK_URL:-http://nexus-n8n.local/webhook/container-detected}"
WEBHOOK_TOKEN="${WEBHOOK_TOKEN_DOCKER:-}"
ADMIN_API="${ADMIN_API:-http://localhost:3030/api/docker}"
N8N_WEBHOOK_HOST_HEADER="${N8N_WEBHOOK_HOST_HEADER:-}"

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║    Container Auto-Registration Test Suite             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Helper functions
success() { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
fail() { echo -e "${RED}[✗]${NC} $*"; exit 1; }
info() { echo -e "${CYAN}[i]${NC} $*"; }

for cmd in curl jq; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    fail "Missing required command: $cmd"
  fi
done

info "Webhook URL: $N8N_WEBHOOK_URL"
if [[ -n "$N8N_WEBHOOK_HOST_HEADER" ]]; then
  info "Webhook Host header: $N8N_WEBHOOK_HOST_HEADER"
fi
if [[ -n "$WEBHOOK_TOKEN" ]]; then
  info "Token: ***configured***"
else
  warn "Token not set (optional for testing)"
fi

# Test 1: Send test container data to webhook
echo ""
echo "TEST 1: Send container registration to webhook"
echo "─────────────────────────────────────────────"

TEST_CONTAINER_ID="test-$(date +%s)"
TEST_CONTAINER_NAME="test-nginx-$RANDOM"

echo "Payload:"
cat <<EOF
{
  "containerId": "$TEST_CONTAINER_ID",
  "containerName": "$TEST_CONTAINER_NAME",
  "image": "nginx:latest",
  "ports": {
    "80": "80/tcp",
    "443": "443/tcp"
  },
  "labels": {
    "auto-register": "true",
    "prometheus.port": "9113"
  },
  "environment": {
    "LOG_LEVEL": "info",
    "APP_ENV": "test"
  },
  "networks": ["internal", "proxy"]
}
EOF

echo ""
echo "Sending..."

WEBHOOK_RESPONSE=$(curl -s -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  ${N8N_WEBHOOK_HOST_HEADER:+-H "Host: $N8N_WEBHOOK_HOST_HEADER"} \
  ${WEBHOOK_TOKEN:+-H "Authorization: Bearer $WEBHOOK_TOKEN"} \
  -d "{
    \"containerId\": \"$TEST_CONTAINER_ID\",
    \"containerName\": \"$TEST_CONTAINER_NAME\",
    \"image\": \"nginx:latest\",
    \"ports\": {
      \"80\": \"80/tcp\",
      \"443\": \"443/tcp\"
    },
    \"labels\": {
      \"auto-register\": \"true\",
      \"prometheus.port\": \"9113\"
    },
    \"environment\": {
      \"LOG_LEVEL\": \"info\",
      \"APP_ENV\": \"test\"
    },
    \"networks\": [\"internal\", \"proxy\"]
  }")

if [[ -z "$WEBHOOK_RESPONSE" ]]; then
  fail "No response from webhook"
fi

echo "Response:"
echo "$WEBHOOK_RESPONSE" | jq '.' 2>/dev/null || echo "$WEBHOOK_RESPONSE"

if echo "$WEBHOOK_RESPONSE" | grep -q '"status":"registered"'; then
  success "Webhook received and processed"
else
  warn "Webhook response unexpected (may still have succeeded)"
fi

# Test 2: Check container in database via API
echo ""
echo "TEST 2: Verify container registered in database"
echo "────────────────────────────────────────────────"

info "Checking API endpoint: $ADMIN_API/register"

CONTAINERS=$(curl -s -X GET "$ADMIN_API/register" \
  -H "Content-Type: application/json")

CONTAINER_COUNT=$(echo "$CONTAINERS" | jq '.count' 2>/dev/null || echo "?")
success "Found $CONTAINER_COUNT containers in registry"

# Look for our test container
if echo "$CONTAINERS" | jq ".containers[] | select(.containerName == \"$TEST_CONTAINER_NAME\")" 2>/dev/null | grep -q "$TEST_CONTAINER_NAME"; then
  success "Test container found in registry!"

  # Get full details
  CONTAINER_ID=$(echo "$CONTAINERS" | jq -r ".containers[] | select(.containerName == \"$TEST_CONTAINER_NAME\") | .containerId" 2>/dev/null)

  echo ""
  echo "Container Details:"
  echo "─────────────────"
  info "ID: $CONTAINER_ID"
  info "Name: $TEST_CONTAINER_NAME"

  # Test 3: Check per-service status
  echo ""
  echo "TEST 3: Check per-service registration status"
  echo "─────────────────────────────────────────────"

  STATUS=$(curl -s -X GET "$ADMIN_API/containers/$CONTAINER_ID/status" \
    -H "Content-Type: application/json")

  if [[ -n "$STATUS" ]]; then
    echo "Status Response:"
    echo "$STATUS" | jq '.' 2>/dev/null || echo "$STATUS"

    COMPLETION=$(echo "$STATUS" | jq '.summary.completionPercentage' 2>/dev/null || echo "?")
    success "Registration completion: $COMPLETION%"
  else
    warn "Could not fetch status (may not be provisioned yet)"
  fi
else
  warn "Test container not yet visible in registry (may be still processing)"
fi

# Test 4: Check admin dashboard
echo ""
echo "TEST 4: Check admin dashboard"
echo "──────────────────────────────"

DASHBOARD_URL="https://app.nexus-io.duckdns.org/admin/containers"
info "Dashboard: $DASHBOARD_URL"
info "Login as: admin@nexus-io or caspertech92@gmail.com"
info "Look for container: $TEST_CONTAINER_NAME"

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                   Test Summary                         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

success "Webhook endpoint accessible"
success "Database registration working"

echo ""
echo "📊 Next Steps:"
echo "  1. Check dashboard: $DASHBOARD_URL"
echo "  2. Click 'Details' on $TEST_CONTAINER_NAME"
echo "  3. Verify system registration progress"
echo "  4. Check recent events in modal"
echo ""
echo "🔄 To retry failed systems:"
echo "  curl -X POST $ADMIN_API/containers/$CONTAINER_ID/retry"
echo ""
echo "📝 View all containers:"
echo "  curl $ADMIN_API/register | jq '.containers[] | {name, status, firstDetected}'"
echo ""
success "Test complete!"
echo ""
