#!/usr/bin/env node

// Generates a docker-compose fragment listing one agent service per workflow.
// Usage: `node scripts/generate-agents.js` (requires N8N_API_KEY env or file).

const fs = require('fs');
const path = require('path');

async function main() {
  let apiKey = process.env.N8N_API_KEY;
  if (!apiKey) {
    const p = path.join(__dirname, '../app/n8n-API');
    if (fs.existsSync(p)) apiKey = fs.readFileSync(p, 'utf8').trim();
  }
  if (!apiKey) {
    console.error('n8n API key not found (set N8N_API_KEY or create app/n8n-API)');
    process.exit(1);
  }
  const host = process.env.N8N_HOST || 'http://localhost:5678';
  console.log('fetching workflow list from', host);
  const res = await fetch(`${host}/api/v1/workflows?limit=100`, {
    headers: { 'X-N8N-API-KEY': apiKey }
  });
  const data = await res.json();
  const workflows = data.data || [];

  const services = {};
  workflows.forEach((wf, idx) => {
    const slug = wf.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || wf.id.slice(0,6);
    const name = `agent-${slug}`;
    services[name] = {
      build: { context: '.', dockerfile: 'Dockerfile.agent' },
      environment: [
        `WORKFLOW_ID=${wf.id}`,
        `WORKFLOW_NAME=${wf.name.replace(/"/g,'\\"')}`,
        `N8N_API_KEY=${apiKey}`,
        `N8N_HOST=${process.env.N8N_HOST || 'http://n8n:5678'}`,
        `ADMIN_EMAIL=${process.env.ADMIN_EMAIL || ''}`,
        `TELEGRAM_CHAT_ID=${process.env.TELEGRAM_CHAT_ID || ''}`
      ],
      depends_on: ['n8n'],
    };
  });

  const yaml = require('js-yaml');
  const output = yaml.dump({ services }, { lineWidth: -1 });
  fs.writeFileSync('docker-compose.agents.yml', output);
  console.log(`generated docker-compose.agents.yml with ${workflows.length} services`);
}

main().catch(err=>{console.error(err);process.exit(1);});