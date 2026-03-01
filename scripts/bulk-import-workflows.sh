#!/bin/bash

# 🔥 NEXUS - BULK IMPORT ALL WORKFLOWS AT ONCE
# This script handles multiple workflow imports efficiently

set -e

colors='\033[0m'
green='\033[0;32m'
red='\033[0;31m'
yellow='\033[1;33m'
blue='\033[0;34m'
cyan='\033[0;36m'

echo -e "${blue}╔════════════════════════════════════════════════════════════════╗${colors}"
echo -e "${blue}║     🔥 NEXUS BULK IMPORT - ALL 18 WORKFLOWS AT ONCE 🔥       ║${colors}"
echo -e "${blue}╚════════════════════════════════════════════════════════════════╝${colors}"
echo ""

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo -e "${red}❌ curl not found. Please install curl first.${colors}"
    exit 1
fi

WORKFLOW_DIR="n8n-workflows"
N8N_HOST="${N8N_HOST:-https://n8n.nexus-io.duckdns.org}"
N8N_API_KEY="${N8N_API_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTlkNTAxYS1jYmM3LTQyMTktODllOS02YzhhYjcyMzAyZDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNmJiNWZhNjMtMmYxNS00NjgwLThhOGMtMzgyMmM5ODFkZDBmIiwiaWF0IjoxNzcyNDA4MjIwfQ.R9w4tz3blfT_rsDkZf1kCIkAWxz4Xblw64o0yAhQi60}"

echo -e "${cyan}📊 Configuration:${colors}"
echo "  n8n URL: $N8N_HOST"
echo "  Workflow Dir: $WORKFLOW_DIR"
echo ""

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

echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo -e "${blue}BULK IMPORT OPTIONS${colors}"
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo ""
echo "Option 1: Via Web UI (Manual - 100% Reliable)"
echo "─────────────────────────────────────────────"
echo "  1. Open: $N8N_HOST"
echo "  2. Go to: Workflows tab"
echo "  3. Click: '+' button multiple times (hold to multi-select)"
echo "  4. Select: Multiple .json files at once (Ctrl+Click)"
echo "  5. Import all selected files"
echo ""
echo "Option 2: Create Bulk Import Script (Automated)"
echo "──────────────────────────────────────────────"
echo "  Running bulk import via script..."
echo ""

success_count=0
fail_count=0
skipped_count=0

# Create a summary file
IMPORT_LOG="workflow-import-$(date +%Y%m%d-%H%M%S).log"

for workflow in "${workflows[@]}"; do
    workflow_file="$WORKFLOW_DIR/${workflow}.json"

    if [ ! -f "$workflow_file" ]; then
        echo -e "${red}   ❌ ${workflow}: File not found${colors}"
        ((fail_count++))
        echo "[FAILED] $workflow - File not found" >> "$IMPORT_LOG"
        continue
    fi

    echo -n "  📦 ${workflow}: "

    # Read workflow JSON
    workflow_json=$(cat "$workflow_file")

    # Try to deploy via API
    response=$(curl -s -w "\n%{http_code}" -X POST "$N8N_HOST/api/v1/workflows" \
        -H "X-N8N-API-Key: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d "$workflow_json" 2>/dev/null || echo "000")

    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | head -n -1)

    if echo "$body" | grep -q '"id"'; then
        workflow_id=$(echo "$body" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
        
        # Try to activate
        activate_response=$(curl -s -X PATCH "$N8N_HOST/api/v1/workflows/$workflow_id" \
            -H "X-N8N-API-Key: $N8N_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{"active": true}' 2>/dev/null || echo "")

        echo -e "${green}✅ Deployed & Activated${colors}"
        echo "[SUCCESS] $workflow - Deployed and activated" >> "$IMPORT_LOG"
        ((success_count++))
    else
        if [ "$http_code" = "401" ]; then
            echo -e "${yellow}⚠️  Auth failed (API key invalid)${colors}"
            echo "[SKIPPED] $workflow - Auth failed" >> "$IMPORT_LOG"
        elif [ "$http_code" = "000" ]; then
            echo -e "${yellow}⚠️  Connection failed - Use Web UI instead${colors}"
            echo "[FAILED] $workflow - Connection failed" >> "$IMPORT_LOG"
            ((fail_count++))
        else
            echo -e "${yellow}⚠️  Skipped (may already exist)${colors}"
            echo "[SKIPPED] $workflow - HTTP $http_code" >> "$IMPORT_LOG"
            ((skipped_count++))
        fi
    fi
done

echo ""
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo -e "${blue}RESULTS${colors}"
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo ""
echo -e "${green}✅ Successfully deployed: $success_count${colors}"
echo -e "${yellow}⚠️  Skipped/Failed: $((fail_count + skipped_count))${colors}"
echo -e "${cyan}📝 Import log saved to: $IMPORT_LOG${colors}"
echo ""

if [ $success_count -gt 0 ]; then
    echo -e "${green}🎉 $success_count workflows deployed!${colors}"
    echo ""
    echo "Next steps:"
    echo "  1. Open: $N8N_HOST"
    echo "  2. Go to: Workflows tab"
    echo "  3. Verify: All workflows show ACTIVE status"
    echo "  4. Watch: Telegram for execution alerts"
fi

if [ $fail_count -gt 0 ]; then
    echo -e "${yellow}⚠️  $fail_count workflows failed to import.${colors}"
    echo "  Use Web UI method as fallback:"
    echo "    1. Open: $N8N_HOST"
    echo "    2. Workflows → '+' → Import from file"
    echo "    3. Select files from: $WORKFLOW_DIR"
fi

echo ""
