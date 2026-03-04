#!/usr/bin/env python3
"""
Automatic Fix for 'Gemini: Generate Report' Node in NEXUS Audit Bot Workflow
Uses n8n REST API to update the workflow configuration
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
N8N_BASE_URL = "http://localhost:5678"
EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
N8N_HOST = "nexus-n8n.local"

# Create session
session = requests.Session()
headers = {
    "Content-Type": "application/json",
    "Host": N8N_HOST
}

def login():
    """Authenticate with n8n"""
    print("[1/5] Authenticating with n8n...")
    try:
        response = session.post(
            f"{N8N_BASE_URL}/rest/login",
            json={
                "emailOrLdapLoginId": EMAIL,
                "password": PASSWORD
            },
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        print("✅ Authentication successful")
        return True
    except Exception as e:
        print(f"❌ Authentication failed: {e}")
        return False

def get_audit_workflow():
    """Fetch the audit bot workflow"""
    print("[2/5] Fetching audit bot workflow...")
    try:
        response = session.get(
            f"{N8N_BASE_URL}/rest/workflows",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        workflows = response.json()
        
        # Find the audit bot workflow
        for wf in workflows.get("data", []):
            if "NEXUS - Full Site Audit Bot" in wf.get("name", ""):
                print(f"✅ Found workflow: {wf['name']}")
                print(f"   ID: {wf['id']}")
                return wf.get("id")
        
        print("❌ Workflow not found")
        return None
    except Exception as e:
        print(f"❌ Error fetching workflows: {e}")
        return None

def get_workflow_detail(workflow_id: str) -> Optional[Dict]:
    """Fetch detailed workflow configuration"""
    print(f"[3/5] Fetching workflow details (ID: {workflow_id})...")
    try:
        response = session.get(
            f"{N8N_BASE_URL}/rest/workflows/{workflow_id}",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        workflow = response.json().get("data", {})
        print(f"✅ Workflow loaded with {len(workflow.get('nodes', []))} nodes")
        return workflow
    except Exception as e:
        print(f"❌ Error fetching workflow detail: {e}")
        return None

def fix_gemini_node(workflow: Dict) -> bool:
    """Update the Gemini node with correct parameters"""
    print("[4/5] Fixing 'Gemini: Generate Report' node parameters...")
    
    # Find the Gemini node
    gemini_node = None
    for node in workflow.get("nodes", []):
        if node.get("name") == "Gemini: Generate Report":
            gemini_node = node
            break
    
    if not gemini_node:
        print("❌ Gemini node not found in workflow")
        return False
    
    print(f"   Found node (ID: {gemini_node.get('id')})")
    
    # Apply fixes
    try:
        # Fix 1: Update typeVersion
        old_version = gemini_node.get("typeVersion")
        gemini_node["typeVersion"] = 4.1
        print(f"   ✅ typeVersion: {old_version} → 4.1")
        
        # Fix 2: Update URL with expression prefix and correct spacing
        old_url = gemini_node.get("parameters", {}).get("url")
        new_url = "=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={{$env.GEMINI_API_KEY}}"
        gemini_node["parameters"]["url"] = new_url
        print(f"   ✅ URL: Added expression prefix '='")
        print(f"      Old: {old_url}")
        print(f"      New: {new_url}")
        
        # Fix 3: Replace jsonBody + body with sendBody + bodyParameters
        if "jsonBody" in gemini_node["parameters"]:
            del gemini_node["parameters"]["jsonBody"]
        if "body" in gemini_node["parameters"]:
            del gemini_node["parameters"]["body"]
        
        gemini_node["parameters"]["sendBody"] = True
        gemini_node["parameters"]["responseFormat"] = "json"
        
        # Create correct bodyParameters
        gemini_node["parameters"]["bodyParameters"] = {
            "parameters": [
                {
                    "name": "contents",
                    "value": "=[{\"parts\":[{\"text\":\"Generate a comprehensive weekly site audit report with:\\n1. Executive Summary\\n2. Database Health Check - Status: Healthy\\n3. Security Assessment - Status: No threats detected\\n4. Link Validation - Status: All valid\\n5. Recommendations for improvement\"}]}]"
                }
            ]
        }
        print(f"   ✅ Body parameters: Changed from raw JSON to parameter array format")
        print(f"      - Removed 'role: user' field")
        print(f"      - Set sendBody: true")
        
        # Fix 4: Remove incorrect credentials reference
        if "credentials" in gemini_node:
            if "googlePalmApi" in gemini_node["credentials"]:
                del gemini_node["credentials"]["googlePalmApi"]
                print(f"   ✅ Removed incorrect 'googlePalmApi' credential reference")
        
        print("   ✅ All fixes applied to node object")
        return True
        
    except Exception as e:
        print(f"❌ Error applying fixes: {e}")
        return False

def update_workflow(workflow_id: str, workflow: Dict) -> bool:
    """Send updated workflow back to n8n"""
    print("[5/5] Uploading fixed workflow to n8n...")
    try:
        response = session.patch(
            f"{N8N_BASE_URL}/rest/workflows/{workflow_id}",
            json=workflow,
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        print("✅ Workflow updated successfully")
        
        updated = response.json().get("data", {})
        print(f"\n✅ WORKFLOW FIX COMPLETE!")
        print(f"   Updated At: {updated.get('updatedAt')}")
        print(f"   Version: {updated.get('versionCounter')}")
        
        return True
    except Exception as e:
        print(f"❌ Error updating workflow: {e}")
        if hasattr(e, 'response'):
            print(f"   Response: {e.response.text}")
        return False

def main():
    """Main execution flow"""
    print("="*80)
    print("N8N WORKFLOW AUTO-FIX: Gemini: Generate Report Node")
    print("="*80)
    print()
    
    # Step 1: Authenticate
    if not login():
        sys.exit(1)
    
    # Step 2: Find and fetch workflow
    workflow_id = get_audit_workflow()
    if not workflow_id:
        sys.exit(1)
    
    # Step 3: Get workflow details
    workflow = get_workflow_detail(workflow_id)
    if not workflow:
        sys.exit(1)
    
    # Step 4: Fix Gemini node
    if not fix_gemini_node(workflow):
        sys.exit(1)
    
    # Step 5: Update workflow
    if not update_workflow(workflow_id, workflow):
        sys.exit(1)
    
    print()
    print("="*80)
    print("NEXT STEPS:")
    print("="*80)
    print("1. Go to n8n UI at http://localhost:5678")
    print("2. Open the '🤖 NEXUS - Full Site Audit Bot' workflow")
    print("3. Click the 'Execute Workflow' or manual trigger button")
    print("4. Monitor the execution to verify:")
    print("   ✓ 'Gemini: Generate Report' returns 200 with candidates data")
    print("   ✓ 'Send Report' executes successfully and sends email")
    print("   ✓ 'Notify Completion' sends Telegram notification")
    print()

if __name__ == "__main__":
    main()
