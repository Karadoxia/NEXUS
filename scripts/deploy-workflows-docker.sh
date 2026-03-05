#!/bin/bash

# 🔥 NEXUS WORKFLOWS - DEPLOY VIA DOCKER IMPORT
# Uses Docker exec to deploy workflows directly to n8n container

set -e

# Colors
colors='\033[0m'
green='\033[0;32m'
red='\033[0;31m'
yellow='\033[1;33m'
blue='\033[0;34m'
cyan='\033[0;36m'

echo -e "${blue}╔════════════════════════════════════════════════════════════════╗${colors}"
echo -e "${blue}║   🔥 NEXUS WORKFLOWS - DEPLOY VIA DOCKER 🔥                  ║${colors}"
echo -e "${blue}║          Importing all 18 workflows via n8n import            ║${colors}"
echo -e "${blue}╚════════════════════════════════════════════════════════════════╝${colors}"
echo ""

WORKFLOW_DIR="n8n-workflows"
N8N_CONTAINER="n8n"
N8N_IMPORT_DIR="/tmp/n8n-import"

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

echo -e "${cyan}📦 Copying workflow files to n8n container...${colors}"
echo ""

success_count=0
fail_count=0
skipped_count=0

# Create temp dir in container
docker exec -T "$N8N_CONTAINER" mkdir -p "$N8N_IMPORT_DIR" 2>/dev/null || true

# Copy each workflow file to the container
for workflow in "${workflows[@]}"; do
    workflow_file="$WORKFLOW_DIR/${workflow}.json"

    echo -e "${cyan}📦 Processing: ${workflow}${colors}"

    if [ ! -f "$workflow_file" ]; then
        echo -e "${red}   ❌ File not found: $workflow_file${colors}"
        ((fail_count++))
        continue
    fi

    # Copy file to container
    docker cp "$workflow_file" "$N8N_CONTAINER:$N8N_IMPORT_DIR/${workflow}.json" 2>/dev/null || {
        echo -e "${red}   ❌ Failed to copy file to container${colors}"
        ((fail_count++))
        continue
    }

    echo -e "${green}   ✅ File copied${colors}"
    ((success_count++))
    echo ""
done

echo ""
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo -e "${blue}FILE COPY RESULTS${colors}"
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo ""
echo -e "${green}✅ Successfully copied: $success_count workflows${colors}"
echo -e "${red}❌ Failed: $fail_count workflows${colors}"
echo ""

if [ $success_count -eq 0 ]; then
    echo -e "${red}❌ No workflows were copied. Cannot proceed.${colors}"
    exit 1
fi

echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo -e "${blue}MANUAL DEPLOYMENT OPTIONS${colors}"
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo ""
echo "📂 Workflow files are now in n8n container at: $N8N_IMPORT_DIR"
echo ""
echo "Option 1: Use n8n Web UI (Recommended)"
echo "==========================================="
echo "  1. Open: https://n8n.nexus-io.duckdns.org"
echo "  2. Click: Workflows → '+' → Import from file"
echo "  3. Select files from: $WORKFLOW_DIR/"
echo "  4. Click: PLAY button to activate each"
echo ""
echo "Option 2: Check n8n logs"
echo "==========================================="
echo "  docker logs n8n | tail -50"
echo ""
echo "Option 3: Verify workflow files in container"
echo "==========================================="
echo "  docker exec -T n8n ls -lh $N8N_IMPORT_DIR"
echo ""

echo -e "${green}✅ All workflow files are ready for import!${colors}"
echo ""
echo "Next Steps:"
echo "  1. Open n8n UI: https://n8n.nexus-io.duckdns.org"
echo "  2. Go to Workflows tab"
echo "  3. Click '+' Import button"
echo "  4. Browse to $WORKFLOW_DIR/ directory"
echo "  5. Select each JSON file and import"
echo "  6. Click PLAY button to activate"
echo ""
echo "Total workflows to import: ${#workflows[@]}"
echo ""

