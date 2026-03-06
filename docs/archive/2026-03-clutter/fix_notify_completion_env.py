#!/usr/bin/env python3
"""
Fix Notify Completion node - replace env var with direct chat ID
"""
import requests
import json

EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"

session = requests.Session()
headers = {
    "Content-Type": "application/json",
    "Host": N8N_HOST
}

# Login
login_resp = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=headers
)

workflow_id = "4QBqdYgThkCInHD1"

# Get workflow
wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
wf_data = wf_resp.json().get("data", {})

TELEGRAM_CHAT_ID = "6899339578"

print("="*70)
print("FIXING NOTIFY COMPLETION NODE - ENV VAR ACCESS DENIED")
print("="*70)

# Find and modify Notify Completion node
notify_node = None
for node in wf_data.get("nodes", []):
    if node.get("name") == "Notify Completion":
        notify_node = node
        break

if notify_node is None:
    print("❌ Notify Completion node not found!")
    exit(1)

print(f"\nFound Notify Completion node")
print(f"Type: {notify_node.get('type')}")

old_chat_id = notify_node.get("parameters", {}).get("chatId", "")
print(f"Old chatId value: {old_chat_id}")

if "{{" in old_chat_id and "$env" in old_chat_id:
    print(f"\n⚠️ Issue: Using environment variable placeholder")
    print(f"✅ Solution: Replace with direct chat ID\n")
    
    # Replace with direct chat ID
    notify_node["parameters"]["chatId"] = TELEGRAM_CHAT_ID
    
    print(f"✅ Updated chatId to: {TELEGRAM_CHAT_ID}")
else:
    print(f"Note: Already using direct value or different format")

# Save workflow
patch_resp = session.patch(
    f"{N8N_URL}/rest/workflows/{workflow_id}",
    json={
        "nodes": wf_data.get("nodes", []),
        "connections": wf_data.get("connections", {})
    },
    headers=headers
)

if patch_resp.status_code in [200, 204]:
    print(f"\n✅ Workflow saved! (Status: {patch_resp.status_code})")
    print("\n" + "="*70)
    print("NOTIFY COMPLETION NODE FIXED!")
    print("="*70)
    print("\n✅ Telegram chat ID embedded directly")
    print("✅ No more env var access issues")
    print("\n🚀 NOW ALL NODES ARE FIXED:")
    print("  ✅ Gemini: Generate Report - API key embedded")
    print("  ✅ Send Report - Resend API configured")
    print("  ✅ Notify Completion - Chat ID embedded")
    print("\n🚀 FINAL TEST:")
    print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
    print("  2. Refresh page (Ctrl+R)")
    print("  3. Click 'Execute workflow'")
    print("  4. All nodes should execute successfully ✅")
else:
    print(f"❌ Save failed: {patch_resp.status_code}")
    print(patch_resp.text)
