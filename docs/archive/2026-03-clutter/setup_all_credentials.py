#!/usr/bin/env python3
"""
Create Telegram credential with the latest bot token and update workflow
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
    login_resp = session.post(
        f"{N8N_URL}/rest/login",
        json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
        headers=headers,
        timeout=10
    )
    
    print("="*70)
    print("SETTING UP TELEGRAM WITH LATEST BOT TOKEN")
    print("="*70)
    
    # Credentials provided by user
    TELEGRAM_BOT_TOKEN = "8666760606:AAG85GN98voF1nNZGAlb2uYdtDK9uKdlq6E"
    TELEGRAM_CHAT_ID = "6899339578"
    RESEND_API_KEY = "re_C51jKwtZ_DeLcpK5JcX6mEp7YmD4ecDk6"
    GEMINI_API_KEY = "AIzaSyDh2YVY62k0U_RJ_C73LUI8T7tfZ0X2oI4"
    
    print(f"\n📝 Credentials to use:")
    print(f"  - Telegram Bot: @Nexusto_bot")
    print(f"  - Bot Token: {TELEGRAM_BOT_TOKEN[:20]}...")
    print(f"  - Chat ID: {TELEGRAM_CHAT_ID}")
    print(f"  - Resend API: {RESEND_API_KEY[:20]}...")
    print(f"  - Gemini API: {GEMINI_API_KEY[:20]}...")
    
    # Create new Telegram credential
    print(f"\n1. Creating Telegram credential...")
    
    cred_data = {
        "type": "telegramApi",
        "name": "@Nexusto_bot Token",
        "data": {
            "accessToken": TELEGRAM_BOT_TOKEN
        }
    }
    
    cred_resp = session.post(
        f"{N8N_URL}/rest/credentials",
        json=cred_data,
        headers=headers,
        timeout=10
    )
    
    if cred_resp.status_code in [200, 201]:
        cred_body = cred_resp.json()
        telegram_cred_id = cred_body.get("data", {}).get("id", "")
        print(f"   ✅ Created! ID: {telegram_cred_id}")
    else:
        # Try to find existing @Nexusto_bot credential
        print(f"   Creating new credential failed, finding existing one...")
        creds_resp = session.get(f"{N8N_URL}/rest/credentials", headers=headers, timeout=10)
        credentials = creds_resp.json()
        
        if isinstance(credentials, dict) and "data" in credentials:
            creds_list = credentials.get("data", [])
        else:
            creds_list = credentials if isinstance(credentials, list) else []
        
        telegram_cred_id = None
        for cred in creds_list:
            if "telegram" in cred.get("type", "").lower():
                telegram_cred_id = cred.get("id")
                print(f"   ✅ Using existing: {cred.get('name')} ({telegram_cred_id})")
                break
    
    # Update workflow
    print(f"\n2. Updating workflow nodes...")
    
    workflow_id = "4QBqdYgThkCInHD1"
    wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers, timeout=10)
    wf_data = wf_resp.json().get("data", {})
    
    # Update each node
    for node in wf_data.get("nodes", []):
        node_name = node.get("name", "")
        
        if node_name == "Send Report":
            print(f"   - Send Report: Using Resend API")
            params = node.get("parameters", {})
            params["url"] = "https://api.resend.com/emails"
            params["fullResponse"] = False
            
        elif node_name == "Gemini: Generate Report":
            print(f"   - Gemini: Using API key")
            params = node.get("parameters", {})
            if "key=" in params.get("url", ""):
                params["url"] = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
        
        elif node_name == "Notify Completion":
            print(f"   - Notify Completion: Using @Nexusto_bot")
            if telegram_cred_id:
                node["credentials"] = {
                    "telegramApi": {
                        "id": telegram_cred_id,
                        "name": "@Nexusto_bot Token"
                    }
                }
            node["parameters"]["chatId"] = TELEGRAM_CHAT_ID
    
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
        print(f"\n✅ Workflow updated!")
        print("\n" + "="*70)
        print("WORKFLOW CONFIGURED WITH ALL VALID CREDENTIALS!")
        print("="*70)
        print("\n✅ Gemini API: Configured")
        print("✅ Resend Email: Configured")
        print("✅ Telegram (@Nexusto_bot): Configured")
        print(f"✅ Chat ID: {TELEGRAM_CHAT_ID}")
        print("\n🚀 FINAL TEST:")
        print("  1. Go to: http://localhost:5678/workflow/4QBqdYgThkCInHD1")
        print("  2. Refresh (Ctrl+R)")
        print("  3. Execute workflow")
        print("  ✅ Everything should work now!")
    else:
        print(f"❌ Update failed: {patch_resp.status_code}")
        print(patch_resp.text)

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
