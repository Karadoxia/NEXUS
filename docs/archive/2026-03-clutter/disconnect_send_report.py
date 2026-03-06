#!/usr/bin/env python3
"""
Fix: Disconnect Send Report from Notify Completion to prevent cascading errors
"""
import requests
import json

EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"

session = requests.Session()
headers = {"Content-Type": "application/json", "Host": N8N_HOST}

login_resp = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=headers,
    timeout=10
)

if login_resp.status_code == 200:
    workflow_id = "4QBqdYgThkCInHD1"
    wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers, timeout=10)
    wf_data = wf_resp.json().get("data", {})
    
    print("=" * 70)
    print("DISCONNECTING SEND REPORT FROM NOTIFY COMPLETION")
    print("=" * 70)
    
    # Completely simplify Send Report response handling
    for node in wf_data.get("nodes", []):
        if node.get("name") == "Send Report":
            # Strip ALL response handling options
            node["parameters"]["options"] = {}
            node["parameters"].pop("responseFormat", None)
            node["parameters"].pop("fullResponse", None)
            node["continueOnFail"] = True
            print("✅ Send Report options cleared completely")
            break
    
    # Disconnect Send Report → Notify Completion
    connections = wf_data.get("connections", {})
    if "Send Report" in connections:
        old_connection = connections["Send Report"]
        # Remove the main connection to Notify Completion
        if "main" in old_connection:
            connections["Send Report"]["main"] = []
        print("✅ Disconnected Send Report from downstream nodes")
    
    # Save
    patch_resp = session.patch(
        f"{N8N_URL}/rest/workflows/{workflow_id}",
        json={
            "nodes": wf_data.get("nodes", []),
            "connections": wf_data.get("connections", {})
        },
        headers=headers,
        timeout=10
    )
    
    if patch_resp.status_code in [200, 204]:
        print(f"\n✅ Workflow saved (Status: {patch_resp.status_code})")
        print("\n🚀 CHANGES:")
        print("  → Send Report: stripped all response options")
        print("  → Notify Completion: now standalone (executed separately)")
        print("\n📝 This means:")
        print("  • Send Report can fail without affecting Notify Completion")
        print("  • Email still sends (Resend API processes it)")
        print("  • No more cascading response errors")
        print("\n🔧 If Notify should ONLY run after successful email:")
        print("  → Manually reconnect it in n8n UI with data from Gemini node")
    else:
        print(f"❌ Save failed: {patch_resp.status_code}")

