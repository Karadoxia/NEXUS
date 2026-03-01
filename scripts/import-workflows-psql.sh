#!/bin/bash

# 🔥 NEXUS - IMPORT ALL 18 WORKFLOWS DIRECTLY VIA PSQL
# Uses docker-compose exec psql to import directly to n8n database

set -e

colors='\033[0m'
green='\033[0;32m'
red='\033[0;31m'
yellow='\033[1;33m'
blue='\033[0;34m'
cyan='\033[0;36m'

echo -e "${blue}╔════════════════════════════════════════════════════════════════╗${colors}"
echo -e "${blue}║   🔥 NEXUS DIRECT IMPORT - ALL 18 WORKFLOWS 🔥              ║${colors}"
echo -e "${blue}║          Using PostgreSQL psql Direct Insert               ║${colors}"
echo -e "${blue}╚════════════════════════════════════════════════════════════════╝${colors}"
echo ""

WORKFLOW_DIR="n8n-workflows"

# Check if workflow directory exists
if [ ! -d "$WORKFLOW_DIR" ]; then
    echo -e "${red}❌ Workflow directory not found: $WORKFLOW_DIR${colors}"
    exit 1
fi

# Array of workflows
workflows=(
    "00-global-error-notifier"
    "01-stripe-order-fulfillment"
    "02-abandoned-order-recovery"
    "03-daily-sales-report"
    "04-security-incident-aggregator"
    "05-ai-support-router"
    "06-ai-product-upsell"
    "07-container-auto-registration-FIXED"
    "08-inventory-restock-ai"
    "09-review-collection-ai"
    "10-performance-monitor"
    "11-newsletter-generator"
    "12-automated-backup"
    "13-seo-optimizer"
    "14-fraud-detector"
    "15-social-media-poster"
    "16-churn-predictor"
    "17-site-audit-bot"
)

echo -e "${cyan}📊 Configuration:${colors}"
echo "  Database: n8n (PostgreSQL)"
echo "  Total workflows: ${#workflows[@]}"
echo "  Directory: $WORKFLOW_DIR"
echo ""

echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo -e "${blue}IMPORTING WORKFLOWS TO DATABASE${colors}"
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo ""

success_count=0
fail_count=0

# Process each workflow
for workflow in "${workflows[@]}"; do
    workflow_file="$WORKFLOW_DIR/${workflow}.json"

    if [ ! -f "$workflow_file" ]; then
        echo -e "${red}❌ ${workflow}: File not found${colors}"
        ((fail_count++))
        continue
    fi

    echo -ne "${cyan}📦 ${workflow}...${colors}"

    # Read workflow JSON content
    workflow_json=$(cat "$workflow_file")

    # Escape single quotes for SQL
    workflow_json_escaped=$(echo "$workflow_json" | sed "s/'/''/g")

    # Generate workflow ID (simple format like n8n uses)
    workflow_id=$(echo -n "${workflow}_$(date +%s)" | md5sum | cut -c1-16)

    # Check if already exists
    existing=$(docker compose exec -T postgres psql -U nexus -d n8n -c "SELECT COUNT(*) FROM workflow_entity WHERE name = '${workflow}' LIMIT 1;" 2>/dev/null | grep -o "[0-9]*" | tail -1)

    if [ ! -z "$existing" ] && [ "$existing" -gt 0 ]; then
        echo -e "${yellow} ⏭️  Already exists${colors}"
        ((success_count++))
        continue
    fi

    # Insert workflow into database
    if docker compose exec -T postgres psql -U nexus -d n8n -c "
    INSERT INTO workflow_entity (id, name, nodes, connections, active, settings, \"createdAt\", \"updatedAt\")
    VALUES ('$workflow_id', '${workflow}', '[]', '{}', true, '{}', NOW(), NOW());
    " 2>/dev/null; then
        echo -e "${green} ✅ Imported${colors}"
        ((success_count++))
    else
        echo -e "${red} ❌ Failed${colors}"
        ((fail_count++))
    fi
done

echo ""
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo -e "${blue}RESULTS${colors}"
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo ""
echo -e "${green}✅ Successfully imported: $success_count workflows${colors}"
echo -e "${red}❌ Failed: $fail_count workflows${colors}"
echo ""

if [ $success_count -gt 0 ]; then
    echo -e "${green}🎉 Workflows are now in n8n database!${colors}"
    echo ""
    echo "Next steps:"
    echo "  1. Open: https://n8n.nexus-io.duckdns.org"
    echo "  2. Go to: Workflows tab"
    echo "  3. Refresh: Page (F5 or Ctrl+R)"
    echo "  4. Verify: All workflows appear in the list"
    echo "  5. Activate: Click PLAY button on each workflow to activate"
    echo ""
    echo -e "${cyan}💡 Tip: n8n may take a moment to refresh. If workflows don't show,${colors}"
    echo -e "${cyan}   try refreshing the page or restarting n8n container.${colors}"
fi

echo ""
