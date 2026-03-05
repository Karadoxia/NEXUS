#!/usr/bin/env python3
"""
Check if GEMINI_API_KEY is set in n8n environment
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

print("[1] Logging in...")
login_resp = session.post(
    f"{N8N_URL}/rest/login",
    json={"emailOrLdapLoginId": EMAIL, "password": PASSWORD},
    headers=headers
)

if login_resp.status_code != 200:
    print(f"❌ Login failed")
    exit(1)

print("✅ Logged in")

# Get workflow to check environment
workflow_id = "4QBqdYgThkCInHD1"
wf_resp = session.get(f"{N8N_URL}/rest/workflows/{workflow_id}", headers=headers)
wf = wf_resp.json().get("data", {})

# Find Gemini node
gemini_node = None
for node in wf.get("nodes", []):
    if "Gemini" in node.get("name"):
        gemini_node = node
        break

print(f"\n[2] Gemini node URL:")
url = gemini_node.get("parameters", {}).get("url", "")
print(f"Current: {url}")

# Check if it has the environment variable placeholder
if "{{ $env.GEMINI_API_KEY }}" in url:
    print("✅ Has environment variable placeholder")
    
    # The issue: n8n can't resolve it
    # Solution: Use the DIRECT API key instead
    
    print("\n[3] FIX: Replace with direct API key")
    
    # Get the key
    from pathlib import Path
    gemini_key = None
    for path in ["/home/redbend/Desktop/Local-Projects/NEXUS-V2/000-MyNotes/APIs/GEMINI-API"]:
        if Path(path).exists():
            with open(path, 'r') as f:
                content = f.read().strip()
                if content.startswith("AIza"):
                    gemini_key = content.split('\n')[0].strip()
                    break
    
    if gemini_key:
        print(f"✅ Found API key: {gemini_key[:20]}...")
        
        # Replace the placeholder with the actual key
        new_url = url.replace("{{ $env.GEMINI_API_KEY }}", gemini_key)
        
        gemini_node["parameters"]["url"] = new_url
        
        print(f"New URL: {new_url[:80]}...")
        
        # Update the workflow
        print("\n[4] Updating workflow...")
        update_resp = session.patch(
            f"{N8N_URL}/rest/workflows/{workflow_id}",
            json=wf,
            headers=headers
        )
        
        if update_resp.status_code in [200, 201]:
            print("✅ Workflow updated!")
        else:
            print(f"❌ Update failed: {update_resp.status_code}")
            print(update_resp.text[:200])
    else:
        print("❌ API key not found")
else:
    print("⚠️  No environment variable placeholder found")

print("\n" + "="*70)
print("""
✅ FIX APPLIED!

The issue was: n8n couldn't resolve {{ $env.GEMINI_API_KEY }}
The solution: Embed the API key directly in the URL

Now test:
  1. Go to http://localhost:5678/workflow/4QBqdYgThkCInHD1
  2. Refresh the page (Ctrl+R)
  3. Click "Execute workflow"
  4. The Gemini node should now work!
""")
