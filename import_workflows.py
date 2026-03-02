#!/usr/bin/env python3
"""
Import n8n workflows from JSON files using the n8n API
Workflows are read from n8n-workflows/ directory and imported via HTTP API
"""

import json
import os
import requests
import subprocess
import sys
from pathlib import Path

# Get n8n API key from environment or parameter
API_KEY = os.environ.get('N8N_API_KEY')
if not API_KEY:
    print("❌ ERROR: N8N_API_KEY environment variable not set")
    print("Usage: export N8N_API_KEY='...' && python3 import_workflows.py")
    sys.exit(1)

# n8n API endpoint - use docker network
N8N_API_URL = "http://n8n:5678/api/v1/workflows"
HEADERS = {
    "X-N8N-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

# Workflows to import (in order of dependency)
WORKFLOWS = [
    "00-global-error-notifier.json",
    "01-stripe-order-fulfillment.json",
    "02-abandoned-order-recovery.json",
    "03-daily-sales-report.json",
    "04-security-incident-aggregator.json",
    "05-ai-support-router.json",
    "06-ai-product-upsell.json",
    "07-container-auto-registration-FIXED.json",
    "08-inventory-restock-ai.json",
    "09-review-collection-ai.json",
    "10-performance-monitor.json",
    "11-newsletter-generator.json",
    "12-automated-backup.json",
    "13-seo-optimizer.json",
    "14-fraud-detector.json",
    "15-social-media-poster.json",
    "16-churn-predictor.json",
    "17-site-audit-bot.json",
]

def import_workflow(filepath):
    """Import a single workflow from JSON file"""
    with open(filepath, 'r') as f:
        workflow_data = json.load(f)

    # Clean workflow data - only send fields n8n expects
    payload = {
        "name": workflow_data.get("name", "Unknown"),
        "nodes": workflow_data.get("nodes", []),
        "connections": workflow_data.get("connections", {}),
        "settings": workflow_data.get("settings", {}),
        "tags": workflow_data.get("tags", []),
    }

    filename = os.path.basename(filepath)
    print(f"📤 Importing {filename}... ", end="", flush=True)

    try:
        response = requests.post(N8N_API_URL, json=payload, headers=HEADERS, timeout=10)

        if response.status_code in [200, 201]:
            result = response.json()
            workflow_id = result.get('data', {}).get('id', 'unknown')
            print(f"✅ SUCCESS (ID: {workflow_id})")
            return True
        else:
            print(f"❌ FAILED (HTTP {response.status_code})")
            print(f"   Response: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return False

def main():
    """Import all workflows"""
    workflows_dir = Path("/home/redbend/Desktop/Local-Projects/NEXUS-V2/n8n-workflows")

    if not workflows_dir.exists():
        print(f"❌ ERROR: Workflows directory not found: {workflows_dir}")
        sys.exit(1)

    print(f"🚀 Importing workflows from {workflows_dir}\n")

    success_count = 0
    failed_count = 0

    for workflow_file in WORKFLOWS:
        filepath = workflows_dir / workflow_file

        if not filepath.exists():
            print(f"⚠️  SKIPPED {workflow_file} (file not found)")
            failed_count += 1
            continue

        if import_workflow(filepath):
            success_count += 1
        else:
            failed_count += 1

    print(f"\n{'='*60}")
    print(f"📊 RESULTS: {success_count} imported, {failed_count} failed")
    print(f"{'='*60}")

    return 0 if failed_count == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
