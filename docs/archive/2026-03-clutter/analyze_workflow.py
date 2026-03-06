#!/usr/bin/env python3
"""
Analyze n8n workflow nodes to identify configuration issues
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
N8N_BASE_URL = "http://localhost:5678"
API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMTgzZjY2OS04ODQxLTQ5NTgtOTIyNS05NDJjMmYzYzhjMTgiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMzlkMjcwZDItYjg4Mi00NjI3LTk0ZjktMjNmNzc1YmZiOGJkIiwiaWF0IjoxNzcyNDgwODM2fQ.5XMnA52rYfkI_l_ezdM74zJK8TImjxYsOknOzJDFiMk"

headers = {
    "X-N8N-API-KEY": API_KEY,
    "Content-Type": "application/json"
}

def fetch_workflows():
    """Fetch all workflows from n8n"""
    try:
        response = requests.get(
            f"{N8N_BASE_URL}/api/v1/workflows",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ Error fetching workflows: {e}")
        return None

def find_workflow_by_name(workflows: Dict, target_name: str) -> Optional[Dict]:
    """Find workflow by name"""
    if not workflows or "data" not in workflows:
        return None
    
    for workflow in workflows["data"]:
        if target_name.lower() in workflow.get("name", "").lower():
            return workflow
    return None

def fetch_workflow_detail(workflow_id: str) -> Optional[Dict]:
    """Fetch detailed workflow configuration"""
    try:
        response = requests.get(
            f"{N8N_BASE_URL}/api/v1/workflows/{workflow_id}",
            headers=headers,
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ Error fetching workflow detail: {e}")
        return None

def extract_node(workflow: Dict, node_name: str) -> Optional[Dict]:
    """Extract a specific node from workflow"""
    if "nodes" not in workflow:
        return None
    
    for node in workflow["nodes"]:
        if node.get("name") == node_name:
            return node
    return None

def analyze_nodes():
    """Main analysis function"""
    print("="*80)
    print("N8N WORKFLOW NODE ANALYSIS")
    print("="*80)
    print()
    
    # Step 1: List workflows
    print("[1/4] Fetching workflows from n8n...")
    workflows = fetch_workflows()
    if not workflows:
        print("Failed to fetch workflows")
        return
    
    print(f"✅ Found {len(workflows.get('data', []))} workflows")
    print()
    
    # Step 2: Find the audit bot workflow
    print("[2/4] Looking for '🤖 NEXUS - Full Site Audit Bot' workflow...")
    target_workflow = find_workflow_by_name(workflows, "NEXUS - Full Site Audit Bot")
    
    if not target_workflow:
        print("❌ Workflow not found!")
        print("\nAvailable workflows:")
        for wf in workflows.get("data", []):
            print(f"  - {wf.get('name')}")
        return
    
    print(f"✅ Found workflow: {target_workflow.get('name')}")
    workflow_id = target_workflow.get("id")
    print(f"   ID: {workflow_id}")
    print()
    
    # Step 3: Fetch workflow details
    print("[3/4] Fetching complete workflow configuration...")
    workflow_detail = fetch_workflow_detail(workflow_id)
    
    if not workflow_detail:
        print("Failed to fetch workflow details")
        return
    
    print(f"✅ Fetched workflow with {len(workflow_detail.get('nodes', []))} nodes")
    print()
    
    # Step 4: Extract and analyze the failing nodes
    print("[4/4] Extracting node configurations...")
    print()
    
    # Node 1: Gemini Generate Report
    print("="*80)
    print("NODE 1: 'Gemini: Generate Report'")
    print("="*80)
    gemini_node = extract_node(workflow_detail, "Gemini: Generate Report")
    
    if gemini_node:
        print("\n✅ NODE FOUND - Raw Configuration:")
        print(json.dumps(gemini_node, indent=2))
        
        print("\n📋 PARAMETER ANALYSIS:")
        params = gemini_node.get("parameters", {})
        
        print(f"\n  ├─ type: {gemini_node.get('type')}")
        print(f"  ├─ typeVersion: {gemini_node.get('typeVersion')}")
        print(f"  ├─ URL: {params.get('url', 'NOT FOUND')}")
        print(f"  ├─ Method: {params.get('method', 'NOT FOUND')}")
        print(f"  ├─ sendBody: {params.get('sendBody', 'NOT FOUND')}")
        
        body_params = params.get("bodyParameters", {})
        print(f"  ├─ bodyParameters.parameters: {json.dumps(body_params.get('parameters', []), indent=4)}")
        
        print(f"  └─ responseFormat: {params.get('responseFormat', 'NOT FOUND')}")
        
        print("\n🔍 ISSUE DIAGNOSIS:")
        issues = []
        
        # Check URL structure
        url = params.get("url", "")
        if "?key=" not in url:
            issues.append("❌ URL missing API key parameter (?key=...)")
        if "${" in url or "$env" in url:
            print(f"   ⚠️  URL contains expression: {url}")
        
        # Check body parameters
        if not body_params.get("parameters"):
            issues.append("❌ bodyParameters.parameters is empty or missing")
        else:
            for param in body_params.get("parameters", []):
                if param.get("name") == "contents":
                    value = param.get("value", "")
                    print(f"\n   Contents parameter value preview:")
                    print(f"   {value[:100]}...")
        
        # Check response format
        if not params.get("responseFormat"):
            issues.append("❌ responseFormat not set")
        
        if issues:
            print("\n   Issues Found:")
            for issue in issues:
                print(f"   {issue}")
        else:
            print("   ⚠️  No obvious configuration issues found")
    else:
        print("❌ 'Gemini: Generate Report' node not found in workflow!")
    
    print("\n")
    
    # Node 2: Send Report
    print("="*80)
    print("NODE 2: 'Send Report'")
    print("="*80)
    send_node = extract_node(workflow_detail, "Send Report")
    
    if send_node:
        print("\n✅ NODE FOUND - Raw Configuration:")
        print(json.dumps(send_node, indent=2))
        
        print("\n📋 PARAMETER ANALYSIS:")
        params = send_node.get("parameters", {})
        
        print(f"\n  ├─ type: {send_node.get('type')}")
        print(f"  ├─ typeVersion: {send_node.get('typeVersion')}")
        print(f"  ├─ fromEmail: {params.get('fromEmail', 'NOT FOUND')}")
        print(f"  ├─ toEmail: {params.get('toEmail', 'NOT FOUND')}")
        print(f"  ├─ subject: {params.get('subject', 'NOT FOUND')}")
        print(f"  ├─ html: {params.get('html', 'NOT FOUND')}")
        
        creds = send_node.get("credentials", {})
        print(f"  ├─ credentials.smtp: {json.dumps(creds.get('smtp', {}), indent=4)}")
        print(f"  └─ position: {send_node.get('position')}")
        
        print("\n🔍 ISSUE DIAGNOSIS:")
        issues = []
        
        # Check node type
        if send_node.get("type") != "n8n-nodes-base.emailSend":
            issues.append(f"❌ Wrong node type: {send_node.get('type')} (should be 'n8n-nodes-base.emailSend')")
        
        # Check credentials
        if not creds.get("smtp"):
            issues.append("❌ Missing SMTP credentials configuration")
        
        # Check HTML content references upstream node
        html = params.get("html", "")
        if "candidates" in html:
            print(f"   ✅ HTML references upstream Gemini response")
            print(f"      Expression: {html}")
        else:
            issues.append("❌ HTML content doesn't reference Gemini node output")
        
        if issues:
            print("\n   Issues Found:")
            for issue in issues:
                print(f"   {issue}")
        else:
            print("   ⚠️  No obvious configuration issues found")
    else:
        print("❌ 'Send Report' node not found in workflow!")
    
    print("\n")
    print("="*80)
    print("COMPARISON WITH REFERENCE")
    print("="*80)
    
    # Load and compare with reference
    reference_path = "/home/redbend/Desktop/Local-Projects/NEXUS-V2/n8n-workflows/17-site-audit-bot.json"
    try:
        with open(reference_path, 'r') as f:
            reference = json.load(f)
        
        print(f"\n✅ Loaded reference workflow from: {reference_path}")
        
        # Compare Gemini node
        ref_gemini = extract_node(reference, "Gemini: Generate Report")
        if ref_gemini and gemini_node:
            print("\n📊 GEMINI NODE COMPARISON:")
            print("\nReference URL:")
            print(f"  {ref_gemini.get('parameters', {}).get('url')}")
            print("\nActual URL:")
            print(f"  {gemini_node.get('parameters', {}).get('url')}")
            
            if ref_gemini.get("parameters") != gemini_node.get("parameters"):
                print("\n⚠️  PARAMETERS DIFFER!")
                print("\nReference bodyParameters:")
                print(json.dumps(ref_gemini.get("parameters", {}).get("bodyParameters"), indent=2))
                print("\nActual bodyParameters:")
                print(json.dumps(gemini_node.get("parameters", {}).get("bodyParameters"), indent=2))
        
        # Compare Send Report node
        ref_send = extract_node(reference, "Send Report")
        if ref_send and send_node:
            print("\n📊 SEND REPORT NODE COMPARISON:")
            
            ref_html = ref_send.get('parameters', {}).get('html')
            actual_html = send_node.get('parameters', {}).get('html')
            
            print(f"\nReference HTML expression:")
            print(f"  {ref_html}")
            print(f"\nActual HTML expression:")
            print(f"  {actual_html}")
            
            if ref_html != actual_html:
                print("\n⚠️  HTML EXPRESSIONS DIFFER!")
    
    except FileNotFoundError:
        print(f"⚠️  Reference file not found: {reference_path}")
    except json.JSONDecodeError as e:
        print(f"❌ Error parsing reference file: {e}")
    
    print("\n" + "="*80)

if __name__ == "__main__":
    analyze_nodes()
