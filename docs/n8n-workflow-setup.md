# n8n Container Automation Workflow Setup

## Quick Start

This guide walks you through creating the n8n workflows for automatic container registration across all infrastructure systems.

**Estimated Time**: 45 minutes
**Difficulty**: Intermediate
**Prerequisites**: n8n access at https://n8n.nexus-io.duckdns.org

---

## Step 1: Access n8n and Create Main Workflow

1. **Open n8n**: https://n8n.nexus-io.duckdns.org
2. **Create New Workflow**:
   - Click "New Workflow"
   - Name: `Container Auto-Registration`
   - Description: "Automatically registers Docker containers across infrastructure (Traefik, Prometheus, Grafana, Kuma, WireGuard, Loki)"

---

## Step 2: Add HTTP Webhook Trigger

### Node 1: HTTP Webhook

**Configuration**:
1. Click **+** → Search "Webhook" → Select "HTTP Request"
2. Actually, use **"Webhook"** node:
   - Click **+** → Search "Webhook" → Select **Webhook** (not HTTP Request)
   - Click dropdown to expand
   - In the trigger section:
     - **HTTP Method**: POST
     - **Path**: `/container-detected`
     - **Authentication**: Copy the webhook URL at the bottom

3. **Save webhook configuration**
4. **Copy the full webhook URL** - you'll need this for testing

### Test Data (for workflow preview):
```json
{
  "containerId": "abc123def456",
  "containerName": "test-service",
  "image": "nginx:latest",
  "ports": {
    "80": "80/tcp",
    "443": "443/tcp"
  },
  "labels": {
    "auto-register": "true",
    "prometheus.port": "9090"
  },
  "environment": {
    "LOG_LEVEL": "info",
    "APP_ENV": "production"
  },
  "networks": ["internal", "proxy"]
}
```

---

## Step 3: Validate Container Metadata

### Node 2: Switch (Conditional)

1. Click **+** → Search "Switch" → Select **Switch**
2. **Condition**:
   - Add condition: `body.labels['auto-register'] === 'true'`
   - IF TRUE: continue to registration
   - IF FALSE: return error response

**Output**: Proceed only if container has explicit `auto-register=true` label

---

## Step 4: Register in Database

### Node 3: HTTP Request - Register Container

1. Click **+** → Search "HTTP Request" → Select **HTTP Request**
2. **Configuration**:
   - **Method**: POST
   - **URL**: `https://app.nexus-io.duckdns.org/api/docker/register`
   - **Headers**:
     ```
     Content-Type: application/json
     ```
   - **Body** (JSON):
     ```json
     {
       "containerId": "{{ $json.body.containerId }}",
       "containerName": "{{ $json.body.containerName }}",
       "image": "{{ $json.body.image }}",
       "ports": {{ $json.body.ports }},
       "labels": {{ $json.body.labels }},
       "environment": {{ $json.body.environment }},
       "networks": {{ $json.body.networks }}
     }
     ```

3. **Save and Test**: Click "Test" to verify registration

**Expected Response**:
```json
{
  "status": "queued",
  "jobId": "...",
  "containerId": "abc123...",
  "containerName": "test-service"
}
```

---

## Step 5: Parallel Registration - Set Variables

### Node 4: Set Variables

1. Click **+** → Search "Set" → Select **Set Variable**
2. **Store Container Metadata** for use in parallel branches:
   - Variable Name: `containerData`
   - Value:
     ```json
     {
       "containerId": "{{ $json.body.containerId }}",
       "containerName": "{{ $json.body.containerName }}",
       "image": "{{ $json.body.image }}",
       "ports": {{ $json.body.ports }},
       "labels": {{ $json.body.labels }},
       "metricsPort": {{ $json.body.labels['prometheus.port'] || 9090 }}
     }
     ```

---

## Step 6: Create Service Adapters (Parallel Branches)

Now create 6 parallel branches - one for each service adapter.

### 6a. Traefik Adapter Branch

**Node 5a: HTTP Request - Traefik**

1. Click **+** → Search "HTTP Request" → **HTTP Request**
2. **Purpose**: Notify Traefik to register the container routing

For now, we'll just log to audit. In production, this would:
- Extract container port from labels
- Generate Traefik labels
- Update docker-compose or call Docker API

**Configuration**:
```json
Method: POST
URL: https://app.nexus-io.duckdns.org/api/docker/containers/{{ $variables.containerData.containerId }}/retry
Headers:
  Content-Type: application/json
Body:
  {
    "systems": []  // Leave empty - this is just logging for now
  }
```

**Alternative - Log to Console**:
1. Click **+** → Search "Code" → Select **Execute JavaScript**
2. **Code**:
   ```javascript
   return {
     system: "traefik",
     status: "pending",
     message: "Traefik registration queued for container: " + $variables.containerData.containerName,
     port: $variables.containerData.ports["80"] || 8080
   };
   ```

### 6b. Prometheus Adapter Branch

**Node 5b: Execute JavaScript**

1. Click **+** → Search "Code" → **Execute JavaScript**
2. **Code**:
   ```javascript
   const metricsPort = $variables.containerData.metricsPort;
   const jobName = `auto-${$variables.containerData.containerName}`;

   return {
     system: "prometheus",
     status: "pending",
     jobName: jobName,
     metricsPort: metricsPort,
     message: `Prometheus registration queued - job: ${jobName}:${metricsPort}/metrics`
   };
   ```

### 6c. Grafana Adapter Branch

**Node 5c: Execute JavaScript**

1. Click **+** → Search "Code" → **Execute JavaScript**
2. **Code**:
   ```javascript
   const dashboardName = `${$variables.containerData.containerName} Metrics`;

   return {
     system: "grafana",
     status: "pending",
     dashboardName: dashboardName,
     message: `Grafana dashboard auto-creation queued: ${dashboardName}`
   };
   ```

### 6d. Uptime Kuma Adapter Branch

**Node 5d: Execute JavaScript**

1. Click **+** → Search "Code" → **Execute JavaScript**
2. **Code**:
   ```javascript
   const serviceName = $variables.containerData.containerName;
   const domain = `${serviceName}.nexus-io.duckdns.org`;

   return {
     system: "kuma",
     status: "pending",
     monitorName: `${serviceName} Uptime`,
     url: `https://${domain}`,
     message: `Kuma monitor creation queued for: ${domain}`
   };
   ```

### 6e. WireGuard Adapter Branch

**Node 5e: Execute JavaScript**

1. Click **+** → Search "Code" → **Execute JavaScript**
2. **Code**:
   ```javascript
   const hasWgEnabled = $variables.containerData.labels['wireguard.enabled'] === 'true';

   if (!hasWgEnabled) {
     return {
       system: "wireguard",
       status: "skipped",
       message: "WireGuard registration skipped (wireguard.enabled label not set)"
     };
   }

   return {
     system: "wireguard",
     status: "pending",
     message: `WireGuard peer configuration generation queued`
   };
   ```

### 6f. Loki Adapter Branch

**Node 5f: Execute JavaScript**

1. Click **+** → Search "Code" → **Execute JavaScript**
2. **Code**:
   ```javascript
   return {
     system: "loki",
     status: "pending",
     jobName: `docker-${$variables.containerData.containerName}`,
     message: `Loki log scrape config registration queued`
   };
   ```

---

## Step 7: Merge and Respond

### Node 6: Merge Branches

1. Click **+** after all adapter branches
2. Search "Merge" → Select **Merge**
3. Configure to merge all 6 adapter outputs

### Node 7: Respond to Webhook

1. Click **+** → Search "Respond to Webhook" → Select **Respond to Webhook**
2. **Body**:
   ```json
   {
     "status": "registered",
     "containerId": "{{ $json.body.containerId }}",
     "containerName": "{{ $json.body.containerName }}",
     "systems": [
       {
         "name": "traefik",
         "status": "queued"
       },
       {
         "name": "prometheus",
         "status": "queued"
       },
       {
         "name": "grafana",
         "status": "queued"
       },
       {
         "name": "kuma",
         "status": "queued"
       },
       {
         "name": "wireguard",
         "status": "queued"
       },
       {
         "name": "loki",
         "status": "queued"
       }
     ],
     "message": "Container registration initiated across all systems"
   }
   ```

---

## Step 8: Save and Test Workflow

1. Click **Save** at the top
2. Click **Execute Workflow**
3. Paste the webhook URL into your browser or use curl:

```bash
curl -X POST https://n8n.nexus-io.duckdns.org/webhook/container-detected \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "test123",
    "containerName": "my-test-service",
    "image": "nginx:latest",
    "ports": {"80": "80/tcp"},
    "labels": {"auto-register": "true"},
    "environment": {},
    "networks": ["proxy"]
  }'
```

**Expected Response**:
```json
{
  "status": "registered",
  "containerId": "test123",
  "containerName": "my-test-service",
  "systems": [...]
}
```

4. **Check Admin Dashboard**:
   - Go to https://app.nexus-io.duckdns.org/admin/containers
   - You should see your test container registered
   - Click "Details" to see per-system status

---

## Step 9: Enable Workflow & Production Testing

1. Click the **Play** button to enable the workflow (make it active)
2. Copy the webhook URL from the Webhook node
3. Update your environment:

```bash
export N8N_WEBHOOK_URL="https://n8n.nexus-io.duckdns.org/webhook/container-detected"
export WEBHOOK_TOKEN_DOCKER="your-strong-random-token"
```

4. Run the Docker event watcher:

```bash
docker run --rm \
  -e WEBHOOK_URL="$N8N_WEBHOOK_URL" \
  -e WEBHOOK_TOKEN_DOCKER="$WEBHOOK_TOKEN_DOCKER" \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  node:20 \
  npx tsx /path/to/docker-event-watcher.ts
```

---

## Step 10: Production Workflow Enhancements (Optional)

Once basic workflow is working, enhance with:

### Add Error Handling

1. After each adapter branch, add **Try-Catch**:
   ```
   +Try Catch → If error, log to Slack/Telegram
   ```

2. **Error Node**:
   - Send message: "Container registration failed for `{{ $json.containerName }}`"
   - Include error details and timestamp

### Add Logging

1. Add **Supabase** or **PostgreSQL** node to log all registration events:
   ```sql
   INSERT INTO registration_events (container_id, action, status, timestamp)
   VALUES ({{ $json.containerId }}, 'webhook_received', 'success', NOW())
   ```

### Add Slack/Telegram Notifications

1. Click **+** → Search "Slack" → **Slack**
2. Send notifications for:
   - ✅ Successful registration
   - ⚠️ Partial registration (some systems failed)
   - ❌ Failed registration (all systems failed)

---

## Troubleshooting

### Webhook Not Triggering

1. **Check webhook URL**: Copy from Webhook node configuration
2. **Test locally**: `curl -X POST https://n8n.nexus-io.duckdns.org/webhook/...`
3. **Check n8n logs**: `docker logs n8n`
4. **Verify Docker socket**: `docker exec n8n ls -la /var/run/docker.sock`

### Containers Not Appearing in Dashboard

1. Check `POST /api/docker/register` response:
   ```bash
   curl -X POST https://app.nexus-io.duckdns.org/api/docker/register \
     -H "Content-Type: application/json" \
     -d '{"containerId":"test",...}'
   ```

2. Query database:
   ```bash
   docker exec nexus_postgres psql -U nexus -d nexus_v2 \
     -c "SELECT * FROM ContainerRegistry ORDER BY createdAt DESC LIMIT 5;"
   ```

### Service Status Stuck on "Pending"

1. The current workflow just logs registrations
2. To actually register, implement the service adapters (Traefik, Prometheus, Grafana, etc.)
3. See `docs/n8n-container-automation.md` for detailed adapter implementation

---

## Next Steps

1. ✅ **Create main webhook workflow** (this guide)
2. ⏭️ **Implement service adapters** (advanced):
   - Traefik: Update Docker labels and reload
   - Prometheus: Update scrape config and reload
   - Grafana: Create dashboard via API
   - Kuma: Create monitor via API
   - WireGuard: Generate peer config
   - Loki: Configure log scrape
3. ⏭️ **Add error handling** (try-catch, notifications)
4. ⏭️ **Run Docker event watcher** as sidecar for automatic detection

---

## Resources

- **n8n Docs**: https://docs.n8n.io
- **Webhook Node**: https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.webhook/
- **HTTP Request**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/
- **API Reference**: https://app.nexus-io.duckdns.org/api/docker/
- **Container Dashboard**: https://app.nexus-io.duckdns.org/admin/containers

