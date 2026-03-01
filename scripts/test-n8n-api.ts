#!/usr/bin/env tsx
/**
 * 🔥 NEXUS - TEST N8N API CONNECTIVITY
 * Diagnoses n8n API availability and tests deployment capability
 */

const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlOTlkNTAxYS1jYmM3LTQyMTktODllOS02YzhhYjcyMzAyZDAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiNmJiNWZhNjMtMmYxNS00NjgwLThhOGMtMzgyMmM5ODFkZDBmIiwiaWF0IjoxNzcyNDA4MjIwfQ.R9w4tz3blfT_rsDkZf1kCIkAWxz4Xblw64o0yAhQi60";

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  bright: '\x1b[1m',
};

function log(msg: string, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

async function testApi(url: string, label: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'X-N8N-API-Key': N8N_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const status = response.status;
    const text = await response.text();

    console.log(`\n${colors.cyan}Testing: ${label}${colors.reset}`);
    console.log(`  URL: ${url}`);
    console.log(`  Status: ${status}`);
    console.log(`  Response length: ${text.length} bytes`);

    if (status === 200 && text.includes('data')) {
      log(`  ✅ API is accessible and responding`, colors.green);
      return true;
    } else if (status === 401) {
      log(`  ⚠️  Authentication failed (check API key)`, colors.yellow);
      return false;
    } else if (status === 404) {
      log(`  ⚠️  Endpoint not found (wrong API path)`, colors.yellow);
      console.log(`  Response preview: ${text.substring(0, 100)}`);
      return false;
    } else {
      log(`  ⚠️  Unexpected status code`, colors.yellow);
      console.log(`  Response preview: ${text.substring(0, 100)}`);
      return false;
    }
  } catch (error: any) {
    log(`  ❌ Connection failed: ${error.message}`, colors.red);
    return false;
  }
}

async function main() {
  console.clear();

  log(`
╔════════════════════════════════════════════════════════════════╗
║          🔥 N8N API CONNECTIVITY TEST 🔥                     ║
║                 Diagnostic Report                             ║
╚════════════════════════════════════════════════════════════════╝
  `, colors.bright + colors.blue);

  log(`API Key: ${N8N_API_KEY.substring(0, 30)}...`, colors.cyan);
  console.log('');

  const endpoints = [
    { url: 'https://n8n.nexus-io.duckdns.org/api/v1/workflows', label: 'Public HTTPS (n8n.nexus-io.duckdns.org)' },
    { url: 'https://app.nexus-io.duckdns.org/api/v1/workflows', label: 'App Domain HTTPS (app.nexus-io.duckdns.org)' },
    { url: 'http://localhost:5678/api/v1/workflows', label: 'Local HTTP (localhost:5678)' },
    { url: 'http://n8n:5678/api/v1/workflows', label: 'Docker Internal (n8n:5678)' },
  ];

  let anyWorking = false;

  for (const endpoint of endpoints) {
    const working = await testApi(endpoint.url, endpoint.label);
    if (working) {
      anyWorking = true;
    }
  }

  console.log('\n' + colors.bright + colors.blue + '═'.repeat(64) + colors.reset);

  if (anyWorking) {
    log('\n✅ At least one API endpoint is accessible!', colors.green);
    log('\nRecommendation: Use manual import via n8n UI', colors.cyan);
    console.log(`
Steps:
  1. Open: https://n8n.nexus-io.duckdns.org
  2. Go to Workflows tab
  3. Click '+' → Import from file
  4. Select workflow JSON files from: n8n-workflows/
  5. Click PLAY button to activate each workflow
    `);
  } else {
    log('\n❌ No API endpoints are accessible', colors.red);
    log('\nDiagnostic Steps:', colors.yellow);
    console.log(`
1. Verify n8n is running:
   docker compose ps n8n

2. Check n8n logs:
   docker logs n8n | tail -100

3. Verify DNS resolution:
   nslookup n8n.nexus-io.duckdns.org

4. Check Traefik routing:
   docker logs traefik | grep n8n | tail -20

5. Test from n8n container:
   docker compose exec -T n8n wget -qO- http://localhost:5678/api/v1/workflows

Alternative: Use web browser to manually import workflows
    `);
  }

  console.log('\n' + colors.bright + colors.blue + '═'.repeat(64) + colors.reset + '\n');
}

main().catch(console.error);
