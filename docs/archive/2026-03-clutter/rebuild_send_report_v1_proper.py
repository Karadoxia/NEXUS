#!/usr/bin/env python3
"""
Rebuild Send Report with proper n8n v1 HTTP Request format
Use bodyParameter instead of body string for proper expression evaluation
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
    print("REBUILD SEND REPORT - N8N V1 WITH EXPRESSION EVALUATION")
    print("=" * 70)
    
    RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"
    
    for node in wf_data.get("nodes", []):
        if node.get("name") == "Send Report":
            position = node.get("position", [1376, 352])
            
            # Use n8n v1 format with bodyParameters for proper expression evaluation
            new_node = {
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
                    "sendBodyType": "json",
                    "bodyParametersUI": {
                        "parameter": [
                            {
                                "name": "from",
                                "value": "onboarding@resend.dev"
                            },
                            {
                                "name": "to",
                                "value": "caspertech78@gmail.com"
                            },
                            {
                                "name": "subject",
                                "value": "🤖 Weekly Site Audit Report"
                            },
                            {
                                "name": "html",
                                "value": "={{ $json.body.candidates[0].content.parts[0].text }}"
                            }
                        ]
                    }
                },
                "id": "send_audit_report",
                "name": "Send Report",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 1,
                "position": position,
                "continueOnFail": True
            }
            
            node.clear()
            node.update(new_node)
            
            print("✅ Rebuilt with bodyParametersUI (n8n v1 format)")
            print("✅ Each JSON field as separate parameter")
            print("✅ Expressions will be evaluated before sending")
            print("✅ JSON will be constructed automatically")
            break
    
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
        print(f"\n✅ Saved (Status: {patch_resp.status_code})")
        print("\n🚀 TEST NOW:")
        print("   http://localhost:5678/workflow/4QBqdYgThkCInHD1")
        print("   Refresh → Execute workflow")
        print("\n✨ Expressions will now evaluate properly!")
    else:
        print(f"❌ Save failed: {patch_resp.status_code}")
        print(patch_resp.text)
