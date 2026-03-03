#!/usr/bin/env python3

"""
🔧 FIX: Make Workflows Visible in n8n Dashboard
Populates workflow_history and workflow_published_version tables
"""

import subprocess
import json
import uuid
from datetime import datetime

class Colors:
    BLUE = '\033[0;34m'
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    MAGENTA = '\033[0;35m'
    END = '\033[0m'

def log_header(msg):
    print(f"\n{Colors.BLUE}╔════════════════════════════════════════════════════════════╗{Colors.END}")
    print(f"{Colors.BLUE}║ {msg}{Colors.END}")
    print(f"{Colors.BLUE}╚════════════════════════════════════════════════════════════╝{Colors.END}\n")

def log_success(msg):
    print(f"{Colors.GREEN}✅ {msg}{Colors.END}")

def log_error(msg):
    print(f"{Colors.RED}❌ {msg}{Colors.END}")

def log_info(msg):
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.END}")

def run_psql(sql):
    """Execute PostgreSQL command"""
    try:
        result = subprocess.run(
            ['docker-compose', 'exec', '-T', 'postgres',
             'psql', '-U', 'nexus', '-d', 'n8n', '-c', sql],
            capture_output=True,
            text=True,
            timeout=10
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def main():
    log_header("🔧 FIXING WORKFLOW VISIBILITY IN n8n")

    # Step 1: Get all workflows
    log_info("Step 1: Fetching workflows from database...")

    sql = "SELECT id, name FROM workflow_entity ORDER BY \"createdAt\" DESC LIMIT 18;"
    success, stdout, _ = run_psql(sql)

    workflows = []
    if success and stdout:
        lines = stdout.strip().split('\n')[2:-1]
        for line in lines:
            parts = line.split('|')
            if len(parts) >= 2:
                workflow_id = parts[0].strip()
                name = parts[1].strip()
                if workflow_id and name:
                    workflows.append((workflow_id, name))

    log_success(f"Found {len(workflows)} workflows")

    if not workflows:
        log_error("No workflows found!")
        return

    # Step 2: For each workflow, create history and published_version entries
    log_header("📝 STEP 2: CREATING WORKFLOW HISTORY & PUBLISHED VERSIONS")

    counter = 0
    for workflow_id, workflow_name in workflows:
        try:
            # Generate version ID
            version_id = str(uuid.uuid4())

            # Step 2a: Insert into workflow_history (n8n requires this)
            sql = f"""
            INSERT INTO workflow_history (
              "workflowId", "versionId", nodes, connections, settings,
              "createdAt", "updatedAt"
            )
            VALUES (
              '{workflow_id}',
              '{version_id}',
              '[]'::json,
              '{{}}'::json,
              '{{}}'::json,
              NOW(),
              NOW()
            ) ON CONFLICT DO NOTHING;
            """

            success1, _, _ = run_psql(sql)

            # Step 2b: Insert into workflow_published_version
            sql = f"""
            INSERT INTO workflow_published_version (
              "workflowId", "publishedVersionId", "createdAt", "updatedAt"
            )
            VALUES (
              '{workflow_id}',
              '{version_id}',
              NOW(),
              NOW()
            ) ON CONFLICT DO NOTHING;
            """

            success2, _, _ = run_psql(sql)

            # Step 2c: Update workflow_entity to reference published version
            sql = f"""
            UPDATE workflow_entity
            SET "activeVersionId" = '{version_id}'
            WHERE id = '{workflow_id}' AND "activeVersionId" IS NULL;
            """

            success3, _, _ = run_psql(sql)

            if success1 and success2 and success3:
                counter += 1
                print(f"\r  {Colors.MAGENTA}Publishing: {counter}/{len(workflows)}{Colors.END}", end='', flush=True)

        except Exception as e:
            log_error(f"Error processing workflow {workflow_id}: {e}")

    print()
    log_success(f"Published {counter}/{len(workflows)} workflows")

    # Step 3: Clear n8n cache and restart
    log_header("🔄 STEP 3: RESTARTING n8n TO APPLY CHANGES")

    log_info("Stopping n8n...")
    subprocess.run(['docker-compose', 'down', 'n8n'], capture_output=True)

    import time
    time.sleep(2)

    log_info("Starting n8n...")
    subprocess.run(['docker-compose', 'up', '-d', 'n8n'], capture_output=True)

    log_info("Waiting for n8n to boot...")
    time.sleep(10)

    log_success("n8n restarted")

    # Step 4: Verify
    log_header("📊 STEP 4: VERIFICATION")

    sql = "SELECT COUNT(*) FROM workflow_history;"
    success, stdout, _ = run_psql(sql)
    history_count = 0
    if success and stdout:
        try:
            history_count = int(stdout.split('\n')[-2].strip())
        except:
            pass

    sql = "SELECT COUNT(*) FROM workflow_published_version;"
    success, stdout, _ = run_psql(sql)
    published_count = 0
    if success and stdout:
        try:
            published_count = int(stdout.split('\n')[-2].strip())
        except:
            pass

    log_success(f"Workflow history entries: {history_count}")
    log_success(f"Published versions: {published_count}")

    # Final summary
    log_header("🎉 WORKFLOW VISIBILITY FIX COMPLETE")

    if history_count >= 18 and published_count >= 18:
        log_success("✨ ALL 18 WORKFLOWS SHOULD NOW BE VISIBLE IN n8n DASHBOARD!")
        log_info("")
        log_info("📍 Next Steps:")
        log_info("1. Open http://localhost:5678 in your browser")
        log_info("2. Refresh the page (Ctrl+R)")
        log_info("3. All 18 workflows should appear in the left sidebar")
        log_info("4. Click any workflow to view and test it")
        log_info("")
    else:
        log_error(f"⚠️  Not all workflows were published correctly")

    print()

if __name__ == "__main__":
    main()

