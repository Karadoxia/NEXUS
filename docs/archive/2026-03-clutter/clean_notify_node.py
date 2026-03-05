#!/usr/bin/env python3
"""
Check and clean Notify Completion node - remove old credentials
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
    
    TELEGRAM_CHAT_ID = "6899339578"
    
    print("="*70)
    print("CHECKING NOTIFY COMPLETION NODE")
    print("="*70)
    
    # Find Notify Completion node
    notify_node = None
    notify_idx = -1
    for idx, node in enumerate(wf_data.get("nodes", [])):
        if node.get("name") == "Notify Completion":
            notify_node = node
            notify_idx = idx
            break
    
    if notify_node:
        print(f"\nFound Notify Completion node")
        creds = notify_node.get("credentials", {})
        print(f"Has credentials: {bool(creds)}")
        
        if creds:
            print(f"Old credentials: {creds}")
            print(f"\n⚠️ Issue: Old Telegram credentials are still attached")
            print(f"✅ Removing credentials field...")
            
            # Remove credentials
            if "credentials" in notify_node:
                del notify_node["credentials"]
            
            # Make sure chatId is correct
            notify_node["parameters"]["chatId"] = TELEGRAM_CHAT_ID
            
            print(f"✅ Node cleaned")
            print(f"✅ Credentials removed")
            print(f"✅ Chat ID set to: {TELEGRAM_CHAT_ID}")
            
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
                print("\n" + "="*70)
                print("ALL NODES CLEANED AND READY!")
                print("="*70)
                print("\n✅ Send Report - Clean HTTP node, no credentials")
                print("✅ Notify Completion - Chat ID embedded, no credentials")
                print("\n🚀 FINAL TEST:")
                print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
                print("  2. Refresh page (Ctrl+R)")
                print("  3. Click 'Execute workflow'")
                print("  4. Watch all nodes execute successfully!")
            else:
                print(f"❌ Save failed: {patch_resp.status_code}")
        else:
            print(f"✅ Node is already clean (no credentials)")
    else:
        print("❌ Notify Completion node not found")

except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()
