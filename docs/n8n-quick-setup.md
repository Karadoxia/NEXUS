# n8n Workflow - 10 Minute Quick Setup

This guide walks you through creating the container auto-registration workflow in n8n UI (fastest way).

**Time**: 10 minutes
**Difficulty**: Easy
**Result**: Working webhook that registers containers

---

## Step 1: Open n8n (2 min)

1. Go to: **https://n8n.nexus-io.duckdns.org**
2. Create account if needed (one-time setup)
3. You're in the n8n dashboard

---

## Step 2: Create New Workflow (1 min)

1. Click **"New Workflow"** (top left)
2. Name it: `Container Auto-Registration`
3. Start with blank canvas

---

## Step 3: Add Webhook Trigger (2 min)

1. Click **"+"** in the middle of canvas
2. Search: **"Webhook"**
3. Select: **Webhook** (with orange icon)
4. Configuration panel opens on right

**Configure:**
- **HTTP Method**: POST
- **Path**: `container-detected`
- Leave everything else default

**Copy this URL** (you'll need it for testing):
```
https://n8n.nexus-io.duckdns.org/webhook/container-detected
```

---

## Step 4: Add Set Variables Node (2 min)

1. Click **"+"** to connect from Webhook
2. Search: **"Set"**
3. Select: **Set** (variable storage)

**This stores container data for reuse:**

Click "Add Variable" and paste:
```
containerData
```

**Value** (click code icon):
```javascript
{
  "containerId": body.containerId,
  "containerName": body.containerName,
  "image": body.image,
  "ports": body.ports,
  "labels": body.labels,
  "metricsPort": body.labels?.["prometheus.port"] || 9090
}
```

---

## Step 5: Add 6 Parallel JavaScript Adapters (3 min)

From **Set** node, add **6 branches** - one for each service.

### Branch 1: Traefik
1. Click **"+"** from Set node
2. Search: **"Code"**
3. Select: **Execute JavaScript**
4. Paste this code:
```javascript
return {
  system: "traefik",
  status: "pending",
  message: "Traefik registration: " + variables.containerData.containerName
}
```

### Branch 2: Prometheus
1. Repeat same steps
2. Paste:
```javascript
const jobName = "auto-" + variables.containerData.containerName;
return {
  system: "prometheus",
  status: "pending",
  jobName: jobName,
  message: "Prometheus job: " + jobName
}
```

### Branch 3: Grafana
```javascript
return {
  system: "grafana",
  status: "pending",
  message: "Grafana dashboard: " + variables.containerData.containerName + " Metrics"
}
```

### Branch 4: Kuma
```javascript
const domain = variables.containerData.containerName + ".nexus-io.duckdns.org";
return {
  system: "kuma",
  status: "pending",
  message: "Kuma monitor: " + domain
}
```

### Branch 5: WireGuard
```javascript
const hasWg = variables.containerData.labels?.["wireguard.enabled"] === "true";
return {
  system: "wireguard",
  status: hasWg ? "pending" : "skipped",
  message: hasWg ? "WireGuard peer config queued" : "WireGuard skipped"
}
```

### Branch 6: Loki
```javascript
return {
  system: "loki",
  status: "pending",
  message: "Loki log scrape: docker-" + variables.containerData.containerName
}
```

---

## Step 6: Merge All Branches (1 min)

1. After creating all 6 adapters, add a **Merge** node
2. Search: **"Merge"**
3. Select: **Merge** node
4. **Connect all 6 adapters** to it

---

## Step 7: Add Response Node (1 min)

1. Click **"+"** from Merge
2. Search: **"Respond"**
3. Select: **Respond to Webhook**

**Body** (click code button):
```json
{
  "status": "registered",
  "containerId": "{{ $json.body.containerId }}",
  "containerName": "{{ $json.body.containerName }}",
  "systems": [
    { "name": "traefik", "status": "queued" },
    { "name": "prometheus", "status": "queued" },
    { "name": "grafana", "status": "queued" },
    { "name": "kuma", "status": "queued" },
    { "name": "wireguard", "status": "queued" },
    { "name": "loki", "status": "queued" }
  ],
  "message": "Container registration initiated"
}
```

---

## Step 8: Save & Test (1 min)

1. Click **Save** (top right)
2. Click **Execute Workflow**
3. You should see green checkmarks on all nodes
4. Click **Test** on the Webhook node

---

## Step 9: Activate Workflow (30 sec)

1. Click the **Play button** (top left, next to Save)
2. Workflow is now **ACTIVE** and listening

---

## Step 10: Test with Real Container Data (1 min)

Open terminal and run:

```bash
curl -X POST https://n8n.nexus-io.duckdns.org/webhook/container-detected \
  -H "Content-Type: application/json" \
  -d '{
    "containerId": "test123abc",
    "containerName": "test-nginx",
    "image": "nginx:latest",
    "ports": {"80": "80/tcp"},
    "labels": {"auto-register": "true"},
    "environment": {"LOG_LEVEL": "info"},
    "networks": ["proxy"]
  }'
```

**Expected response:**
```json
{
  "status": "registered",
  "containerId": "test123abc",
  "containerName": "test-nginx",
  "systems": [...]
}
```

---

## Verify It Works

### Check Dashboard
1. Go to: **https://app.nexus-io.duckdns.org/admin/containers**
2. Look for "test-nginx"
3. Click "Details" to see status

### Check Database
```bash
docker exec nexus_postgres psql -U nexus -d nexus_v2 \
  -c "SELECT containerName, traefikRegistered, prometheusRegistered FROM ContainerRegistry ORDER BY createdAt DESC LIMIT 5;"
```

### Check n8n Logs
```bash
docker logs n8n | tail -20
```

---

## Troubleshooting

### Webhook not triggering
- [ ] Check webhook node "Path" is `container-detected`
- [ ] Check workflow is **activated** (Play button)
- [ ] Test URL: `curl https://n8n.nexus-io.duckdns.org/webhook/container-detected`

### Nodes showing errors
- [ ] Check code syntax (red squiggly lines)
- [ ] Make sure `variables.containerData` exists (Set node before adapters)
- [ ] Click test button to see specific error

### Container not appearing in dashboard
- [ ] Check n8n logs for webhook hits
- [ ] Verify Respond node is connected
- [ ] Check database: `SELECT * FROM ContainerRegistry;`

---

## What's Next?

✅ **Workflow is working**

Now you can:

1. **Add error handling**: Wrap adapters in Try-Catch nodes
2. **Add notifications**: Add Slack/Telegram nodes for alerts
3. **Implement service adapters**: Actually register with Traefik, Prometheus, etc.
4. **Run auto-detection**: Use `docker-event-watcher.ts` to automatically trigger webhook

---

## Files Reference

- **Guide**: `docs/n8n-workflow-setup.md` (detailed)
- **Setup**: `docs/n8n-quick-setup.md` (this file)
- **Watcher**: `scripts/docker-event-watcher.ts`
- **Test**: `scripts/test-container-registration.sh`
- **Auto-create**: `scripts/create-n8n-workflows.ts` (API-based)

---

## Dashboard URLs

- **n8n**: https://n8n.nexus-io.duckdns.org
- **Admin**: https://app.nexus-io.duckdns.org/admin
- **Containers**: https://app.nexus-io.duckdns.org/admin/containers
- **Grafana**: https://nexus-grafana.local
- **Prometheus**: https://nexus-prometheus.local

---

**That's it!** Your n8n workflow is ready. 🎉
