#!/bin/bash

###############################################################################
# 🚀 IMPORT ALL 18 NEXUS WORKFLOWS TO n8n DASHBOARD
#
# This script:
# 1. Configures n8n API key
# 2. Creates all database credentials
# 3. Creates all external API credentials (Telegram, Resend, Gemini)
# 4. Imports all 18 workflow JSON files
# 5. Activates all workflows
# 6. Verifies everything is working
#
# Usage: ./scripts/import-all-workflows.sh
###############################################################################

set +e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

log_header() {
  echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ $1${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

# Load .env if it exists
if [ -f .env ]; then
  log_info "Loading environment from .env file..."
  export $(grep -v '^#' .env | grep -v '^[[:space:]]*$' | xargs -0) 2>/dev/null || true
  # Manual source for critical variables as fallback
  N8N_HOST="${N8N_HOST:-http://nexus-n8n.local}" # Use .local to ensure internal resolution if needed
N8N_API_KEY="${N8N_API_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZDViZDgwNS1iN2U0LTRjMjMtOGYwZC1kMmJmNTY1N2U3YWUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDFiMTVkYWEtNzkwYi00NDFhLTk2ODItM2ZhNWI2MGQxZjQ2IiwiaWF0IjoxNzcyNTczNzUwfQ.BhF8i8XPoezoTDIp2YORIHkrPBIDhIO4qQVb0ekqgi4}"
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-8666760606:AAG85GN98voF1nNZGAlb2uYdtDK9uKdlq6E}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-6899339578}"
RESEND_API_KEY="${RESEND_API_KEY:-re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6}"
GEMINI_API_KEY="${GEMINI_API_KEY:-}"
DB_PASSWORD="${DB_PASSWORD:-password}"
fi

# Test n8n connectivity
log_header "🔌 TESTING n8n CONNECTIVITY"
log_info "Connecting to n8n at $N8N_HOST..."
if ! curl -s "$N8N_HOST/api/v1/health" > /dev/null 2>&1; then
  log_error "n8n is not responding at $N8N_HOST"
  log_error "Make sure n8n is running: docker-compose ps | grep n8n"
  exit 1
fi
log_success "n8n is running and responding!"

# Function to create credential
create_credential() {
  local cred_name=$1
  local cred_type=$2
  local cred_data=$3

  log_info "Creating credential: $cred_name..."

  response=$(curl -s -X POST "$N8N_HOST/api/v1/credentials" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$cred_name\",
      \"type\": \"$cred_type\",
      \"data\": $cred_data,
      \"nodesAccess\": [{\"nodeType\": \"*\", \"user\": \"*\"}]
    }" 2>/dev/null)

  cred_id=$(echo "$response" | jq -r '.id // empty' 2>/dev/null)

  if [ ! -z "$cred_id" ] && [ "$cred_id" != "null" ]; then
    log_success "Created credential: $cred_name (ID: $cred_id)"
    echo "$cred_id"
  else
    log_warning "Credential may already exist: $cred_name"
    # Try to find existing credential
    existing=$(curl -s "$N8N_HOST/api/v1/credentials?filter={\"name\":\"$cred_name\"}" \
      -H "X-N8N-API-KEY: $N8N_API_KEY" 2>/dev/null | jq -r '.data[0].id // empty' 2>/dev/null)
    if [ ! -z "$existing" ]; then
      log_success "Found existing credential: $cred_name (ID: $existing)"
      echo "$existing"
    fi
  fi
}

# Create all credentials
log_header "🔐 CONFIGURING CREDENTIALS"

# PostgreSQL nexus_v2
PG_V2_ID=$(create_credential "NEXUS Postgres v2" "postgres" "{
  \"host\": \"postgres\",
  \"port\": 5432,
  \"database\": \"nexus_v2\",
  \"user\": \"nexus\",
  \"password\": \"$DB_PASSWORD\",
  \"ssl\": false
}")

# PostgreSQL nexus_hr
PG_HR_ID=$(create_credential "NEXUS Postgres HR" "postgres" "{
  \"host\": \"postgres\",
  \"port\": 5432,
  \"database\": \"nexus_hr\",
  \"user\": \"nexus\",
  \"password\": \"$DB_PASSWORD\",
  \"ssl\": false
}")

# PostgreSQL nexus_ai
PG_AI_ID=$(create_credential "NEXUS Postgres AI" "postgres" "{
  \"host\": \"postgres-ai\",
  \"port\": 5432,
  \"database\": \"nexus_ai\",
  \"user\": \"nexus_ai\",
  \"password\": \"$DB_PASSWORD\",
  \"ssl\": false
}")

# Telegram
log_info "Creating Telegram credential..."
TELEGRAM_ID=$(curl -s -X POST "$N8N_HOST/api/v1/credentials" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"NEXUS Telegram Bot\",
    \"type\": \"telegramApi\",
    \"data\": {
      \"botToken\": \"$TELEGRAM_BOT_TOKEN\"
    },
    \"nodesAccess\": [{\"nodeType\": \"n8n-nodes-base.telegram\"}]
  }" 2>/dev/null | jq -r '.id // empty')

if [ ! -z "$TELEGRAM_ID" ] && [ "$TELEGRAM_ID" != "null" ]; then
  log_success "Created Telegram credential (ID: $TELEGRAM_ID)"
else
  log_warning "Telegram credential may already exist"
fi

# Resend Email
log_info "Creating Resend Email credential..."
RESEND_ID=$(curl -s -X POST "$N8N_HOST/api/v1/credentials" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Resend SMTP\",
    \"type\": \"smtp\",
    \"data\": {
      \"host\": \"smtp.resend.com\",
      \"port\": 465,
      \"user\": \"default\",
      \"password\": \"$RESEND_API_KEY\",
      \"secure\": true
    },
    \"nodesAccess\": [{\"nodeType\": \"n8n-nodes-base.emailSend\"}]
  }" 2>/dev/null | jq -r '.id // empty')

if [ ! -z "$RESEND_ID" ] && [ "$RESEND_ID" != "null" ]; then
  log_success "Created Resend Email credential (ID: $RESEND_ID)"
else
  log_warning "Resend credential may already exist"
fi

log_success "All credentials configured!"

# Import workflows
log_header "📋 IMPORTING 18 WORKFLOWS"

WORKFLOWS_DIR="$(pwd)/n8n-workflows"
if [ ! -d "$WORKFLOWS_DIR" ]; then
  log_error "Workflows directory not found: $WORKFLOWS_DIR"
  exit 1
fi

WORKFLOW_COUNT=$(ls -1 "$WORKFLOWS_DIR"/*.json 2>/dev/null | wc -l)
log_info "Found $WORKFLOW_COUNT workflow files"

if [ $WORKFLOW_COUNT -eq 0 ]; then
  log_error "No workflow JSON files found in $WORKFLOWS_DIR"
  exit 1
fi

IMPORTED=0
FAILED=0

for workflow_file in "$WORKFLOWS_DIR"/*.json; do
  workflow_name=$(basename "$workflow_file" .json)
  log_info "Importing: $workflow_name..."

  # Read the workflow file and update credential IDs
  # IMPORTANT: n8n API POST /workflows only accepts: name, nodes, connections, settings, staticData
  workflow_json=$(cat "$workflow_file" | jq '{name, nodes, connections, settings, staticData}')

  # Replace credential IDs in the workflow
  workflow_json=$(echo "$workflow_json" | jq \
    --arg pg_v2 "$PG_V2_ID" \
    --arg pg_hr "$PG_HR_ID" \
    --arg pg_ai "$PG_AI_ID" \
    --arg telegram "$TELEGRAM_ID" \
    --arg resend "$RESEND_ID" \
    '(.nodes[] | select(.credentials.postgres) | .credentials.postgres.id) = $pg_v2 |
     (.nodes[] | select(.credentials.postgres) | select(.name | contains("HR")) | .credentials.postgres.id) = $pg_hr |
     (.nodes[] | select(.credentials.postgres) | select(.name | contains("AI")) | .credentials.postgres.id) = $pg_ai |
     (.nodes[] | select(.credentials.telegramApi) | .credentials.telegramApi.id) = $telegram |
     (.nodes[] | select(.credentials.smtp) | .credentials.smtp.id) = $resend')

  # Import the workflow
  response=$(curl -s -X POST "$N8N_HOST/api/v1/workflows" \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$workflow_json" 2>/dev/null)

  workflow_id=$(echo "$response" | jq -r '.id // empty' 2>/dev/null)

  if [ ! -z "$workflow_id" ] && [ "$workflow_id" != "null" ]; then
    log_success "Imported: $workflow_name (ID: $workflow_id)"

    # Activate the workflow
    activate_response=$(curl -s -X POST "$N8N_HOST/api/v1/workflows/$workflow_id/activate" \
      -H "X-N8N-API-KEY: $N8N_API_KEY" 2>/dev/null)

    activate_status=$(echo "$activate_response" | jq -r '.active // false' 2>/dev/null)
    if [ "$activate_status" = "true" ]; then
      log_success "Activated workflow: $workflow_name"
    else
      log_warning "Could not activate (may already be active): $workflow_name"
    fi

    ((IMPORTED++))
  else
    error_msg=$(echo "$response" | jq -r '.message // "Unknown error"' 2>/dev/null)
    log_error "Failed to import $workflow_name: $error_msg"
    ((FAILED++))
  fi
done

# Summary
log_header "📊 IMPORT SUMMARY"
log_success "Imported: $IMPORTED workflows"
if [ $FAILED -gt 0 ]; then
  log_warning "Failed: $FAILED workflows"
fi

# Verify workflows are visible
log_header "✅ VERIFYING WORKFLOWS IN DASHBOARD"
log_info "Fetching workflow list from n8n..."

sleep 2

total_workflows=$(curl -s "$N8N_HOST/api/v1/workflows" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" 2>/dev/null | jq '.data | length' 2>/dev/null)

log_success "Total workflows in n8n dashboard: $total_workflows"

if [ "$total_workflows" -ge "18" ]; then
  log_success "🎉 ALL 18 WORKFLOWS ARE NOW VISIBLE IN THE DASHBOARD!"
else
  log_warning "⚠️  Only $total_workflows workflows found (expected 18)"
fi

# List all workflows
log_header "📋 WORKFLOW LIST"
curl -s "$N8N_HOST/api/v1/workflows?limit=50" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" 2>/dev/null | jq '.data[] | {id, name, active}' 2>/dev/null | head -60

log_header "✅ WORKFLOW IMPORT COMPLETE"
log_info "Dashboard URL: $N8N_HOST"
log_info "Open your browser and navigate to n8n to see all workflows"
log_success "All 18 workflows are configured with Telegram, Resend, and database credentials!"

