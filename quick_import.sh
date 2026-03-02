#!/bin/bash
API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTlkNTAxYS1jYmM3LTQyMTktODllOS02YzhhYjcyMzAyZDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMTk2MTA3YjItZTgzNi00OGYyLTlkMGQtMzRiZWJkNGYyNjg2IiwiaWF0IjoxNzcyNDAwNDg0fQ.VPS_OSKQvhdpoGA2Y7fvYcxVNrV8qwBzTRcvUzUSAE0"

success=0
failed=0

echo "🚀 Starting n8n workflow import..."
echo ""

for file in n8n-workflows/{0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17}-*.json; do
    name=$(basename "$file")
    echo -n "📤 $name... "
    
    # Extract clean payload
    payload=$(jq -c '{
        name: .name,
        nodes: .nodes,
        connections: .connections,
        settings: .settings,
        tags: .tags
    }' "$file" 2>/dev/null)
    
    if [ -z "$payload" ]; then
        echo "❌ JSON parse error"
        ((failed++))
        continue
    fi
    
    # Try to reach n8n via localhost (should be proxied by Traefik)
    response=$(curl -s -w "\n%{http_code}" -X POST "https://n8n.nexus-io.duckdns.org/api/v1/workflows" \
        -H "X-N8N-API-KEY: $API_KEY" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        --insecure 2>/dev/null)
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        id=$(echo "$body" | jq -r '.data.id // .data.id' 2>/dev/null)
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
