#!/usr/bin/env python3
"""
Fix Send Report node - replace environment variable with direct email
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

print("="*70)
print("FIXING SEND REPORT NODE - RECIPIENTS")
print("="*70)

# Find and modify Send Report node
modified = False
for node in wf_data.get("nodes", []):
    if node.get("name") == "Send Report":
        old_email = node.get("parameters", {}).get("toEmail", "")
        print(f"\nFound Send Report node")
        print(f"Old toEmail: {old_email}")
        
        # Replace with direct email
        node["parameters"]["toEmail"] = "caspertech92@gmail.com"
        print(f"New toEmail: caspertech92@gmail.com")
        modified = True
        break

if not modified:
    print("❌ Send Report node not found!")
    exit(1)

# Try to save using PATCH instead of PUT
print("\nSaving workflow...")

# Method 1: Try PATCH with just nodes
patch_data = {
    "nodes": wf_data.get("nodes", []),
    "connections": wf_data.get("connections", {})
}

patch_resp = session.patch(
    f"{N8N_URL}/rest/workflows/{workflow_id}",
    json=patch_data,
    headers=headers
)

if patch_resp.status_code in [200, 204]:
    print(f"✅ Workflow updated! (Status: {patch_resp.status_code})")
    print(f"✅ Send Report recipients fixed!")
    print(f"✅ toEmail = caspertech92@gmail.com")
    print("\n" + "="*70)
    print("ALL FIXES COMPLETE!")
    print("="*70)
    print("\n✅ Gemini: Using embedded API key")
    print("✅ Send Report: Using direct email address")
    print("\n🚀 READY FOR FULL TEST:")
    print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
    print("  2. Refresh page (Ctrl+R)")
    print("  3. Click 'Execute workflow'")
    print("  4. Watch all nodes execute ✅")
else:
    print(f"❌ PATCH failed: {patch_resp.status_code}")
    print(patch_resp.text)
    
    # Try PUT instead
    print("\nTrying PUT method...")
    put_data = wf_data
    put_resp = session.put(
        f"{N8N_URL}/rest/workflows/{workflow_id}",
        json=put_data,
        headers=headers
    )
    
    if put_resp.status_code in [200, 204]:
        print(f"✅ Workflow updated with PUT! (Status: {put_resp.status_code})")
        print(f"✅ Send Report recipients fixed!")
    else:
        print(f"❌ PUT also failed: {put_resp.status_code}")
        print(put_resp.text)
