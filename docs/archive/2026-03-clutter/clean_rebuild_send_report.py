#!/usr/bin/env python3
"""
Delete and recreate Send Report node - completely clean
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

try:
    # Login
    login_resp = session.post(
        f"{N8N_URL}/rest/login",
        json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
        headers=headers,
        timeout=10
    )
    
    if login_resp.status_code != 200:
        print(f"❌ Login failed: {login_resp.status_code}")
        exit(1)
    
    workflow_id = "4QBqdYgThkCInHD1"
    
    # Get workflow
    wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers, timeout=10)
    wf_data = wf_resp.json().get("data", {})
    
    RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"
    
    print("="*70)
    print("RECREATING SEND REPORT NODE - CLEAN BUILD")
    print("="*70)
    
    # Remove old Send Report node and rebuild
    send_report_idx = -1
    for idx, node in enumerate(wf_data.get("nodes", [])):
        if node.get("name") == "Send Report":
            send_report_idx = idx
            break
    
    if send_report_idx >= 0:
        old_node = wf_data["nodes"][send_report_idx]
        old_position = old_node.get("position", [1376, 352])
        
        # Create completely new node - NO credentials field at all
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
                "options": {}
            },
            "id": "send_audit_report",
            "name": "Send Report",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 2,
            "position": old_position,
            "continueOnFail": True
        }
        
        wf_data["nodes"][send_report_idx] = new_node
        
        print(f"✅ Recreated Send Report node")
        print(f"✅ NO credentials field (avoids conflicts)")
        print(f"✅ Using header-based auth only")
        
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
            print(f"\n✅ Workflow saved!")
            print("\n🚀 TEST NOW:")
            print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
            print("  2. Refresh page (Ctrl+R)")
            print("  3. Click 'Execute workflow'")
        else:
            print(f"❌ Save failed: {patch_resp.status_code}")
    else:
        print("❌ Send Report node not found")

except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
