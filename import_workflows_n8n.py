#!/usr/bin/env python3
"""
Import all n8n workflows via the API using the new owner API key
"""

import json
import requests
import subprocess
from pathlib import Path

# Configuration
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjNjc1YTM2Ny03NjJkLTRkMjctYmQ2MC01NTZiNzczMjMwNmIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZWVjZjg4YWMtZWY2Zi00NzA1LTliNzktODk3ZWRjYmRmMzBlIiwiaWF0IjoxNzcyNDE3MTQ4LCJleHAiOjE3NzQ5Mjk2MDB9.fr1q9WPSN5ZR7JfmYq7g-ZFmH75JLhV8CewPp1c3rNY"
N8N_URL = "http://nexus-n8n.local/api/v1/workflows"

workflows_dir = Path("n8n-workflows")

print("🚀 Importing workflows to n8n via API...")
print(f"API: {N8N_URL}\n")

workflows = [
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

success = 0
failed = 0

for wf_file in workflows:
    filepath = workflows_dir / wf_file

    if not filepath.exists():
        print(f"⚠️  {wf_file} NOT FOUND")
        failed += 1
        continue

    print(f"📤 {wf_file[:40]}... ", end="", flush=True)

    try:
        with open(filepath) as f:
            workflow_data = json.load(f)

        # Prepare payload
        payload = {
            "name": workflow_data.get("name"),
            "nodes": workflow_data.get("nodes", []),
            "connections": workflow_data.get("connections", {}),
            "settings": workflow_data.get("settings", {}),
            "tags": workflow_data.get("tags", []),
        }

        # POST to n8n API
        response = requests.post(
            N8N_URL,
            json=payload,
            headers={"X-N8N-API-KEY": API_KEY},
            timeout=15
        )

        if response.status_code in [200, 201]:
            try:
                result = response.json()
                wf_id = result.get("data", {}).get("id", "?")
                print(f"✅ ({wf_id[:12]}...)")
                success += 1
            except:
                print(f"✅")
                success += 1
        else:
            print(f"❌ HTTP {response.status_code}")
            failed += 1
    except Exception as e:
        print(f"❌ {str(e)[:50]}")
        failed += 1

print()
print("=" * 70)
print(f"✅ IMPORTED: {success} | ❌ FAILED: {failed}")
print("=" * 70)

if failed == 0:
    print("\n🎉 All workflows imported successfully!")
    print("🌐 Access n8n at: http://nexus-n8n.local/home/workflows")
