#!/usr/bin/env python3
"""
Fix Send Report: Use body parameter with typeVersion 1 (not jsonBody)
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
    print("FIX: SEND REPORT - USE body FOR typeVersion 1")
    print("=" * 70)
    
    RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"
    
    for node in wf_data.get("nodes", []):
        if node.get("name") == "Send Report":
            # Fix the body format for typeVersion 1
            params = node.get("parameters", {})
            
            # Remove jsonBody (typeVersion 2 param)
            params.pop("jsonBody", None)
            params.pop("sendBody", None)
            params.pop("bodyType", None)
            
            # Add body (typeVersion 1 param)
            params["body"] = json.dumps({
                "from": "onboarding@resend.dev",
                "to": "caspertech78@gmail.com",
                "subject": "🤖 Weekly Site Audit Report",
                "html": "={{ $json.body.candidates[0].content.parts[0].text }}"
            })
            
            # Make sure requestFormat is set for JSON
            params["requestFormat"] = "json"
            
            print("✅ Switched from jsonBody → body")
            print("✅ Set requestFormat: json")
            print(f"✅ Body: {params['body'][:100]}...")
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
        print("\n🚀 TEST AGAIN:")
        print("   http://localhost:5678/workflow/4QBqdYgThkCInHD1")
        print("   Refresh → Execute workflow")
        print("\n✨ Now emails should actually send to Resend!")
    else:
        print(f"❌ Save failed: {patch_resp.status_code}")
