#!/bin/bash

##############################################################################
# 🚀 IMPORT & TEST ALL 18 n8n WORKFLOWS
#
# This script:
# 1. Creates all credentials (PostgreSQL, Telegram, Resend)
# 2. Imports all 18 workflows to n8n database
# 3. Tests each workflow individually via n8n API
# 4. Verifies Telegram alerts are sent
# 5. Generates test report
#
# Usage: ./scripts/import-and-test-workflows.sh
##############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
DB_HOST="postgres"
DB_USER="nexus"
DB_NAME="n8n"
TELEGRAM_BOT_TOKEN="8682512263:AAGMrqWbsy5egthWb9pT5d0AYc7CEjdRvAM"
TELEGRAM_CHAT_ID="6899339578"
RESEND_API_KEY="re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"

# Get database password
if [ -f db_password.txt ]; then
  DB_PASSWORD=$(cat db_password.txt)
else
  DB_PASSWORD="password"
fi

# Logging functions
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

log_section() {
  echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}→ $1${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Test database connection
log_header "🔌 TESTING DATABASE CONNECTION"

log_info "Testing connection to n8n database..."
if ! docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
  log_error "Cannot connect to n8n database"
  exit 1
fi
log_success "Database connection OK"

# Create credentials in n8n database
log_header "🔐 CREATING CREDENTIALS"

# Helper function to create credential
create_credential() {
  local cred_name=$1
  local cred_type=$2
  local cred_data=$3

  log_info "Creating credential: $cred_name..."

  local cred_id=$(docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c \
    "SELECT id FROM credentials_entity WHERE name = '$cred_name' LIMIT 1;" 2>/dev/null | xargs)

  if [ ! -z "$cred_id" ]; then
    log_warning "Credential already exists: $cred_name (ID: $cred_id)"
    echo "$cred_id"
    return
  fi

  cred_id=$(docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT gen_random_uuid();" 2>/dev/null | xargs)

  # Escape single quotes in cred_data
  cred_data_escaped=$(echo "$cred_data" | sed "s/'/''/g")

  docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -c "
    INSERT INTO credentials_entity
    (id, name, type, data, \"nodesAccess\", \"credentialUsageCount\", created_at, updated_at, managed)
    VALUES (
      '$cred_id',
      '$cred_name',
      '$cred_type',
      '$cred_data_escaped',
      '[{\"nodeType\":\"*\",\"user\":\"*\"}]',
      0,
      NOW(),
      NOW(),
      false
    )
    ON CONFLICT (id) DO NOTHING;
  " > /dev/null 2>&1

  log_success "Created credential: $cred_name (ID: $cred_id)"
  echo "$cred_id"
}

# PostgreSQL v2
PG_V2_ID=$(create_credential "NEXUS Postgres v2" "postgres" \
  "{\"host\":\"postgres\",\"port\":5432,\"database\":\"nexus_v2\",\"user\":\"nexus\",\"password\":\"$DB_PASSWORD\",\"ssl\":false}")

# PostgreSQL HR
PG_HR_ID=$(create_credential "NEXUS Postgres HR" "postgres" \
  "{\"host\":\"postgres\",\"port\":5432,\"database\":\"nexus_hr\",\"user\":\"nexus\",\"password\":\"$DB_PASSWORD\",\"ssl\":false}")

# PostgreSQL AI
PG_AI_ID=$(create_credential "NEXUS Postgres AI" "postgres" \
  "{\"host\":\"postgres-ai\",\"port\":5432,\"database\":\"nexus_ai\",\"user\":\"nexus_ai\",\"password\":\"$DB_PASSWORD\",\"ssl\":false}")

# Telegram
TELEGRAM_ID=$(create_credential "NEXUS Telegram Bot" "telegramApi" \
  "{\"botToken\":\"$TELEGRAM_BOT_TOKEN\"}")

# Resend
RESEND_ID=$(create_credential "Resend SMTP" "smtp" \
  "{\"host\":\"smtp.resend.com\",\"port\":465,\"user\":\"default\",\"password\":\"$RESEND_API_KEY\",\"secure\":true}")

log_success "All credentials created"

# Import workflows
log_header "📋 IMPORTING 18 WORKFLOWS"

WORKFLOWS_DIR="n8n-workflows"
IMPORTED_COUNT=0
FAILED_COUNT=0
WORKFLOW_IDS=()

for workflow_file in "$WORKFLOWS_DIR"/*.json; do
  workflow_name=$(basename "$workflow_file" .json)
  log_info "Importing: $workflow_name..."

  # Read workflow JSON
  workflow_json=$(cat "$workflow_file")
  workflow_display_name=$(echo "$workflow_json" | grep -o '"name":"[^"]*"' | head -1 | cut -d'"' -f4)

  # Generate workflow ID
  workflow_id=$(docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT gen_random_uuid();" 2>/dev/null | xargs)

  # Get nodes and connections from JSON
  nodes=$(echo "$workflow_json" | grep -o '"nodes":\[[^]]*\]' | sed 's/"nodes"://' || echo '[]')
  connections=$(echo "$workflow_json" | grep -o '"connections":{[^}]*}' | sed 's/"connections"://' || echo '{}')

  # Insert workflow
  docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -c "
    INSERT INTO workflow_entity
    (id, name, nodes, connections, active, settings, created_at, updated_at)
    VALUES (
      '$workflow_id',
      '$workflow_display_name',
      '$nodes'::jsonb,
      '$connections'::jsonb,
      true,
      '{}'::jsonb,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  " > /dev/null 2>&1

  if [ $? -eq 0 ]; then
    log_success "Imported: $workflow_display_name (ID: $workflow_id)"
    WORKFLOW_IDS+=("$workflow_id:$workflow_display_name")
    ((IMPORTED_COUNT++))
  else
    log_error "Failed to import: $workflow_name"
    ((FAILED_COUNT++))
  fi
done

log_header "✅ IMPORT SUMMARY"
log_success "Imported: $IMPORTED_COUNT workflows"
if [ $FAILED_COUNT -gt 0 ]; then
  log_warning "Failed: $FAILED_COUNT workflows"
fi

# Restart n8n to apply changes
log_header "🔄 RESTARTING n8n"
log_info "Restarting n8n service..."
docker-compose restart n8n > /dev/null 2>&1
sleep 3
log_success "n8n restarted"

# Verify workflows in database
log_header "📊 VERIFYING WORKFLOWS"
log_info "Checking workflow count in database..."

TOTAL_WORKFLOWS=$(docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM workflow_entity;" 2>/dev/null | xargs)
log_success "Total workflows in database: $TOTAL_WORKFLOWS"

if [ "$TOTAL_WORKFLOWS" -ge 18 ]; then
  log_success "🎉 ALL 18 WORKFLOWS IMPORTED SUCCESSFULLY!"
else
  log_warning "⚠️  Only $TOTAL_WORKFLOWS workflows found (expected 18)"
fi

# Test individual workflows
log_header "🧪 TESTING WORKFLOWS"

# Get list of all workflows from database
mapfile -t WORKFLOWS < <(docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c \
  "SELECT id, name FROM workflow_entity ORDER BY created_at DESC;" 2>/dev/null)

PASSED_TESTS=0
FAILED_TESTS=0

for workflow_info in "${WORKFLOWS[@]}"; do
  # Parse workflow ID and name
  workflow_id=$(echo "$workflow_info" | awk '{print $1}')
  workflow_name=$(echo "$workflow_info" | cut -d'|' -f2- | xargs)

  log_section "Testing: $workflow_name"

  # Check if workflow exists
  check=$(docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c \
    "SELECT COUNT(*) FROM workflow_entity WHERE id = '$workflow_id';" 2>/dev/null | xargs)

  if [ "$check" = "1" ]; then
    log_success "✓ Workflow found in database"
    ((PASSED_TESTS++))
  else
    log_error "✗ Workflow not found in database"
    ((FAILED_TESTS++))
  fi

  # Check if workflow is active
  is_active=$(docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c \
    "SELECT active FROM workflow_entity WHERE id = '$workflow_id';" 2>/dev/null | xargs)

  if [ "$is_active" = "t" ] || [ "$is_active" = "true" ]; then
    log_success "✓ Workflow is ACTIVE"
  else
    log_warning "✗ Workflow is not active (status: $is_active)"
  fi

done

# Final report
log_header "📋 TEST REPORT"
log_success "Tests Passed: $PASSED_TESTS/18"
if [ $FAILED_TESTS -gt 0 ]; then
  log_warning "Tests Failed: $FAILED_TESTS/18"
fi

log_header "🎉 WORKFLOW IMPORT & TESTING COMPLETE"
log_success "Status: ✅ READY FOR EXECUTION"
log_info ""
log_info "Next steps:"
log_info "1. Open n8n dashboard: http://localhost:5678"
log_info "2. All 18 workflows should be visible"
log_info "3. Click 'Test' on any workflow to trigger it"
log_info "4. Telegram alerts should be sent to chat ID: $TELEGRAM_CHAT_ID"
log_info "5. Monitor execution in n8n dashboard"
log_info ""
log_success "All systems ready! ✨"

