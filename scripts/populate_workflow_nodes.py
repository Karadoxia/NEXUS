#!/usr/bin/env python3

"""
📝 POPULATE WORKFLOW NODES
Fills workflows with actual node definitions from JSON files
"""

import json
import subprocess
from pathlib import Path

class Colors:
    BLUE = '\033[0;34m'
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    MAGENTA = '\033[0;35m'
    END = '\033[0m'

def log_header(msg):
    print(f"\n{Colors.BLUE}╔════════════════════════════════════════════════════════════╗{Colors.END}")
    print(f"{Colors.BLUE}║ {msg}{Colors.END}")
    print(f"{Colors.BLUE}╚════════════════════════════════════════════════════════════╝{Colors.END}\n")

def log_success(msg):
    print(f"{Colors.GREEN}✅ {msg}{Colors.END}")

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
    log_header("📝 POPULATING WORKFLOW NODES & CONNECTIONS")

    workflows_dir = Path("n8n-workflows")
    workflow_files = sorted(workflows_dir.glob("*.json"))

    updated_count = 0

    for i, workflow_file in enumerate(workflow_files, 1):
        try:
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)

            workflow_name = workflow_data.get('name', workflow_file.stem)

            # Get nodes and connections from JSON
            nodes = workflow_data.get('nodes', [])
            connections = workflow_data.get('connections', {})

            # Convert to JSON strings (properly escaped)
            nodes_json = json.dumps(nodes)
            connections_json = json.dumps(connections)

            # Escape single quotes for SQL
            nodes_json_escaped = nodes_json.replace("'", "''")
            connections_json_escaped = connections_json.replace("'", "''")

            # Find workflow by name in database
            sql = f"""
            UPDATE workflow_history
            SET nodes = '{nodes_json_escaped}'::json,
                connections = '{connections_json_escaped}'::json
            WHERE "workflowId" IN (
              SELECT id FROM workflow_entity
              WHERE name LIKE '%{workflow_name_escaped}%'
              LIMIT 1
            );
            """

            # Also update workflow_entity nodes
            sql2 = f"""
            UPDATE workflow_entity
            SET nodes = '{nodes_json_escaped}'::json,
                connections = '{connections_json_escaped}'::json
            WHERE name LIKE '%{workflow_name_escaped}%'
            LIMIT 1;
            """

            workflow_name_escaped = workflow_name.replace("'", "''")

            success1, _, _ = run_psql(sql2)

            if success1:
                updated_count += 1
                print(f"\r  {Colors.MAGENTA}Updated: {i}/18 workflows{Colors.END}", end='', flush=True)

        except Exception as e:
            pass

    print()
    log_success(f"Updated {updated_count} workflows with node definitions")

    log_header("✅ WORKFLOW NODES POPULATED")
    log_info("Now restart n8n to load the full workflows")
    log_info("docker-compose restart n8n")

if __name__ == "__main__":
    main()

