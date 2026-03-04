#!/bin/bash
# Configure Uptime Kuma monitors using curl

UPTIME_URL="http://127.0.0.1:3001"
TIMEOUT=5

echo "🔵 Configuring Uptime Kuma Monitors..."
echo "📍 Target: $UPTIME_URL"
echo ""

# Wait for Uptime Kuma to be ready
echo "⏳ Waiting for Uptime Kuma..."
for i in {1..10}; do
  if curl -s -m 2 "$UPTIME_URL" > /dev/null 2>&1; then
    echo "✅ Uptime Kuma is ready"
    break
  fi
  echo "   Attempt $i/10... waiting 2s"
  sleep 2
done
echo ""

# Define monitors
# Format: name|type|url|interval|maxRetries|description
declare -a MONITORS=(
  # Core Infrastructure
  "Prometheus|http|http://prometheus:9090|60|3|Time-series metrics database"
  "Grafana|http|http://grafana:3000|60|3|Dashboard & visualization engine"
  "Traefik|http|http://traefik:8080/ping|60|3|Reverse proxy health check"
  "Loki|http|http://loki:3100/loki/api/v1/status|60|3|Log aggregation system"
  
  # Database Exporters (now on proxy network)
  "PostgreSQL Exporter|http|http://postgres_exporter:9187|60|3|Primary DB metrics export"
  "PostgreSQL AI Exporter|http|http://postgres_ai_exporter:9187|60|3|AI DB metrics export"
  "PostgreSQL Infra Exporter|http|http://postgres_infra_exporter:9187|60|3|Infra DB metrics export"
  "Redis Exporter|http|http://redis_exporter:9121|60|3|Redis cache metrics export"
  
  # Container Services
  "NEXUS App|http|http://nexus-app:3030|60|3|Next.js frontend application"
  "N8N Automation|http|http://n8n:5678|60|3|Workflow automation engine"
  "cAdvisor Metrics|http|http://cadvisor:8080|60|3|Container metrics collection"
  "Node Exporter|http|http://node_exporter:9100|60|3|Host system metrics"
  
  # Direct Services
  "PostgreSQL DB|http|http://postgres:5432|60|3|Primary database service"
  "Redis Cache|http|http://redis:6379|60|3|In-memory cache store"
  
  # Other Services
  "Vaultwarden|http|http://vaultwarden:80|60|3|Secrets manager"
  "Portainer|http|http://portainer:9000/api/status|60|3|Container management UI"
  "Uptime Kuma|http|http://uptime-kuma:3001|60|3|This monitoring system"
)

echo "📋 Adding monitors..."
added=0
errors=0

for monitor in "${MONITORS[@]}"; do
  IFS='|' read -r name type url interval retries desc <<< "$monitor"
  
  # Prepare JSON payload
  payload=$(cat <<EOF
{
  "name": "$name",
  "type": "$type",
  "url": "$url",
  "interval": $interval,
  "retryInterval": 60,
  "maxretries": $retries,
  "description": "$desc",
  "active": 1
}
EOF
)
  
  # Try to add the monitor
  response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "$UPTIME_URL/api/monitors" 2>/dev/null)
  
  # Check if response contains error
  if echo "$response" | grep -q "error\|Error\|400\|401\|403" 2>/dev/null; then
    echo "⚠️  Failed to add: $name"
    ((errors++))
  else
    echo "✅ Added: $name"
    ((added++))
  fi
  
  sleep 0.3
done

echo ""
echo "═══════════════════════════════════════"
echo "✅ Monitor Configuration Complete!"
echo "   Added:   $added monitors"
echo "   Errors:  $errors"
echo "═══════════════════════════════════════"
echo ""
echo "📊 Monitor Summary:"
echo "   ✅ Core Infra: Prometheus, Grafana, Traefik, Loki"
echo "   💾 DB Exporters: PostgreSQL (3x), Redis"
echo "   🐳 Containers: NEXUS App, N8N, cAdvisor, Node Exporter"
echo "   🔐 Services: Vaultwarden, Portainer, Uptime Kuma"
echo ""
echo "🔗 Access: http://127.0.0.1:3001"
