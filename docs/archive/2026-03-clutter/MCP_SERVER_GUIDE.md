# n8n MCP (Model Context Protocol) Server - Setup Guide

## Overview

The MCP Server enables Claude and other AI models to interact with n8n workflows via REST API. This allows you to:
- List and manage workflows programmatically
- Execute workflows with custom data
- Monitor workflow status
- Integrate n8n with Claude Code and other AI tools

---

## Architecture

```
Claude Code / AI Model
        ↓
    MCP Server (Port 3000)
        ↓
    n8n API (Port 5678)
        ↓
    Workflows (Postgres, Email, Telegram, etc.)
```

---

## Starting the MCP Server

### Option 1: With Docker Compose (Recommended)

```bash
cd /home/redbend/Desktop/Local-Projects/NEXUS-V2

# Start all services including MCP
docker-compose up -d

# Verify MCP is running
curl http://localhost:3000/mcp/health
```

### Option 2: Standalone Node.js

```bash
# Install dependencies
npm install

# Set environment variables
export N8N_API_BASE="http://localhost:5678/api/v1"
export N8N_API_KEY="your-n8n-api-key"
export MCP_PORT=3000

# Run MCP server
node mcp-server.js
```

---

## Configuration

### Environment Variables

```bash
# Required
N8N_API_BASE=http://n8n:5678/api/v1      # n8n API endpoint
N8N_API_KEY=your-api-key-here            # n8n API key (from .n8n-api-key.txt)

# Optional
MCP_PORT=3000                            # Port to run MCP server on (default: 3000)
NODE_ENV=production                      # Node environment (production/development)
```

### Getting the n8n API Key

The API key is stored in:
```
/home/redbend/Desktop/Local-Projects/NEXUS-V2/.n8n-api-key.txt
```

Or retrieve from n8n UI:
1. Open: http://nexus-n8n.local/
2. Settings → Account → API Keys
3. Generate new API key if needed
4. Copy to `.env` or set as environment variable

---

## API Endpoints

### 1. Health Check
```bash
GET /mcp/health

# Response
{
  "success": true,
  "status": "healthy",
  "version": "1.0.0",
  "n8nConnected": true
}
```

### 2. List Workflows
```bash
GET /mcp/workflows

# Response
{
  "success": true,
  "data": [
    {
      "id": "01-stripe-order-fulfillment",
      "name": "🚀 NEXUS - Stripe Order Fulfillment v3 FULL POWER",
      "active": true,
      "createdAt": "2026-03-02T...",
      "updatedAt": "2026-03-02T..."
    },
    ...
  ],
  "count": 18
}
```

### 3. Execute Workflow
```bash
POST /mcp/execute/{workflowId}
Content-Type: application/json

{
  "data": {
    "orderId": "12345",
    "customerEmail": "user@example.com",
    "amount": 99.99
  }
}

# Response
{
  "success": true,
  "workflowId": "01-stripe-order-fulfillment",
  "result": {
    "status": "executed",
    "executionTime": 2345,
    "output": {...}
  }
}
```

---

## Usage Examples

### Example 1: Check if MCP is Running

```bash
curl -s http://localhost:3000/mcp/health | jq
```

### Example 2: List All Workflows

```bash
curl -s http://localhost:3000/mcp/workflows | jq '.data[] | {id, name, active}'
```

### Example 3: Execute Site Audit Workflow

```bash
curl -X POST http://localhost:3000/mcp/execute/17-site-audit-bot \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "auditType": "full",
      "includeDatabase": true,
      "includeSecurity": true
    }
  }' | jq
```

### Example 4: Execute Churn Predictor

```bash
curl -X POST http://localhost:3000/mcp/execute/16-churn-predictor \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "analysisDate": "2026-03-02",
      "includeRecommendations": true
    }
  }' | jq
```

---

## Accessing from Claude Code

### 1. Add MCP Server to Claude Code Config

Create or update `~/.claude/claude.json`:

```json
{
  "mcp_servers": {
    "n8n": {
      "command": "curl",
      "args": ["http://nexus-mcp.local/mcp/health"]
    }
  }
}
```

### 2. Use in Claude Code

```typescript
// In Claude Code, you can now call MCP endpoints
const response = await fetch('http://nexus-mcp.local/mcp/workflows');
const workflows = await response.json();

// Execute a workflow
const result = await fetch(
  'http://nexus-mcp.local/mcp/execute/16-churn-predictor',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: {...} })
  }
);
```

---

## Accessing via Network

### Local Access
- Health: `http://nexus-mcp.local/mcp/health`
- Workflows: `http://nexus-mcp.local/mcp/workflows`
- Execute: `http://nexus-mcp.local/mcp/execute/{workflowId}`

### Public Access (via Traefik)
- Health: `https://mcp.nexus-io.duckdns.org/mcp/health`
- Workflows: `https://mcp.nexus-io.duckdns.org/mcp/workflows`
- Execute: `https://mcp.nexus-io.duckdns.org/mcp/execute/{workflowId}`

---

## Monitoring MCP Server

### Check Container Status
```bash
docker ps | grep n8n_mcp

# Check logs
docker logs -f n8n_mcp
```

### Monitor Health
```bash
# Continuous health check
watch -n 5 'curl -s http://localhost:3000/mcp/health | jq .'
```

### Performance Metrics
```bash
# View resource usage
docker stats n8n_mcp
```

---

## Troubleshooting

### MCP Server Not Responding

```bash
# 1. Check if container is running
docker ps | grep n8n_mcp

# 2. Check logs for errors
docker logs n8n_mcp

# 3. Verify n8n is accessible
curl http://n8n:5678/api/v1/workflows

# 4. Check API key is valid
echo $N8N_API_KEY
```

### Cannot Connect to n8n

```bash
# Verify n8n container is running
docker ps | grep n8n

# Check n8n logs
docker logs n8n

# Test connectivity
docker exec n8n_mcp curl -v http://n8n:5678/api/v1/workflows
```

### API Key Issues

```bash
# Get current API key from n8n
docker exec n8n cat /home/node/.n8n/.n8n_api_key 2>/dev/null || echo "No key found"

# Or retrieve from file
cat /home/redbend/Desktop/Local-Projects/NEXUS-V2/.n8n-api-key.txt
```

---

## Security Considerations

1. **API Key Protection**: Never commit the API key to Git
   - Store in `.env` or environment variables only
   - Use secrets in docker-compose for production

2. **Network Access**: MCP should only be accessible to authorized systems
   - Restrict to internal network in production
   - Use Traefik authentication if exposed publicly

3. **Rate Limiting**: Consider adding rate limiting for production use
   - Protect against abuse
   - Implement API quotas

---

## Performance Tuning

### Increase Timeouts for Large Workflows
```javascript
// In mcp-server.js
const REQUEST_TIMEOUT = 30000; // 30 seconds
```

### Handle Concurrent Requests
```javascript
// The server handles concurrent requests via Node.js event loop
// For high-traffic scenarios, consider:
// - Load balancing across multiple MCP instances
// - Using PM2 for process management
```

---

## Integration with Claude Code

### Enable n8n in Claude Code

1. Open Claude Code settings
2. Add MCP server:
   ```
   Type: HTTP
   URL: http://nexus-mcp.local
   ```

3. Use in prompts:
   ```
   "List all workflows and execute the site audit workflow"
   ```

Claude Code will automatically:
- Fetch available workflows
- Execute them with specified parameters
- Return results to your conversation

---

## Production Deployment

### Recommended Setup

```bash
# 1. Enable MCP in docker-compose
docker-compose up -d n8n n8n-mcp

# 2. Set strong API key
export N8N_API_KEY=$(head -c 32 /dev/urandom | base64)

# 3. Configure Traefik routing
# (Already configured in docker-compose.yml)

# 4. Monitor with health checks
curl https://mcp.nexus-io.duckdns.org/mcp/health

# 5. Set up alerts for failures
# (See monitoring guide)
```

---

## Support & Documentation

- **n8n API Docs**: https://docs.n8n.io/api/
- **MCP Spec**: https://spec.anthropic.com/en/overview
- **Docker Docs**: https://docs.docker.com/

---

**Status**: ✅ MCP Server Ready
**Version**: 1.0.0
**Last Updated**: March 2, 2026
