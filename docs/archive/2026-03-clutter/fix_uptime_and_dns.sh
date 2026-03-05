#!/bin/bash
set -e

echo "=== NEXUS Infrastructure Fix Script ==="
echo ""

# 1. Fix Uptime Kuma monitors
echo "🔧 Step 1: Fixing Uptime Kuma monitors..."
docker exec uptime_kuma sqlite3 /app/data/kuma.db "UPDATE monitor SET user_id = 1 WHERE user_id IS NULL;"
echo "✅ All monitors assigned to user ID 1"

# Verify monitors
echo ""
echo "📊 Current monitors:"
docker exec uptime_kuma sqlite3 /app/data/kuma.db "SELECT id, name, user_id, active FROM monitor;"

echo ""
echo "=== DNS Entries Setup ==="
echo "⚠️  This step requires sudo password"
echo ""

# 2. Add DNS entries
echo "🌐 Step 2: Adding local DNS entries to /etc/hosts..."
sudo bash -c 'cat >> /etc/hosts << EOF

# NEXUS Security Tools
127.0.0.1 nexus-crowdsec.local
127.0.0.1 nexus-falco.local
127.0.0.1 nexus-trivy.local
EOF'

echo "✅ DNS entries added"

# Verify DNS entries
echo ""
echo "📋 Verifying /etc/hosts entries:"
grep -E "nexus-(crowdsec|falco|trivy)" /etc/hosts

echo ""
echo "🎉 All fixes applied successfully!"
echo ""
echo "📍 Service URLs:"
echo "   - CrowdSec:     http://nexus-crowdsec.local"
echo "   - Falco:        http://nexus-falco.local"
echo "   - Trivy:        http://nexus-trivy.local"
echo "   - Uptime Kuma:  http://nexus-uptime.local/dashboard (refresh to see monitors)"
echo ""
