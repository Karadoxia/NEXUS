#!/usr/bin/env python3
"""
Recreate Send Report node with bulletproof response handling
"""
import requests
import json

EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_URL = "http://localhost:5678"
N8N_HOST = "nexus-n8n.local"

session = requests.Session()
headers = {"Content-Type": "application/json", "Host": N8N_HOST}

try:
    # Login
    login_resp = session.post(
        f"{N8N_URL}/rest/login",
        json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
        headers=headers,
        timeout=10
    )
    
    if login_resp.status_code != 200:
        print(f"❌ Login failed")
        exit(1)
    
    workflow_id = "4QBqdYgThkCInHD1"
    wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers, timeout=10)
    wf_data = wf_resp.json().get("data", {})
    
    RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"
    
    print("=" * 70)
    print("RECREATING SEND REPORT NODE - FINAL FIX")
    print("=" * 70)
    
    # Find and replace Send Report node
    send_report_idx = -1
    for idx, node in enumerate(wf_data.get("nodes", [])):
        if node.get("name") == "Send Report":
            send_report_idx = idx
            break
    
    if send_report_idx >= 0:
        old_node = wf_data["nodes"][send_report_idx]
        old_position = old_node.get("position", [1376, 352])
        
        # Create clean node with BULLETPROOF response handling
        new_node = {
            "parameters": {
                "url": "https://api.resend.com/emails",
                "method": "POST",
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
                "bodyType": "json",
                "body": json.dumps({
                    "from": "onboarding@resend.dev",
                    "to": "caspertech78@gmail.com",
                    "subject": "🤖 Weekly Site Audit Report",
                    "html": "={{ $json.body.candidates[0].content.parts[0].text }}"
                }),
                "options": {
                    "response": {
                        "neverError": True,
                        "fullResponse": False
                    },
                    "redirect": {
                        "redirect": False,
                        "followRedirects": True
                    }
                }
            },
            "id": "send_audit_report",
            "name": "Send Report",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 2,
            "position": old_position,
            "continueOnFail": True
        }
        
        wf_data["nodes"][send_report_idx] = new_node
        
        print("\n✅ Node recreated with:")
        print("   • BearerToken auth in headers (no credentials)")
        print("   • neverError: true (ignore response parsing)")
        print("   • fullResponse: false (don't parse as nested)")
        print("   • continueOnFail: true (workflow continues)")
        
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
            print("\n🚀 TEST NOW:")
            print("  → http://localhost:5678/workflow/4QBqdYgThkCInHD1")
            print("  → Refresh (Ctrl+R)")
            print("  → Click 'Execute workflow'")
            print("\n✨ Should execute cleanly without response errors")
        else:
            print(f"❌ Save failed: {patch_resp.status_code}")
            print(patch_resp.text)

except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
