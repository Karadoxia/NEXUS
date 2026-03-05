#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  n8n Workflow Delete & Re-import Script                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if N8N_API_KEY is set
if [ -z "$N8N_API_KEY" ]; then
  echo -e "${YELLOW}⚠️  N8N_API_KEY not set in environment${NC}"
  echo -e "${YELLOW}Please set it with: export N8N_API_KEY='your_api_key'${NC}"
  exit 1
fi

if [ -z "$N8N_URL" ]; then
  N8N_URL="https://n8n.nexus-io.duckdns.org"
fi

echo -e "${BLUE}Configuration:${NC}"
echo "  N8N URL: $N8N_URL"
echo "  API Key: ${N8N_API_KEY:0:20}..."
echo ""

# Workflows to update
WORKFLOWS=(
  "01-stripe-order-fulfillment"
  "02-abandoned-order-recovery"
  "05-ai-support-router"
  "06-ai-product-upsell"
  "08-inventory-restock-ai"
  "09-review-collection-ai"
  "10-performance-monitor"
  "13-seo-optimizer"
  "15-social-media-poster"
  "16-churn-predictor"
  "17-site-audit-bot"
)

echo -e "${YELLOW}Step 1: Fetching existing workflows from n8n...${NC}"
echo ""

# Get all workflows
RESPONSE=$(curl -s "$N8N_URL/rest/workflows" \
  -H "X-N8N-API-KEY: $N8N_API_KEY")

echo "$RESPONSE" | jq '.' > /tmp/all_workflows.json

# Parse workflow IDs and names
echo -e "${BLUE}Found workflows in n8n:${NC}"
echo "$RESPONSE" | jq -r '.data[] | "\(.id) - \(.name)"' | head -20

echo ""
echo -e "${YELLOW}Step 2: Deleting old AI workflows...${NC}"
echo ""

# Workflows to delete (by name pattern)
DELETE_PATTERNS=(
  "Stripe Order Fulfillment"
  "Abandoned Order Recovery"
  "AI Support Router"
  "AI Product Upsell"
  "Inventory Restock"
  "Review Collection"
  "Performance Monitor"
  "SEO Optimizer"
  "Social Media Poster"
  "Churn Predictor"
  "Site Audit Bot"
)

DELETED_COUNT=0

for pattern in "${DELETE_PATTERNS[@]}"; do
  WORKFLOW_ID=$(echo "$RESPONSE" | jq -r ".data[] | select(.name | contains(\"$pattern\")) | .id" | head -1)
  
  if [ ! -z "$WORKFLOW_ID" ]; then
    echo -n "  Deleting: $pattern (ID: $WORKFLOW_ID)... "
    
    DELETE_RESPONSE=$(curl -s -X DELETE "$N8N_URL/rest/workflows/$WORKFLOW_ID" \
      -H "X-N8N-API-KEY: $N8N_API_KEY")
    
    if echo "$DELETE_RESPONSE" | jq . > /dev/null 2>&1; then
      echo -e "${GREEN}✓ Deleted${NC}"
      ((DELETED_COUNT++))
    else
      echo -e "${RED}✗ Failed${NC}"
    fi
  else
    echo -e "  ${YELLOW}⊘ Not found: $pattern${NC}"
  fi
done

echo ""
echo -e "${GREEN}✓ Deleted $DELETED_COUNT workflows${NC}"

echo ""
echo -e "${YELLOW}Step 3: Re-importing updated workflows...${NC}"
echo ""

IMPORTED_COUNT=0

for workflow in "${WORKFLOWS[@]}"; do
  WORKFLOW_FILE="n8n-workflows/${workflow}.json"
  
  if [ -f "$WORKFLOW_FILE" ]; then
    WORKFLOW_NAME=$(jq -r '.name' "$WORKFLOW_FILE")
    echo -n "  Importing: $WORKFLOW_NAME... "
    
    IMPORT_RESPONSE=$(curl -s -X POST "$N8N_URL/rest/workflows" \
      -H "X-N8N-API-KEY: $N8N_API_KEY" \
      -H "Content-Type: application/json" \
      -d @"$WORKFLOW_FILE")
    
    if echo "$IMPORT_RESPONSE" | jq '.id' > /dev/null 2>&1; then
      NEW_ID=$(echo "$IMPORT_RESPONSE" | jq -r '.id')
      echo -e "${GREEN}✓ Imported (ID: $NEW_ID)${NC}"
      ((IMPORTED_COUNT++))
    else
      echo -e "${RED}✗ Failed${NC}"
      echo "    Response: $(echo "$IMPORT_RESPONSE" | jq -c '.message // .error')"
    fi
  else
    echo -e "  ${YELLOW}⊘ File not found: $WORKFLOW_FILE${NC}"
  fi
done

echo ""
echo -e "${GREEN}✓ Imported $IMPORTED_COUNT workflows${NC}"

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}✅ WORKFLOW UPDATE COMPLETE${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Summary:${NC}"
echo "  Deleted: $DELETED_COUNT workflows"
echo "  Imported: $IMPORTED_COUNT workflows"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Go to n8n UI and verify workflows are updated"
echo "  2. Check node names (should show 'Gemini' not 'Groq')"
echo "  3. Manually test each workflow"
echo ""

