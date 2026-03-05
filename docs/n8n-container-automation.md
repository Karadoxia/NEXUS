# n8n Container Automation Setup Guide

## Overview

This guide covers the setup and configuration of automated Docker container detection and registration across the infrastructure using n8n workflows.

**Infrastructure Systems:**
- **Traefik**: Reverse proxy + routing configuration
- **Prometheus**: Metrics collection and scrape configuration
- **Grafana**: Dashboard creation and visualization
- **Uptime Kuma**: Container uptime monitoring
- **WireGuard**: VPN peer configuration
- **Loki**: Log aggregation and ingestion

## Architecture

```
Docker Event → n8n Webhook → Service Adapters → Infrastructure Registration
                                      ↓
                              Audit Logging (Prisma)
```

### How It Works

1. **Detection**: New container starts with `auto-register=true` label
2. **Webhook**: Container metadata sent to n8n via HTTP POST
3. **Processing**: n8n workflow splits registration across 6 service adapters
4. **Registration**: Each service adapter registers container in its system
5. **Tracking**: Per-service status stored in database with audit trail
6. **Dashboard**: Admin panel shows real-time registration progress

## Phase 1: Prerequisites ✓

- [x] Docker socket mounted to n8n (`/var/run/docker.sock`)
- [x] Container Registry database tables created
- [x] API endpoints implemented:
  - `POST /api/docker/register` - Register new container
  - `GET /api/docker/register` - List containers
  - `GET /api/docker/containers/[id]/status` - Get per-service status
  - `POST /api/docker/containers/[id]/retry` - Retry failed registrations
- [x] Admin dashboard at `/admin/containers`

## Phase 2: n8n Workflow Setup

### Step 1: Configure n8n for Docker Integration

1. **Access n8n**: https://n8n.nexus-io.duckdns.org
2. **Create Credentials** (if not already set up):
   - **HTTP Request** (for calling external APIs)
   - **Webhook** (for incoming container events)

### Step 2: Create Main Webhook Workflow

**Workflow Name**: `Container Auto-Registration`

**Trigger**: HTTP Webhook
```
Method: POST
Path: /container-detected
Authentication: Bearer Token (set WEBHOOK_TOKEN_DOCKER env var)
```

**Webhook Configuration**:
```json
{
  "containerId": "abc123...",
  "containerName": "my-service",
  "image": "myrepo/my-service:1.0",
  "ports": { "5000": "5000/tcp" },
  "labels": { "auto-register": "true" },
  "environment": { "LOG_LEVEL": "info" },
  "networks": ["internal", "proxy"]
}
```

### Step 3: Parse and Route Container Metadata

**Nodes in Main Workflow**:

1. **HTTP Webhook Trigger**
   - Receives container metadata from Docker event listener
   - Validates `auto-register=true` label

2. **Switch Node** (optional validation)
   - Condition: `json.labels['auto-register'] === 'true'`
   - Routes to registration or error handler

3. **Set Variables Node**
   - Store container info for all sub-workflows:
     - `containerId`
     - `containerName`
     - `image`
     - `ports` (first exposed port)
     - `labels`

4. **HTTP Request to Register API**
   - POST to `https://app.nexus-io.duckdns.org/api/docker/register`
   - Pass parsed metadata
   - Get back `jobId` for tracking

5. **Parallel Branches** (one per service):
   - Branch to Traefik adapter
   - Branch to Prometheus adapter
   - Branch to Grafana adapter
   - Branch to Kuma adapter
   - Branch to WireGuard adapter
   - Branch to Loki adapter

### Step 4: Traefik Service Adapter

**Sub-Workflow Name**: `Traefik Registration`

**Logic**:
1. Extract container port from `ports` object (first exposed port)
2. Build Traefik labels:
   ```yaml
   labels:
     - "traefik.enable=true"
     - "traefik.http.routers.${containerName}.rule=Host(`${containerName}.nexus-io.duckdns.org`)"
     - "traefik.http.routers.${containerName}.entrypoints=websecure"
     - "traefik.http.services.${containerName}.loadbalancer.server.port=${containerPort}"
   ```
3. **Update Docker Container** (if using Docker socket):
   - Use Docker API to update container labels
   - Or: Log to audit trail (manual docker-compose update)
4. **Log Event**:
   - POST to audit log endpoint or create event via Prisma

**HTTP Nodes**:
```
POST /api/docker/containers/[id]/status
  → Check if already registered

POST to internal service to update docker-compose (optional)
  → Or just log the configuration needed
```

**Error Handling**:
- Catch failures → log to `RegistrationEvent` with status: `failed`
- Include error details in database
- Response should indicate status for dashboard display

### Step 5: Prometheus Service Adapter

**Sub-Workflow Name**: `Prometheus Registration`

**Logic**:
1. Extract metrics port from labels: `prometheus.port` (default: 9090)
2. Build scrape config:
   ```yaml
   - job_name: 'auto-${containerName}'
     metrics_path: '/metrics'
     static_configs:
       - targets: ['${containerName}:${metricsPort}']
   ```
3. **Update Prometheus Config**:
   - Read existing `/etc/prometheus/prometheus.yml`
   - Append new job config
   - Reload Prometheus: `curl -X POST http://prometheus:9090/-/reload`
4. **Log Event**: Store job name in database

**Implementation Options**:
- **Option A** (SSH/Exec): SSH into host, update prometheus.yml, reload
- **Option B** (Prometheus API): Use Prometheus HTTP API (requires reload capability)
- **Option C** (n8n Docker Integration): Use n8n's Docker node to execute commands in Prometheus container

**Recommended**: Option C (cleanest)

### Step 6: Grafana Service Adapter

**Sub-Workflow Name**: `Grafana Dashboard Creation`

**Logic**:
1. Get Grafana API credentials from n8n credentials
2. Create dashboard via HTTP request:
   ```json
   POST http://grafana:3000/api/dashboards/db
   {
     "dashboard": {
       "title": "${containerName} Metrics",
       "description": "Auto-discovered service",
       "tags": ["auto-discovered"],
       "timezone": "UTC",
       "panels": [
         {
           "title": "CPU Usage",
           "datasource": "Prometheus",
           "targets": [{"expr": "rate(container_cpu_usage_seconds_total{name=\"${containerName}\"}[5m])"}]
         },
         {
           "title": "Memory Usage",
           "datasource": "Prometheus",
           "targets": [{"expr": "container_memory_usage_bytes{name=\"${containerName}\"}"}]
         }
       ]
     }
   }
   ```
3. Extract dashboard ID from response
4. Log event with panel IDs

**Grafana API Setup**:
- Generate API token in Grafana UI (Admin → API Keys)
- Store in n8n credentials: `Authorization: Bearer <token>`

### Step 7: Uptime Kuma Service Adapter

**Sub-Workflow Name**: `Kuma Monitor Creation`

**Logic**:
1. Detect container port type: TCP/HTTP (from labels)
2. Build monitor config:
   ```json
   {
     "name": "${containerName} Uptime",
     "type": "http",
     "url": "https://${containerName}.nexus-io.duckdns.org",
     "interval": 60,
     "retryInterval": 60,
     "maxredirects": 10
   }
   ```
3. **Create Monitor**:
   ```
   POST http://uptime-kuma:3001/api/add-monitor
   Authorization: Bearer ${KUMA_API_KEY}
   ```
4. Extract monitor ID from response
5. Log event

**Kuma API Setup**:
- Generate API token in Kuma UI (Settings → API Keys)
- Store in n8n credentials

### Step 8: WireGuard Service Adapter

**Sub-Workflow Name**: `WireGuard Peer Registration`

**Logic**:
1. Check for label: `wireguard.enabled=true`
2. If present:
   - Generate WireGuard peer config
   - Add to WireGuard container
   - Assign IP from `10.0.0.0/24` pool
3. Log event with assigned IP

**Implementation**:
```bash
# Inside WireGuard container
wg genkey | tee privatekey | wg pubkey > publickey
# Then add to wg0 config
wg set wg0 peer <public_key> allowed-ips 10.0.0.${n}/32
```

**n8n Step**:
- Use Docker exec to run wg commands inside wireguard container
- Or: SSH to host and execute on container

### Step 9: Loki Service Adapter

**Sub-Workflow Name**: `Loki Log Ingestion Setup`

**Logic**:
1. Update Promtail scrape configuration:
   ```yaml
   - job_name: docker-${containerName}
     docker_sd_configs:
       - host: unix:///var/run/docker.sock
     relabel_configs:
       - source_labels: ['__meta_docker_container_name']
         regex: '${containerName}'
         action: keep
       - source_labels: ['__meta_docker_container_name']
         target_label: 'container'
   ```
2. Reload Promtail configuration
3. Verify logs flowing to Loki

**Implementation**:
- Similar to Prometheus: update config file, reload service
- Use Docker exec or SSH to update `/etc/promtail/config.yml`

## Phase 3: Event Listener (Optional)

### Docker Event Watcher Script

For automatic webhook triggering when containers start (without manual triggers):

```typescript
// scripts/docker-event-watcher.ts
import Dockerode from 'dockerode';

const docker = new Dockerode({ socketPath: '/var/run/docker.sock' });

docker.getEvents(
  { filters: { type: ['container'], event: ['start'] } },
  async (err, stream) => {
    if (err) throw err;

    stream?.on('data', async (chunk) => {
      const event = JSON.parse(chunk.toString());
      const container = docker.getContainer(event.Actor.ID);
      const inspect = await container.inspect();

      // Check for auto-register label
      if (inspect.Config.Labels?.['auto-register'] === 'true') {
        // Send to n8n webhook
        await fetch(
          'https://n8n.nexus-io.duckdns.org/webhook/container-detected',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.WEBHOOK_TOKEN_DOCKER}`,
            },
            body: JSON.stringify({
              containerId: inspect.ID,
              containerName: inspect.Name.replace(/^\//, ''),
              image: inspect.Config.Image,
              ports: inspect.NetworkSettings.Ports,
              labels: inspect.Config.Labels,
              environment: inspect.Config.Env.reduce((acc: any, env: string) => {
                const [key, val] = env.split('=');
                acc[key] = val;
                return acc;
              }, {}),
              networks: Object.keys(inspect.NetworkSettings.Networks),
            }),
          }
        );
      }
    });
  }
);
```

**Run as Service**:
```bash
docker compose run --rm nexus-app npx tsx scripts/docker-event-watcher.ts
```

Or add as separate service in docker-compose.yml.

## Phase 4: Manual Webhook Testing

### Test the n8n Webhook

```bash
curl -X POST https://n8n.nexus-io.duckdns.org/webhook/container-detected \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${WEBHOOK_TOKEN_DOCKER}" \
  -d '{
    "containerId": "test-abc123",
    "containerName": "test-service",
    "image": "nginx:latest",
    "ports": { "80": "80/tcp" },
    "labels": { "auto-register": "true" },
    "environment": {},
    "networks": ["proxy"]
  }'
```

### Check Registration Status

```bash
# List all containers
curl https://app.nexus-io.duckdns.org/api/docker/register

# Get status of specific container
curl https://app.nexus-io.duckdns.org/api/docker/containers/test-abc123/status

# Retry failed systems
curl -X POST https://app.nexus-io.duckdns.org/api/docker/containers/test-abc123/retry \
  -H "Content-Type: application/json" \
  -d '{ "systems": ["traefik", "prometheus"] }'
```

## Phase 5: Dashboard Monitoring

### Admin Panel

Access at: https://app.nexus-io.duckdns.org/admin/containers

**Features**:
- Real-time container list with registration progress
- Per-system status indicators (Traefik, Prometheus, Grafana, Kuma, WireGuard, Loki)
- Recent event history
- Retry individual systems
- Retry all systems for a container

### Metrics

Query in Prometheus:
```
# Container registration success rate
rate(registration_event_total{status="success"}[5m]) / rate(registration_event_total[5m])

# Containers fully registered
count(container_registry{registration_completed_at != ""})

# Registrations by system
count by (system) (registration_event{status="success"})
```

## Troubleshooting

### Container Not Appearing in Dashboard

1. Verify `auto-register=true` label is set
2. Check n8n webhook is listening: `https://n8n.nexus-io.duckdns.org/webhook/container-detected`
3. Verify webhook token in `.env`: `WEBHOOK_TOKEN_DOCKER`
4. Check n8n logs for webhook trigger errors

### Service Registration Failing

1. **Traefik**: Check traefik logs for label parsing errors
2. **Prometheus**: Verify `prometheus.port` label is set, check reload works
3. **Grafana**: Verify API credentials, check datasource exists
4. **Kuma**: Check API token, verify monitor creation
5. **WireGuard**: Check container has NET_ADMIN capability
6. **Loki**: Verify Promtail config syntax, check log streaming

Use admin dashboard "Retry" button to manually re-trigger failed registrations.

### Webhooks Not Firing

1. Verify n8n is running: `docker compose ps n8n`
2. Check n8n webhook URL in n8n UI (Workflows → Container Auto-Registration → Webhook Trigger)
3. Check Docker event watcher is running (if using automatic detection)
4. Manually POST to webhook to test:
   ```bash
   curl -X POST https://n8n.nexus-io.duckdns.org/webhook/container-detected \
     -H "Authorization: Bearer ${WEBHOOK_TOKEN_DOCKER}" \
     -H "Content-Type: application/json" \
     -d '{"containerId":"test","containerName":"test",...}'
   ```

## Security Considerations

1. **Docker Socket**: Mounted read-only (`:ro`)
2. **Webhook Token**: Use `WEBHOOK_TOKEN_DOCKER` env var (strong random string)
3. **API Keys**: Store Grafana/Kuma tokens in n8n credentials (encrypted)
4. **Label Validation**: Only process containers with explicit `auto-register=true`
5. **Network Isolation**: All infrastructure services on internal network

## Future Enhancements

- [ ] Automatic container health checks and remediation
- [ ] Cost tracking per container
- [ ] Container dependency mapping
- [ ] Automated scaling based on metrics
- [ ] Integration with container image scanning/security tools
- [ ] Backup automation per container type
- [ ] Custom metric collection per container

## Support

For issues:
1. Check admin dashboard for detailed event logs
2. Review n8n workflow execution history
3. Check individual system logs (Traefik, Prometheus, etc.)
4. Query registration events: `SELECT * FROM RegistrationEvent ORDER BY timestamp DESC LIMIT 20;`
