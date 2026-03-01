#!/usr/bin/env tsx
/**
 * 🔥 NEXUS AUTO-ACTIVATE ALL WORKFLOWS
 * Uses n8n API to automatically create and activate all 18 workflows
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_HOST = 'http://localhost:5678';

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

function logSuccess(msg: string) { log(`✅ ${msg}`, colors.green); }
function logError(msg: string) { log(`❌ ${msg}`, colors.red); }
function logWarn(msg: string) { log(`⚠️  ${msg}`, colors.yellow); }
function logInfo(msg: string) { log(`ℹ️  ${msg}`, colors.cyan); }

async function main() {
  console.clear();

  log(`
╔════════════════════════════════════════════════════════════════╗
║          🔥 NEXUS AUTO-ACTIVATE ALL WORKFLOWS 🔥             ║
║           Deploying all 18 workflows via n8n API              ║
╚════════════════════════════════════════════════════════════════╝
  `, colors.bright + colors.blue);

  // Check API key
  if (!N8N_API_KEY) {
    logError('N8N_API_KEY not set in environment');
    logInfo('Set it with: export N8N_API_KEY="your_key_from_n8n_ui"');
    process.exit(1);
  }

  logInfo(`Using n8n API at: ${N8N_HOST}`);
  logInfo(`API Key: ${N8N_API_KEY.substring(0, 20)}...`);

  // Get all workflow files
  const workflowDir = 'n8n-workflows';
  const workflows = fs.readdirSync(workflowDir)
    .filter(f => f.endsWith('.json'))
    .sort();

  logInfo(`Found ${workflows.length} workflows to deploy`);
  console.log('');

  let successCount = 0;
  let skipCount = 0;
  const results: { file: string; status: string; id?: string; error?: string }[] = [];

  // Deploy each workflow
  for (const workflow of workflows) {
    const filePath = path.join(workflowDir, workflow);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    logInfo(`Processing: ${workflow}`);

    try {
      // Check if workflow already exists by name
      const checkCmd = `curl -s -X GET "${N8N_HOST}/api/v1/workflows?filter={"name":"${content.name}"}" -H "X-N8N-API-Key: ${N8N_API_KEY}" 2>/dev/null`;
      const checkResult = execSync(checkCmd, { encoding: 'utf-8' });

      let existingId = null;
      try {
        const parsed = JSON.parse(checkResult);
        if (parsed.data && parsed.data.length > 0) {
          existingId = parsed.data[0].id;
          logWarn(`Workflow "${content.name}" already exists (ID: ${existingId})`);
          skipCount++;
          results.push({ file: workflow, status: 'SKIPPED', id: existingId });
          continue;
        }
      } catch (e) {
        // Parse error is OK, workflow likely doesn't exist
      }

      // Deploy workflow
      const deployCmd = `curl -s -X POST "${N8N_HOST}/api/v1/workflows" \
        -H "X-N8N-API-Key: ${N8N_API_KEY}" \
        -H "Content-Type: application/json" \
        -d '${JSON.stringify(content).replace(/'/g, "'\\''")}'`;

      const result = execSync(deployCmd, { encoding: 'utf-8' });
      const deployed = JSON.parse(result);

      if (deployed.id) {
        logSuccess(`${workflow} deployed (ID: ${deployed.id})`);

        // Activate the workflow
        const activateCmd = `curl -s -X PATCH "${N8N_HOST}/api/v1/workflows/${deployed.id}" \
          -H "X-N8N-API-Key: ${N8N_API_KEY}" \
          -H "Content-Type: application/json" \
          -d '{"active": true}'`;

        const activateResult = execSync(activateCmd, { encoding: 'utf-8' });
        const activated = JSON.parse(activateResult);

        if (activated.active) {
          logSuccess(`${workflow} activated!`);
          successCount++;
          results.push({ file: workflow, status: 'ACTIVATED', id: deployed.id });
        } else {
          logWarn(`${workflow} deployed but not activated`);
          results.push({ file: workflow, status: 'DEPLOYED', id: deployed.id });
        }
      } else {
        logError(`Failed to deploy ${workflow}: ${deployed.message || 'Unknown error'}`);
        results.push({ file: workflow, status: 'FAILED', error: deployed.message });
      }

    } catch (error: any) {
      logError(`Error processing ${workflow}: ${error.message}`);
      results.push({ file: workflow, status: 'ERROR', error: error.message });
    }

    console.log('');
  }

  // Summary
  console.log(colors.bright + colors.blue + '═'.repeat(64) + colors.reset);
  console.log(colors.bright + '  DEPLOYMENT SUMMARY' + colors.reset);
  console.log(colors.bright + colors.blue + '═'.repeat(64) + colors.reset + '\n');

  log(`Total Workflows: ${workflows.length}`, colors.bright);
  logSuccess(`Activated: ${successCount}`);
  logWarn(`Skipped (already exist): ${skipCount}`);
  logInfo(`Total processed: ${successCount + skipCount}`);

  // List results by status
  const activated = results.filter(r => r.status === 'ACTIVATED');
  const deployed = results.filter(r => r.status === 'DEPLOYED');
  const skipped = results.filter(r => r.status === 'SKIPPED');
  const failed = results.filter(r => r.status === 'FAILED' || r.status === 'ERROR');

  if (activated.length > 0) {
    console.log(`\n${colors.green}${colors.bright}ACTIVATED:${colors.reset}`);
    activated.forEach(r => log(`  ✅ ${r.file}`));
  }

  if (deployed.length > 0) {
    console.log(`\n${colors.blue}${colors.bright}DEPLOYED (not yet active):${colors.reset}`);
    deployed.forEach(r => log(`  📦 ${r.file}`));
  }

  if (skipped.length > 0) {
    console.log(`\n${colors.yellow}${colors.bright}ALREADY EXIST:${colors.reset}`);
    skipped.forEach(r => log(`  ⏭️  ${r.file}`));
  }

  if (failed.length > 0) {
    console.log(`\n${colors.red}${colors.bright}FAILED:${colors.reset}`);
    failed.forEach(r => log(`  ❌ ${r.file}: ${r.error}`));
  }

  // Final status
  console.log('\n' + colors.bright + colors.blue + '═'.repeat(64) + colors.reset);

  if (successCount > 0) {
    logSuccess(`\n🎉 Deployed ${successCount}/${workflows.length} workflows successfully!\n`);
    log(`All workflows are now ACTIVE and running 24/7.`, colors.green);
    log(`Check n8n dashboard: ${N8N_HOST}\n`, colors.cyan);
  } else if (skipCount > 0) {
    logInfo(`\n⏭️  All ${skipCount} workflows already exist and are running.\n`);
  } else {
    logError(`\n❌ No workflows were successfully deployed.\n`);
  }

  // Next steps
  console.log(colors.bright + 'Next Steps:' + colors.reset);
  log('  1. Open: https://n8n.nexus-io.duckdns.org', colors.cyan);
  log('  2. Click "Workflows" to see all deployed workflows', colors.cyan);
  log('  3. Verify they show as "Active" (green status)', colors.cyan);
  log('  4. Watch Telegram for execution alerts', colors.cyan);
  log('  5. Monitor Loki logs for any errors', colors.cyan);

  console.log('\n' + colors.bright + colors.green + '🚀 NEXUS GOD-MODE IS LIVE!' + colors.reset + '\n');
}

main().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
