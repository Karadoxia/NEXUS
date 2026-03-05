#!/bin/bash
set -e

echo "=== CrowdSec Diagnostic & Fix ==="
echo ""

echo "📊 Step 1: Checking CrowdSec configuration..."

# Check if acquis.yaml exists
if [ ! -f "crowdsec/acquis.yaml" ]; then
  echo "⚠️  Missing crowdsec/acquis.yaml - Creating it..."
  mkdir -p crowdsec
  cat > crowdsec/acquis.yaml << 'EOF'
filenames:
  - /var/log/traefik/*.log
labels:
  type: traefik

---
filenames:
  - /var/log/nexus/*.log
labels:
  type: syslog
EOF
  echo "✅ Created crowdsec/acquis.yaml"
else
  echo "✅ crowdsec/acquis.yaml exists"
fi

echo ""
echo "📋 Step 2: Checking CrowdSec logs..."
docker logs nexus_crowdsec --tail 50 2>&1 | head -30

echo ""
echo "🔄 Step 3: Restarting services with CrowdSec middleware removed..."
docker restart traefik
sleep 2

echo ""
echo "🔧 Step 4: Attempting CrowdSec restart..."
docker restart nexus_crowdsec
sleep 5

echo ""
echo "✅ Services restarted"
echo ""
echo "📍 Next steps:"
echo "   1. Check if CrowdSec is running: docker ps | grep crowdsec"
echo "   2. If still failing, check logs: docker logs nexus_crowdsec"
echo "   3. Access your app normally (CrowdSec middleware removed)"
echo ""
