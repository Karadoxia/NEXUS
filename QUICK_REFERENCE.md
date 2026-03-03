# 🚀 NEXUS Quick Reference Card

## URLs

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| **Admin Panel** | https://app.nexus-io.duckdns.org/admin | admin@nexus-io | C@sper@22032011 |
| **n8n** | https://n8n.nexus-io.duckdns.org | (create account) | - |
| **Grafana** | https://nexus-grafana.local | admin | admin |
| **Prometheus** | https://nexus-prometheus.local | - | - |
| **Container Dashboard** | https://app.nexus-io.duckdns.org/admin/containers | (logged in) | - |
| **Uptime Kuma** | https://nexus-uptime.local | - | - |
| **WireGuard** | https://nexus-vpn.local | - | (from .env) |
| **Portainer** | http://localhost:9000 | admin | (from setup) |

---

## Commands

### Start Services
```bash
./scripts/start-all.sh --build-app    # With dev server
./scripts/start-all.sh --no-dev       # Just containers
```

### Provision After First Startup
```bash
bash scripts/provision.sh
```

### Create n8n Workflows
```bash
# Option 1: Manual (10 min) - Follow this guide
cat docs/n8n-quick-setup.md

# JSON mapping/contract (UI + API workflow parity)
cat docs/n8n-workflow-json-mapping.md

# Option 2: Auto-create via API
npx tsx scripts/create-n8n-workflows.ts
```

Required env for API-based creation:
```bash
export N8N_API_KEY="<your-n8n-api-key>"
# Optional overrides
export N8N_URL="http://n8n:5678"
export APP_DOCKER_REGISTER_URL="https://app.nexus-io.duckdns.org/api/docker/register"
export N8N_WEBHOOK_PATH="container-detected"
```

### Test Container Registration
```bash
bash scripts/test-container-registration.sh
```

### Check Services
```bash
# List running containers
docker compose ps

# Check specific service logs
docker logs nexus_app
docker logs n8n
docker logs prometheus

# Test database
docker exec nexus_postgres psql -U nexus -d nexus_v2 -c "SELECT * FROM ContainerRegistry LIMIT 5;"
```

---

## Key APIs

### Container Registration
```bash
# Register a container
curl -X POST https://app.nexus-io.duckdns.org/api/docker/register \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "abc123",
    "containerName": "my-service",
    "image": "nginx:latest",
    "ports": {"80": "80/tcp"},
    "labels": {"auto-register": "true"},
    "environment": {},
    "networks": ["proxy"]
  }'

# List all containers
curl https://app.nexus-io.duckdns.org/api/docker/register

# Get status for specific container
curl https://app.nexus-io.duckdns.org/api/docker/containers/{id}/status

# Retry failed registrations
curl -X POST https://app.nexus-io.duckdns.org/api/docker/containers/{id}/retry \
  -H "Content-Type: application/json" \
  -d '{"systems": ["traefik", "prometheus"]}'
```

### HR Management
```bash
# List employees
curl https://app.nexus-io.duckdns.org/api/admin/hr/employees

# Create employee
curl -X POST https://app.nexus-io.duckdns.org/api/admin/hr/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "MANAGER"
  }'

# Get employee details
curl https://app.nexus-io.duckdns.org/api/admin/hr/employees/{id}

# Update employee
curl -X PATCH https://app.nexus-io.duckdns.org/api/admin/hr/employees/{id} \
  -H "Content-Type: application/json" \
  -d '{"role": "IT", "department": "Engineering"}'

# Reset password
curl -X POST https://app.nexus-io.duckdns.org/api/admin/hr/employees/{id}/reset-password \
  -H "Content-Type: application/json" \
  -d '{"newPassword": "NewPass123!"}'
```

---

## n8n Webhook URL

```
https://n8n.nexus-io.duckdns.org/webhook/container-detected
```

**Test:**
```bash
curl -X POST https://n8n.nexus-io.duckdns.org/webhook/container-detected \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "test123",
    "containerName": "test-service",
    "image": "nginx:latest",
    "ports": {"80": "80/tcp"},
    "labels": {"auto-register": "true"},
    "environment": {},
    "networks": ["proxy"]
  }'
```

---

## Admin Accounts

| Email | Password | Role |
|-------|----------|------|
| caspertech92@gmail.com | C@sper@22032011 | ADMIN |
| admin@nexus-io | C@sper@22032011 | ADMIN |

---

## Database

### Store Database (nexus_v2)
- **Host**: postgres:5432
- **User**: nexus
- **Database**: nexus_v2
- **Password**: (from .env DB_PASSWORD)

### HR Database (nexus_hr)
- **Host**: postgres:5432
- **User**: nexus
- **Database**: nexus_hr
- **Tables**: Employee, HrLog

### n8n Database
- **Host**: postgres:5432
- **User**: nexus
- **Database**: n8n

---

## Docker Compose

```bash
# Start all services
docker compose up -d

# Stop all
docker compose down

# Remove volumes (careful!)
docker compose down -v

# View logs (real-time)
docker compose logs -f nexus_app

# Restart service
docker compose restart n8n

# Check health
docker compose ps
```

---

## File Locations

| What | Where |
|------|-------|
| Main app | `/home/redbend/Desktop/Local-Projects/NEXUS-V2` |
| Config | `.env` |
| Guides | `docs/` |
| Scripts | `scripts/` |
| Source code | `app/`, `src/`, `lib/` |
| Database schema | `prisma/schema.prisma`, `prisma/schema.hr.prisma` |

---

## Common Tasks

### Add a New Team Member
1. Go to: https://app.nexus-io.duckdns.org/admin/employees
2. Click "Create Account"
3. Fill in: Name, Email, Password, Role, Department, Phone
4. Click "Create Account"
5. They can now log in and access their role's features

### Register a Container
1. Option A: Manual via API (see above)
2. Option B: Set `auto-register=true` label on container
3. Option C: Use dashboard's manual registration

### Check Container Status
1. Go to: https://app.nexus-io.duckdns.org/admin/containers
2. Click container name
3. See per-system registration status
4. Click "Retry All" to re-trigger failed registrations

### View Metrics
1. Go to: https://nexus-prometheus.local
2. Click "Graph"
3. Search for metric (e.g., "up")
4. View results

### View Logs
1. Go to: https://nexus-grafana.local
2. Explore → Loki → Select job
3. View container logs

---

## Network Info

| Network | Purpose | Services |
|---------|---------|----------|
| nexus-v2_internal | Internal communication | postgres, redis, prometheus, grafana, loki, n8n, etc |
| nexus-v2_proxy | External/routing | traefik, vaultwarden, grafana, prometheus, loki, n8n, etc |

All containers can reach each other by service name (e.g., `postgres:5432`).

---

## Troubleshooting

### Can't access dashboard
- Check if nexus_app is running: `docker logs nexus_app`
- Check firewall/proxy
- Try incognito mode (clear cookies)

### n8n webhook not responding
- Check n8n running: `docker compose ps n8n`
- Check logs: `docker logs n8n`
- Test: `curl -v https://n8n.nexus-io.duckdns.org/webhook/test`

### Database connection issues
- Check postgres running: `docker compose ps postgres`
- Check credentials in .env
- Verify database exists: `docker exec postgres psql -U nexus -l`

### Container not registering
- Check webhook is active in n8n
- Check container has `auto-register=true` label
- Check API endpoint is responding
- Check database: `SELECT * FROM ContainerRegistry;`

### Slow login
- That's normal (bcrypt takes ~0.5s per attempt for security)
- Try checking "Remember me" option

---

## Performance Tips

1. **Use internal network**: Services on nexus-v2_internal communicate faster
2. **Scale Prometheus**: Increase retention time in prometheus.yml if needed
3. **Clean logs**: Use log rotation to prevent disk issues
4. **Monitor metrics**: Keep eye on container CPU/memory in Grafana

---

## Security Reminders

- ✅ Change default passwords in production
- ✅ Rotate JWT_SECRET and DB_PASSWORD
- ✅ Use HTTPS everywhere (Traefik handles this)
- ✅ Enable 2FA for admin accounts
- ✅ Keep Docker socket secure (read-only mount)
- ✅ Use VPN (WireGuard) for remote access

---

## Documentation

| Topic | File |
|-------|------|
| n8n Quick Setup | `docs/n8n-quick-setup.md` |
| n8n Detailed | `docs/n8n-workflow-setup.md` |
| Container Automation | `docs/n8n-container-automation.md` |
| Security Setup | `docs/` (various guides) |

---

**Last Updated**: March 1, 2026
**Version**: 2.0 (Production Ready)

