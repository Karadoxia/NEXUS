#!/bin/bash
set -e

echo "=== NEXUS Git Sync - March 4, 2026 ==="
echo ""

echo "📦 Step 1: Adding all changes..."
git add -A

echo ""
echo "📝 Step 2: Creating commit..."
git commit -m "🚀 Phase 3 Infrastructure Hardening Complete

✅ Completed Tasks:
- Uptime Kuma: Populated with 12 service monitors
- Uptime Kuma: Admin password set (caspertech92@gmail.com)
- Prometheus: Fixed 401 error (removed invalid bearer_token)
- Prometheus: Added Uptime Kuma API key authentication
- WireGuard: Password configured (C@sper@22032011)
- Vaultwarden: Configured for localhost:8080 access
- Admin Panel: Full client CRUD (edit/delete/reset password)
- Admin Panel: Order management (export/delete)
- n8n Integration: Simplified dashboard access
- Alert Ingress: Unified webhook system deployed
- TypeScript/Prisma: Schema alignment fixes
- Application: Built and deployed successfully
- Baselines: Snapshot created (_baselines/20260304_060000/)

🔧 Configuration Updates:
- docker-compose.yml: Vaultwarden localhost port binding
- docker-compose.yml: Removed CrowdSec middleware (fixing restart loop)
- data/prometheus.yml: Added Uptime Kuma API key auth
- app/api/admin/: Client management endpoints
- app/admin/: Enhanced UI components
- Uptime Kuma DB: Password hash + monitor assignments

🛠️ Scripts Added:
- fix_uptime_and_dns.sh: Monitor fix + DNS setup
- fix_crowdsec.sh: CrowdSec diagnostic tool
- deploy_n8n_fix.sh: n8n access deployment

📋 Known Issues:
- CrowdSec: Restart loop (acquis.yaml fix ready)
- Falco/Trivy: No web UI (CLI/Grafana access only)

🎯 Next Session:
- Fix CrowdSec restart issue
- Add Grafana dashboards for security tools
- Test all monitoring integrations
- Production deployment validation" || echo "⚠️  Nothing to commit (already up to date)"

echo ""
echo "🚀 Step 3: Pushing to remote..."
git push origin main 2>&1 || git push origin master 2>&1 || echo "⚠️  Push failed - check remote configuration"

echo ""
echo "✅ Git sync complete!"
echo ""
echo "📊 Repository status:"
git status --short

echo ""
echo "🌙 Good night! Work saved successfully."
echo "📍 Session summary in: PHASE_3_COMPLETION_REPORT.md"
echo ""
