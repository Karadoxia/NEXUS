#!/usr/bin/env node

// Simple n8n workflow agent. Reads WORKFLOW_ID from env and exposes
// a minimal HTTP API to run/health-check the workflow. Can be extended
// with monitoring, alerts, etc.

const http = require('http');
const fetch = global.fetch;

const API_KEY = process.env.N8N_API_KEY;
const N8N_HOST = process.env.N8N_HOST || 'http://n8n:5678';
const WORKFLOW_ID = process.env.WORKFLOW_ID;
const WORKFLOW_NAME = process.env.WORKFLOW_NAME || WORKFLOW_ID;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = process.env.AGENT_PORT || 0; // 0=ephemeral

if (!API_KEY || !WORKFLOW_ID) {
  console.error('Missing required environment variables: N8N_API_KEY or WORKFLOW_ID');
  process.exit(1);
}

async function apiRequest(path, options = {}) {
  const url = `${N8N_HOST}${path}`;
  const res = await fetch(url, {
    headers: {
      'X-N8N-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

async function triggerWorkflow() {
  return await apiRequest(`/rest/workflows/${WORKFLOW_ID}?active=true`, { method: 'PATCH', body: JSON.stringify({}) });
}

async function runOnce() {
  return await apiRequest(`/rest/workflows/${WORKFLOW_ID}/run`, { method: 'POST', body: JSON.stringify({}) });
}

async function health() {
  try {
    const wf = await apiRequest(`/rest/workflows/${WORKFLOW_ID}`);
    return { ok: true, workflowName: wf.data?.name };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/run' && req.method === 'POST') {
    try {
      const data = await runOnce();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  } else if (req.url === '/health') {
    const h = await health();
    res.writeHead(h.ok ? 200 : 500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(h));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  const addr = server.address();
  console.log(`agent for workflow "${WORKFLOW_NAME}" (${WORKFLOW_ID}) listening on port ${addr.port}`);
});
