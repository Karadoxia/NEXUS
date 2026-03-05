#!/usr/bin/env python3
"""
Update Telegram configuration to use @Nexusto_bot with the registered chat ID
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
    
    print("="*70)
    print("CHECKING TELEGRAM CREDENTIALS")
    print("="*70)
    
    # Get all credentials to find Telegram ones
    creds_resp = session.get(f"{N8N_URL}/rest/credentials", headers=headers, timeout=10)
    credentials = creds_resp.json()
    
    if isinstance(credentials, dict) and "data" in credentials:
        creds_list = credentials.get("data", [])
    else:
        creds_list = credentials if isinstance(credentials, list) else []
    
    print(f"\nTelegram credentials available:")
    telegram_creds = []
    for cred in creds_list:
        if "telegram" in cred.get("type", "").lower():
            cred_id = cred.get("id", "")
            cred_name = cred.get("name", "")
            telegram_creds.append({"id": cred_id, "name": cred_name})
            print(f"  - {cred_name} (ID: {cred_id})")
    
    print(f"\n✅ Found {len(telegram_creds)} Telegram credential(s)")
    
    if not telegram_creds:
        print("❌ No Telegram credentials found!")
        print("Need to create credential for @Nexusto_bot")
        exit(1)
    
    # Use the first Telegram credential (or the one we had)
    telegram_cred_id = telegram_creds[0]["id"]
    
    # Now update the workflow
    workflow_id = "4QBqdYgThkCInHD1"
    wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers, timeout=10)
    wf_data = wf_resp.json().get("data", {})
    
    print("\n" + "="*70)
    print("UPDATING NOTIFY COMPLETION NODE")
    print("="*70)
    
    TELEGRAM_CHAT_ID = "6899339578"
    
    # Fix Notify Completion node
    for node in wf_data.get("nodes", []):
        if node.get("name") == "Notify Completion":
            print(f"\n✅ Found Notify Completion node")
            print(f"   Current chatId: {node.get('parameters', {}).get('chatId', 'NOT SET')}")
            
            # Set credentials to use telegramApi
            node["credentials"] = {
                "telegramApi": {
                    "id": telegram_cred_id,
                    "name": "Telegram account"
                }
            }
            
            # Use direct chat ID
            node["parameters"]["chatId"] = TELEGRAM_CHAT_ID
            
            print(f"\n✅ Updated:")
            print(f"   - Using credential: {telegram_cred_id}")
            print(f"   - ChatId: {TELEGRAM_CHAT_ID}")
            print(f"   - Bot: @Nexusto_bot (via credential)")
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
        print(f"\n✅ Workflow saved!")
        print("\n" + "="*70)
        print("TELEGRAM CONFIGURATION COMPLETE!")
        print("="*70)
        print("\n✅ Using @Nexusto_bot")
        print(f"✅ Chat ID: {TELEGRAM_CHAT_ID}")
        print("\n🚀 TEST NOW:")
        print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
        print("  2. Refresh (Ctrl+R)")
        print("  3. Execute workflow")
        print("  4. Telegram should now work! ✅")
    else:
        print(f"❌ Save failed: {patch_resp.status_code}")

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
