#!/usr/bin/env python3
"""
Verify the fix worked - test the exact API call again
"""
import requests
import json
import sys
from pathlib import Path

# Get API key
gemini_key = None
for path in ["/home/redbend/Desktop/Local-Projects/NEXUS-V2/000-MyNotes/APIs/GEMINI-API"]:
    if Path(path).exists():
        with open(path, 'r') as f:
            content = f.read().strip()
            if content.startswith("AIza"):
                gemini_key = content.split('\n')[0].strip()
                break

if not gemini_key:
    print("❌ API key not found")
    sys.exit(1)

print("="*70)
print("TESTING FIXED GEMINI REQUEST")
print("="*70)

# Test with the CORRECTED body (with role)
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"

body = {
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

print(f"\nURL: {url[:80]}...")
print(f"\nBody structure:")
print(json.dumps(body, indent=2)[:300])

print(f"\n[TEST] Sending request...")

try:
    response = requests.post(
        url,
        json=body,
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("\n✅✅✅ SUCCESS! ✅✅✅")
        result = response.json()
        
        if 'candidates' in result and result['candidates']:
            text = result['candidates'][0]['content']['parts'][0]['text']
            print(f"\nGenerated Report:")
            print("="*70)
            print(text)
            print("="*70)
    else:
        print(f"\n❌ FAILED with status {response.status_code}")
        print(f"\nError response:")
        
        try:
            error = response.json()
            print(json.dumps(error, indent=2))
        except:
            print(response.text)
            
except requests.exceptions.Timeout:
    print(f"❌ Request timeout - API took too long to respond")
except Exception as e:
    print(f"❌ Exception: {e}")

print("\n" + "="*70)
