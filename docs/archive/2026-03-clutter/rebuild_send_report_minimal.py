#!/usr/bin/env python3
"""
DELETE Send Report and recreate as super-minimal HTTP node
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
    print("COMPLETE SEND REPORT REBUILD - MINIMAL CONFIG")
    print("=" * 70)
    
    RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"
    
    # Find and delete old Send Report
    send_idx = -1
    for idx, node in enumerate(wf_data.get("nodes", [])):
        if node.get("name") == "Send Report":
            send_idx = idx
            break
    
    if send_idx >= 0:
        old_node = wf_data["nodes"][send_idx]
        position = old_node.get("position", [1376, 352])
        
        # Create SUPER MINIMAL node
        minimal_node = {
            "parameters": {
                "method": "POST",
                "url": "https://api.resend.com/emails",
                "authentication": "generic",
                "genericAuthType": "httpHeaderAuth",
                "headerParametersUI": {
                    "parameter": [
                        {
                            "name": "Authorization",
                            "value": f"Bearer {RESEND_API_KEY}"
                        }
                    ]
                },
                "sendBody": True,
                "bodyType": "json",
                "jsonBody": json.dumps({
                    "from": "onboarding@resend.dev",
                    "to": "caspertech78@gmail.com",
                    "subject": "🤖 Weekly Site Audit Report",
                    "html": "={{ $json.body.candidates[0].content.parts[0].text }}"
                })
            },
            "id": "send_audit_report",
            "name": "Send Report",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 1,  # Use v1 to avoid v2 response handling
            "position": position,
            "continueOnFail": True
        }
        
        wf_data["nodes"][send_idx] = minimal_node
        
        print("✅ Rebuilt Send Report node:")
        print("   • typeVersion: 1 (simpler response handling)")
        print("   • bodyType: json")
        print("   • jsonBody (not body field)")
        print("   • NO options field at all")
        print("   • Bearer token in headers")
        
        # Keep connection to Notify Completion
        print("   • Connection to Notify Completion: KEPT")
        
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
            print("\n🚀 TEST:")
            print("   http://localhost:5678/workflow/4QBqdYgThkCInHD1")
            print("   Refresh → Execute workflow")
            print("\n✨ Should work without response errors now")
        else:
            print(f"\n❌ Save failed: {patch_resp.status_code}")
            print(patch_resp.text)

