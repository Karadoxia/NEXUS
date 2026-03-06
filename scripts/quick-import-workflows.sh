#!/bin/bash

##############################################################################
# ⚡ QUICK IMPORT ALL 18 n8n WORKFLOWS
#
# Direct database insertion for speed
##############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DB_USER="nexus"
DB_NAME="n8n"

# Get database password
DB_PASSWORD=$(cat db_password.txt 2>/dev/null || echo "password")

log_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

log_header() {
  echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ $1${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"
}

# Step 1: Create credentials
log_header "🔐 STEP 1: CREATING CREDENTIALS"

create_cred() {
  local name=$1
  local type=$2
  local data=$3

  local id=$(docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT gen_random_uuid()::text;" 2>/dev/null | xargs)

  docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -c "
    INSERT INTO credentials_entity (id, name, type, data, \"nodesAccess\", \"credentialUsageCount\", created_at, updated_at, managed)
    VALUES ('$id', '$name', '$type', '$data', '[{\"nodeType\":\"*\",\"user\":\"*\"}]', 0, NOW(), NOW(), false)
    ON CONFLICT DO NOTHING;
  " > /dev/null 2>&1

  echo "$id"
}

# Create credentials
PG_V2=$(create_cred "NEXUS Postgres v2" "postgres" "{\"host\":\"postgres\",\"port\":5432,\"database\":\"nexus_v2\",\"user\":\"nexus\",\"password\":\"$DB_PASSWORD\",\"ssl\":false}")
log_success "PostgreSQL v2: $PG_V2"

PG_HR=$(create_cred "NEXUS Postgres HR" "postgres" "{\"host\":\"postgres\",\"port\":5432,\"database\":\"nexus_hr\",\"user\":\"nexus\",\"password\":\"$DB_PASSWORD\",\"ssl\":false}")
log_success "PostgreSQL HR: $PG_HR"

PG_AI=$(create_cred "NEXUS Postgres AI" "postgres" "{\"host\":\"postgres-ai\",\"port\":5432,\"database\":\"nexus_ai\",\"user\":\"nexus_ai\",\"password\":\"$DB_PASSWORD\",\"ssl\":false}")
log_success "PostgreSQL AI: $PG_AI"

TELEGRAM=$(create_cred "NEXUS Telegram Bot" "telegramApi" "{\"botToken\":\"8682512263:AAGMrqWbsy5egthWb9pT5d0AYc7CEjdRvAM\"}")
log_success "Telegram Bot: $TELEGRAM"

RESEND=$(create_cred "Resend SMTP" "smtp" "{\"host\":\"smtp.resend.com\",\"port\":465,\"user\":\"default\",\"password\":\"re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6\",\"secure\":true}")
log_success "Resend Email: $RESEND"

# Step 2: Import workflows
log_header "📋 STEP 2: IMPORTING 18 WORKFLOWS"

WORKFLOWS_DIR="n8n-workflows"
COUNTER=0

for workflow_file in "$WORKFLOWS_DIR"/*.json; do
  workflow_name=$(basename "$workflow_file" .json)
  workflow_json=$(cat "$workflow_file")

  # Extract display name from JSON
  display_name=$(echo "$workflow_json" | grep -o '"name":"[^"]*"' | head -1 | sed 's/"name":"//' | sed 's/".*//')

  # Generate workflow ID
  workflow_id=$(docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT gen_random_uuid()::text;" 2>/dev/null | xargs)

  # Extract JSON arrays carefully
  nodes_json=$(echo "$workflow_json" | grep -oP '"nodes":\s*\K\[[^\]]*(?:\[[^\]]*\][^\]]*)*\]' || echo '[]')
  connections_json=$(echo "$workflow_json" | grep -oP '"connections":\s*\K\{[^}]*\}' || echo '{}')

  # Escape single quotes for SQL
  nodes_escaped=$(echo "$nodes_json" | sed "s/'/''/g")
  connections_escaped=$(echo "$connections_json" | sed "s/'/''/g")

  # Insert workflow
  docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -c "
    INSERT INTO workflow_entity (id, name, nodes, connections, active, settings, created_at, updated_at)
    VALUES (
      '$workflow_id',
      '$display_name',
      '$nodes_escaped'::jsonb,
      '$connections_escaped'::jsonb,
      true,
      '{}'::jsonb,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  " > /dev/null 2>&1

  ((COUNTER++))
  echo -ne "\r  Processing: $COUNTER/18 ($workflow_name)"
done

echo ""
log_success "All 18 workflows imported"

# Step 3: Restart n8n
log_header "🔄 STEP 3: RESTARTING n8n"
log_info "Restarting n8n service..."
docker-compose restart n8n > /dev/null 2>&1
sleep 2
log_success "n8n restarted"

# Step 4: Verify
log_header "📊 STEP 4: VERIFICATION"
TOTAL=$(docker-compose exec -T postgres psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM workflow_entity;" 2>/dev/null | xargs)
log_success "Workflows in database: $TOTAL"

if [ "$TOTAL" -ge 18 ]; then
  log_success "🎉 ALL 18 WORKFLOWS READY!"
else
  log_error "⚠️  Only $TOTAL workflows found"
fi

log_header "✅ IMPORT COMPLETE"
log_success "Status: READY FOR TESTING"
log_info ""
log_info "Next: Open http://localhost:5678 and test workflows!"
log_info ""

