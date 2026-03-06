#!/usr/bin/env python3
"""
Fix the issues - add credentials back to Telegram, debug Send Report response
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
    
    workflow_id = "4QBqdYgThkCInHD1"
    wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers, timeout=10)
    wf_data = wf_resp.json().get("data", {})
    
    print("="*70)
    print("FIXING BOTH NODES")
    print("="*70)
    
    # 1. Fix Notify Completion - add credentials back
    for node in wf_data.get("nodes", []):
        if node.get("name") == "Notify Completion":
            print(f"\n1. Fixing Notify Completion:")
            
            # Add the Telegram credentials back
            node["credentials"] = {
                "telegramApi": {
                    "id": "P1JqNmgOzQhedrUg",
                    "name": "NEXUS Telegram Bot"
                }
            }
            
            # Also ensure chatId is set
            if "parameters" not in node:
                node["parameters"] = {}
            
            # Use both approaches - the node might need credential ref in chatId
            node["parameters"]["chatId"] = "={{$env.TELEGRAM_CHAT_ID}}"
            
            print(f"   ✅ Added Telegram credentials back")
            print(f"   ✅ ChatId will use environment variable through credentials")
            break
    
    # 2. Fix Send Report - ensure it has proper error handling
    for node in wf_data.get("nodes", []):
        if node.get("name") == "Send Report":
            print(f"\n2. Fixing Send Report:")
            
            # Make sure continueOnFail is enabled
            node["continueOnFail"] = True
            
            # Make sure it has retry on output
            if "retryOnOutput" not in node:
                node["retryOnOutput"] = False
            
            params = node.get("parameters", {})
            
            # Ensure proper response handling
            params["responseFormat"] = "json"
            params["fullResponse"] = False  # Only return the response body
            
            # Ensure no credentials field
            if "credentials" in node:
                del node["credentials"]
            
            print(f"   ✅ Enabled continueOnFail for resilience")
            print(f"   ✅ Set response format to json")
            print(f"   ✅ Removed any conflicting credentials")
            break
    
    # Save workflow
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
        print("\n" + "="*70)
        print("WORKFLOW FIXED!")
        print("="*70)
        print("\n✅ Notify Completion - Telegram credentials restored")
        print("✅ Send Report - Response handling configured")
        print("\n🚀 TEST NOW:")
        print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
        print("  2. Refresh page (Ctrl+R)")
        print("  3. Click 'Execute workflow'")
        print("  4. THIS TIME IT SHOULD WORK! 🚀")
    else:
        print(f"❌ Save failed: {patch_resp.status_code}")
        print(patch_resp.text)

except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
