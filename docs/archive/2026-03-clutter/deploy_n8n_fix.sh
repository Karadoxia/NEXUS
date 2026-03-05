#!/bin/bash
set -e

echo "=== NEXUS Quick Fix Deployment ==="
echo ""

echo "🔧 Step 1: Rebuilding application..."
docker-compose build nexus-app

echo "🚀 Step 2: Restarting application..."
docker-compose up -d nexus-app

echo "⏳ Waiting for application to start..."
sleep 5

echo "✅ Deployment complete!"
echo ""
echo "📍 Test n8n access:"
echo "   1. Go to Admin Panel → Workflows"
echo "   2. Click 'Open n8n Dashboard'"
echo "   3. Should open http://nexus-n8n.local:5678 directly"
echo ""
