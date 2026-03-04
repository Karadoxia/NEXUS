#!/usr/bin/env python3
"""
Final fix - set chatId to direct value, fix HTTP response to include status
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
    print("FINAL WORKFLOW FIXES")
    print("="*70)
    
    TELEGRAM_CHAT_ID = "6899339578"
    
    # Fix 1: Notify Completion - use direct chat ID, not env var
    for node in wf_data.get("nodes", []):
        if node.get("name") == "Notify Completion":
            print(f"\n1. Fixing Notify Completion:")
            
            # Keep credentials
            node["credentials"] = {
                "telegramApi": {
                    "id": "P1JqNmgOzQhedrUg",
                    "name": "NEXUS Telegram Bot"
                }
            }
            
            # Set chatId to DIRECT VALUE instead of env var
            print(f"   Old: {{{{$env.TELEGRAM_CHAT_ID}}}}")
            node["parameters"]["chatId"] = TELEGRAM_CHAT_ID
            print(f"   New: {TELEGRAM_CHAT_ID}")
            print(f"   ✅ Removed env var access issue")
            break
    
    # Fix 2: Send Report - ensure it returns full response with status
    for node in wf_data.get("nodes", []):
        if node.get("name") == "Send Report":
            print(f"\n2. Fixing Send Report:")
            
            params = node.get("parameters", {})
            
            # The response needs to have status code - use fullResponse
            params["fullResponse"] = True  # This includes status, headers, etc
            params["responseFormat"] = "json"
            
            # Keep continueOnFail
            node["continueOnFail"] = True
            
            # Remove any credentials that might conflict
            if "credentials" in node:
                del node["credentials"]
            
            print(f"   ✅ Set fullResponse: true (includes status code)")
            print(f"   ✅ Keep continueOnFail enabled")
            print(f"   ✅ No conflicting credentials")
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
        print("ALL FIXES APPLIED!")
        print("="*70)
        print("\n✅ Notify Completion - Chat ID embedded, no env var access")
        print("✅ Send Report - Full response with status code enabled")
        print("\n🚀 TEST NOW:")
        print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
        print("  2. Refresh (Ctrl+R)")
        print("  3. Execute workflow")
        print("  4. Both nodes should work now!")
    else:
        print(f"❌ Save failed: {patch_resp.status_code}")
        print(patch_resp.text)

except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
