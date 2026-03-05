#!/bin/bash
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTlkNTAxYS1jYmM3LTQyMTktODllOS02YzhhYjcyMzAyZDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMTk2MTA3YjItZTgzNi00OGYyLTlkMGQtMzRiZWJkNGYyNjg2IiwiaWF0IjoxNzcyNDAwNDg0fQ.VPS_OSKQvhdpoGA2Y7fvYcxVNrV8qwBzTRcvUzUSAE0"
N8N_API="http://n8n:5678/api/v1/workflows"

WORKFLOWS=(
    "00-global-error-notifier.json"
    "01-stripe-order-fulfillment.json"
    "02-abandoned-order-recovery.json"
    "03-daily-sales-report.json"
    "04-security-incident-aggregator.json"
    "05-ai-support-router.json"
    "06-ai-product-upsell.json"
    "07-container-auto-registration-FIXED.json"
    "08-inventory-restock-ai.json"
    "09-review-collection-ai.json"
    "10-performance-monitor.json"
    "11-newsletter-generator.json"
    "12-automated-backup.json"
    "13-seo-optimizer.json"
    "14-fraud-detector.json"
    "15-social-media-poster.json"
    "16-churn-predictor.json"
    "17-site-audit-bot.json"
)

success=0
failed=0

echo "🚀 Importing n8n workflows..."

for workflow_file in "${WORKFLOWS[@]}"; do
    echo -n "📤 Importing $workflow_file... "
    
    # Extract required fields from JSON
    payload=$(jq '{
        name: .name,
        nodes: .nodes,
        connections: .connections,
        settings: .settings,
        tags: .tags
    }' "n8n-workflows/$workflow_file")
    
    response=$(curl -s -X POST "$N8N_API" \
        -H "X-N8N-API-KEY: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "$payload")
    
    if echo "$response" | jq -e '.data.id' > /dev/null 2>&1; then
        id=$(echo "$response" | jq -r '.data.id')
        echo "✅ SUCCESS (ID: $id)"
        ((success++))
    else
        echo "❌ FAILED"
        echo "$response" | jq . 2>/dev/null || echo "$response" | head -c 200
        ((failed++))
    fi
done

echo ""
echo "=========================================="
echo "📊 RESULTS: $success imported, $failed failed"
echo "=========================================="
