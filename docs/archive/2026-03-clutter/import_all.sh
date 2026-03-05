#!/bin/bash
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTlkNTAxYS1jYmM3LTQyMTktODllOS02YzhhYjcyMzAyZDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMTk2MTA3YjItZTgzNi00OGYyLTlkMGQtMzRiZWJkNGYyNjg2IiwiaWF0IjoxNzcyNDAwNDg0fQ.VPS_OSKQvhdpoGA2Y7fvYcxVNrV8qwBzTRcvUzUSAE0"

success=0
failed=0

echo "🚀 Starting n8n workflow import..."
echo ""

# Array of files
files=(
    "n8n-workflows/00-global-error-notifier.json"
    "n8n-workflows/01-stripe-order-fulfillment.json"
    "n8n-workflows/02-abandoned-order-recovery.json"
    "n8n-workflows/03-daily-sales-report.json"
    "n8n-workflows/04-security-incident-aggregator.json"
    "n8n-workflows/05-ai-support-router.json"
    "n8n-workflows/06-ai-product-upsell.json"
    "n8n-workflows/07-container-auto-registration-FIXED.json"
    "n8n-workflows/08-inventory-restock-ai.json"
    "n8n-workflows/09-review-collection-ai.json"
    "n8n-workflows/10-performance-monitor.json"
    "n8n-workflows/11-newsletter-generator.json"
    "n8n-workflows/12-automated-backup.json"
    "n8n-workflows/13-seo-optimizer.json"
    "n8n-workflows/14-fraud-detector.json"
    "n8n-workflows/15-social-media-poster.json"
    "n8n-workflows/16-churn-predictor.json"
    "n8n-workflows/17-site-audit-bot.json"
)

for file in "${files[@]}"; do
    name=$(basename "$file")
    echo -n "📤 $name... "
    
    if [ ! -f "$file" ]; then
        echo "❌ FILE NOT FOUND"
        ((failed++))
        continue
    fi
    
    # Extract clean payload - only required fields
    payload=$(jq -c '{
        name: .name,
        nodes: .nodes,
        connections: .connections,
        settings: .settings // {},
        tags: .tags // []
    }' "$file" 2>/dev/null)
    
    if [ -z "$payload" ]; then
        echo "❌ JSON PARSE ERROR"
        ((failed++))
        continue
    fi
    
    # Use docker exec to reach n8n from internal network
    response=$(docker exec n8n curl -s -w "\n%{http_code}" -X POST "http://localhost:5678/api/v1/workflows" \
        -H "X-N8N-API-KEY: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "$payload" 2>/dev/null)
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "✅ SUCCESS"
        ((success++))
    else
        echo "❌ HTTP $http_code"
        ((failed++))
    fi
done

echo ""
echo "=========================================="
echo "✅ IMPORTED: $success | ❌ FAILED: $failed"
echo "=========================================="
