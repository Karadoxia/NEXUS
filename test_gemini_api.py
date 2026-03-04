#!/usr/bin/env python3
"""
Test the Gemini API call directly to get exact error message
"""
import requests
import json
import os
import sys
from pathlib import Path

# Try to read the GEMINI API key from the file
gemini_key = None

key_file_paths = [
    "/home/redbend/Desktop/Local-Projects/NEXUS-V2/000-MyNotes/APIs/GEMINI-API",
    "/home/redbend/Desktop/Local-Projects/NEXUS-V2/gemini_key.txt",
    "/home/redbend/Desktop/Local-Projects/NEXUS-V2/.env"
]

for path in key_file_paths:
    if Path(path).exists():
        with open(path, 'r') as f:
            content = f.read().strip()
            if content.startswith("AIza"):
                gemini_key = content.split('\n')[0].strip()
                print(f"✅ Found key in {path}")
                break

if not gemini_key:
    # Check environment variable
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        print("✅ Using GEMINI_API_KEY from environment")
    else:
        print("❌ No Gemini API key found")
        sys.exit(1)

print(f"Using key: {gemini_key[:20]}...")

# Test different Gemini API endpoints
test_cases = [
    {
        "name": "Gemini 2.0 Flash (v1beta)",
        "url": f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2-0-flash:generateContent?key={gemini_key}",
        "body": {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": "Hello, test message"
                        }
                    ]
                }
            ]
        }
    },
    {
        "name": "Gemini 1.5 Flash (v1)",
        "url": f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key={gemini_key}",
        "body": {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": "Hello, test message"
                        }
                    ]
                }
            ]
        }
    },
    {
        "name": "Gemini 1.5 Pro (v1)",
        "url": f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={gemini_key}",
        "body": {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": "Hello, test message"
                        }
                    ]
                }
            ]
        }
    }
]

print("\n" + "="*70)
print("TESTING GEMINI API ENDPOINTS")
print("="*70)

working_endpoint = None

for test in test_cases:
    print(f"\n→ Testing: {test['name']}")
    print(f"  URL: {test['url']}")
    
    try:
        response = requests.post(
            test['url'],
            json=test['body'],
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"  Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print(f"  ✅ SUCCESS!")
            result = response.json()
            if 'candidates' in result and result['candidates']:
                text = result['candidates'][0].get('content', {}).get('parts', [{}])[0].get('text', '')
                print(f"  Response: {text[:100]}...")
            working_endpoint = test
        else:
            print(f"  ❌ Failed")
            try:
                error_data = response.json()
                error_msg = error_data.get('error', {}).get('message', response.text)
                print(f"  Error: {error_msg}")
            except:
                print(f"  Response: {response.text[:200]}")
                
    except Exception as e:
        print(f"  ❌ Exception: {str(e)}")

print("\n" + "="*70)
print("TESTING WORKFLOW PARAMETERS")
print("="*70)

# Now test with the exact parameters the workflow uses
workflow_payload = {
    "contents": [
        {
            "role": "user",
            "parts": [
                {
                    "text": "Generate a comprehensive weekly site audit report with:\n1. Executive Summary\n2. Database Health Check - Status: Healthy\n3. Security Assessment - Status: No threats detected\n4. Link Validation - Status: All valid\n5. Recommendations for improvement"
                }
            ]
        }
    ]
}

if working_endpoint:
    print(f"\n→ Testing with workflow parameters using: {working_endpoint['name']}")
    print(f"  URL: {working_endpoint['url']}")
    
    try:
        response = requests.post(
            working_endpoint['url'],
            json=workflow_payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"  Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print(f"  ✅ SUCCESS!")
            result = response.json()
            if 'candidates' in result and result['candidates']:
                text = result['candidates'][0].get('content', {}).get('parts', [{}])[0].get('text', '')
                print(f"\n  Generated Report Preview:")
                print(f"  {text[:300]}...")
        else:
            print(f"  ❌ Failed")
            try:
                error_data = response.json()
                error_msg = error_data.get('error', {}).get('message', response.text)
                print(f"  Error: {error_msg}")
            except:
                print(f"  Response: {response.text}")
                
    except Exception as e:
        print(f"  ❌ Exception: {str(e)}")
else:
    print("❌ No working endpoint found!")

print("\n" + "="*70)
print("RECOMMENDATION")
print("="*70)
if working_endpoint:
    print(f"\nUse this endpoint in n8n Gemini node:")
    print(f"  {working_endpoint['url']}")
    print(f"\nModel: {working_endpoint['name'].split('(')[0].strip()}")
else:
    print("❌ No working Gemini API endpoint found")
    print("Check:")
    print("  1. API key is valid (try in https://aistudio.google.com)")
    print("  2. API is enabled in Google Cloud Console")
    print("  3. Try using a different model name")
