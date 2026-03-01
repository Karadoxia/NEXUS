#!/usr/bin/env python3
"""
🔥 NEXUS - IMPORT ALL 18 WORKFLOWS DIRECTLY TO N8N DATABASE
This script imports workflow JSON files directly to the PostgreSQL n8n database.
"""

import json
import os
import sys
import psycopg2
from pathlib import Path
from datetime import datetime
import uuid

# Configuration
WORKFLOW_DIR = "n8n-workflows"
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "nexus")
DB_NAME = "n8n"
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

# Color codes
GREEN = '\033[0;32m'
RED = '\033[0;31m'
YELLOW = '\033[1;33m'
CYAN = '\033[0;36m'
BLUE = '\033[0;34m'
RESET = '\033[0m'

def print_header():
    print(f"""
{BLUE}╔════════════════════════════════════════════════════════════════╗{RESET}
{BLUE}║   🔥 NEXUS DIRECT DATABASE IMPORT - ALL 18 WORKFLOWS 🔥      ║{RESET}
{BLUE}║          Importing directly to PostgreSQL n8n DB             ║{RESET}
{BLUE}╚════════════════════════════════════════════════════════════════╝{RESET}
""")

def connect_db():
    """Connect to PostgreSQL n8n database"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        return conn
    except Exception as e:
        print(f"{RED}❌ Database connection failed: {e}{RESET}")
        return None

def import_workflow(conn, workflow_json, workflow_name):
    """Import a single workflow to the database"""
    try:
        with conn.cursor() as cur:
            # Generate IDs
            workflow_id = ''.join(str(uuid.uuid4()).split('-')[:3])  # n8n style ID
            now = datetime.utcnow()

            # Insert into workflow_entity table
            query = """
            INSERT INTO workflow_entity (
                id, name, nodes, connections, active, "staticData",
                "createdAt", "updatedAt",
                settings, "triggerCount", "versionId"
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
            """

            # Extract data from workflow JSON
            nodes = json.dumps(workflow_json.get('nodes', []))
            connections = json.dumps(workflow_json.get('connections', {}))
            settings = json.dumps(workflow_json.get('settings', {}))

            cur.execute(query, (
                workflow_id,
                workflow_name,
                nodes,
                connections,
                True,  # active
                None,  # staticData
                now,   # createdAt
                now,   # updatedAt
                settings,
                0,     # triggerCount
                None   # versionId
            ))

            conn.commit()
            return workflow_id
    except Exception as e:
        print(f"{RED}Error importing {workflow_name}: {e}{RESET}")
        return None

def main():
    print_header()

    # Check workflow directory
    if not os.path.isdir(WORKFLOW_DIR):
        print(f"{RED}❌ Workflow directory not found: {WORKFLOW_DIR}{RESET}")
        sys.exit(1)

    # List of workflows
    workflows = [
        "00-global-error-notifier",
        "01-stripe-order-fulfillment",
        "02-abandoned-order-recovery",
        "03-daily-sales-report",
        "04-security-incident-aggregator",
        "05-ai-support-router",
        "06-ai-product-upsell",
        "07-container-auto-registration-FIXED",
        "08-inventory-restock-ai",
        "09-review-collection-ai",
        "10-performance-monitor",
        "11-newsletter-generator",
        "12-automated-backup",
        "13-seo-optimizer",
        "14-fraud-detector",
        "15-social-media-poster",
        "16-churn-predictor",
        "17-site-audit-bot"
    ]

    print(f"{CYAN}📊 Configuration:{RESET}")
    print(f"  Database: {DB_NAME} (host: {DB_HOST})")
    print(f"  Workflows: {len(workflows)}")
    print(f"  Directory: {WORKFLOW_DIR}")
    print("")

    # Connect to database
    conn = connect_db()
    if not conn:
        sys.exit(1)

    print(f"{BLUE}═══════════════════════════════════════════════════════════════{RESET}")
    print(f"{BLUE}IMPORTING WORKFLOWS{RESET}")
    print(f"{BLUE}═══════════════════════════════════════════════════════════════{RESET}")
    print("")

    success_count = 0
    fail_count = 0

    for workflow_name in workflows:
        workflow_file = f"{WORKFLOW_DIR}/{workflow_name}.json"

        if not os.path.isfile(workflow_file):
            print(f"{RED}❌ {workflow_name}: File not found{RESET}")
            fail_count += 1
            continue

        try:
            with open(workflow_file, 'r') as f:
                workflow_json = json.load(f)

            print(f"{CYAN}📦 {workflow_name}...{RESET}", end=" ")

            workflow_id = import_workflow(conn, workflow_json, workflow_name)
            if workflow_id:
                print(f"{GREEN}✅ Imported (ID: {workflow_id}){RESET}")
                success_count += 1
            else:
                print(f"{RED}❌ Failed{RESET}")
                fail_count += 1
        except json.JSONDecodeError as e:
            print(f"{RED}❌ Invalid JSON: {e}{RESET}")
            fail_count += 1
        except Exception as e:
            print(f"{RED}❌ Error: {e}{RESET}")
            fail_count += 1

    conn.close()

    print("")
    print(f"{BLUE}═══════════════════════════════════════════════════════════════{RESET}")
    print(f"{BLUE}RESULTS{RESET}")
    print(f"{BLUE}═══════════════════════════════════════════════════════════════{RESET}")
    print("")
    print(f"{GREEN}✅ Successfully imported: {success_count} workflows{RESET}")
    print(f"{RED}❌ Failed: {fail_count} workflows{RESET}")
    print("")

    if success_count > 0:
        print(f"{GREEN}🎉 {success_count} workflows are now in n8n database!{RESET}")
        print("")
        print("Next steps:")
        print(f"  1. Open: https://n8n.nexus-io.duckdns.org")
        print(f"  2. Go to: Workflows tab")
        print(f"  3. Refresh: Page (F5)")
        print(f"  4. Verify: All {success_count} workflows appear in the list")
        print(f"  5. Activate: Click PLAY button on each workflow")

    sys.exit(0 if fail_count == 0 else 1)

if __name__ == "__main__":
    main()
