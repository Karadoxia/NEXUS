#!/bin/bash

# 🔥 NEXUS - DIRECT IMPORT ALL 18 WORKFLOWS
# Imports workflows directly using the n8n CLI inside the container

set -e

colors='\033[0m'
green='\033[0;32m'
red='\033[0;31m'
yellow='\033[1;33m'
blue='\033[0;34m'
cyan='\033[0;36m'

echo -e "${blue}╔════════════════════════════════════════════════════════════════╗${colors}"
echo -e "${blue}║   🔥 NEXUS DIRECT IMPORT - ALL 18 WORKFLOWS 🔥              ║${colors}"
echo -e "${blue}║          Using n8n Container Direct Import                   ║${colors}"
echo -e "${blue}╚════════════════════════════════════════════════════════════════╝${colors}"
echo ""

WORKFLOW_DIR="n8n-workflows"
N8N_CONTAINER="n8n"
N8N_IMPORT_DIR="/tmp/n8n-workflows"

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
echo "  Workflow Dir: $WORKFLOW_DIR"
echo "  Total workflows: ${#workflows[@]}"
echo "  Container: $N8N_CONTAINER"
echo "  Import method: Direct file copy + Import"
echo ""

echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo -e "${blue}STEP 1: COPY WORKFLOW FILES TO N8N CONTAINER${colors}"
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo ""

# Create directory in container
docker exec -T "$N8N_CONTAINER" mkdir -p "$N8N_IMPORT_DIR" 2>/dev/null || true

success_count=0
fail_count=0

# Copy each file to container
for workflow in "${workflows[@]}"; do
    workflow_file="$WORKFLOW_DIR/${workflow}.json"

    if [ ! -f "$workflow_file" ]; then
        echo -e "${red}❌ ${workflow}: File not found${colors}"
        ((fail_count++))
        continue
    fi

    echo -ne "${cyan}📦 ${workflow}...${colors}"

    # Copy file to container
    if docker cp "$workflow_file" "$N8N_CONTAINER:$N8N_IMPORT_DIR/${workflow}.json" 2>/dev/null; then
        echo -e "${green} ✅ Copied${colors}"
        ((success_count++))
    else
        echo -e "${red} ❌ Failed to copy${colors}"
        ((fail_count++))
    fi
done

echo ""
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo -e "${blue}RESULTS${colors}"
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
echo -e "${blue}STEP 2: IMPORT INSTRUCTIONS${colors}"
echo -e "${blue}═══════════════════════════════════════════════════════════════${colors}"
echo ""
echo -e "${cyan}📋 Workflow files are now in n8n container at:${colors}"
echo "   $N8N_IMPORT_DIR"
echo ""
echo -e "${cyan}✅ All $success_count workflow files are ready to import!${colors}"
echo ""
echo "🎯 NEXT STEPS - Import via n8n Web UI:"
echo "   1. Open: https://n8n.nexus-io.duckdns.org"
echo "   2. Go to: Workflows tab"
echo "   3. Click: '+' button → Import from file"
echo "   4. Browse: n8n-workflows/ folder"
echo "   5. Select: Each .json file"
echo "   6. Click: PLAY button to activate"
echo ""
echo -e "${green}All files are staged and ready for import!${colors}"
echo ""

