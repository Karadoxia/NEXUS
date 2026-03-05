#!/usr/bin/env python3
"""
Test Gemini API with EXACT parameters from n8n to see detailed error
"""
import requests
import json
import sys
from pathlib import Path

# Get API key
gemini_key = None
for path in [
    "/home/redbend/Desktop/Local-Projects/NEXUS-V2/000-MyNotes/APIs/GEMINI-API",
    "/home/redbend/Desktop/Local-Projects/NEXUS-V2/gemini_key.txt",
]:
    if Path(path).exists():
        with open(path, 'r') as f:
            content = f.read().strip()
            if content.startswith("AIza"):
                gemini_key = content.split('\n')[0].strip()
                break

if not gemini_key:
    print("❌ No API key")
    sys.exit(1)

print(f"Using API key: {gemini_key[:25]}...")
print("="*70)

# Test 1: Minimal request
print("\n[TEST 1] MINIMAL REQUEST")
print("-"*70)

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
body = {
    "contents": [
        {
            "role": "user",
            "parts": [
                {
                    "text": "test"
                }
            ]
        }
    ]
}

print(f"URL: {url[:80]}...")
print(f"Body: {json.dumps(body, indent=2)[:200]}...")

try:
    response = requests.post(
        url,
        json=body,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    print(f"\nStatus: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ SUCCESS!")
        data = response.json()
        if 'candidates' in data:
            text = data['candidates'][0]['content']['parts'][0]['text']
            print(f"Response: {text[:100]}")
    else:
        print("❌ FAILED")
        try:
            error = response.json()
            print(f"Error Details:")
            print(json.dumps(error, indent=2))
        except:
            print(f"Response: {response.text}")
            
except Exception as e:
    print(f"Exception: {e}")

# Test 2: With safety settings (sometimes required)
print("\n\n[TEST 2] WITH SAFETY SETTINGS")
print("-"*70)

body_with_safety = {
    "contents": [
        {
            "role": "user",
            "parts": [
                {
                    "text": "test"
                }
            ]
        }
    ],
    "safetySettings": [
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_NONE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_NONE"
        }
    ]
}

print(f"Testing with safetySettings...")

try:
    response = requests.post(
        url,
        json=body_with_safety,
        headers={"Content-Type": "application/json"},
        timeout=10
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ SUCCESS with safety settings!")
        data = response.json()
        if 'candidates' in data:
            text = data['candidates'][0]['content']['parts'][0]['text']
            print(f"Response: {text[:100]}")
    else:
        print("❌ FAILED")
        try:
            error = response.json()
            print(json.dumps(error, indent=2)[:300])
        except:
            print(response.text[:300])
            
except Exception as e:
    print(f"Exception: {e}")

# Test 3: Full workflow payload
print("\n\n[TEST 3] FULL WORKFLOW PAYLOAD")
print("-"*70)

full_payload = {
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

print(f"Testing with full workflow payload...")
print(f"Text length: {len(full_payload['contents'][0]['parts'][0]['text'])} chars")

try:
    response = requests.post(
        url,
        json=full_payload,
        headers={"Content-Type": "application/json"},
        timeout=15
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ SUCCESS!")
        data = response.json()
        if 'candidates' in data and data['candidates']:
            text = data['candidates'][0]['content']['parts'][0]['text']
            print(f"\nGenerated Report (first 500 chars):")
            print(text[:500])
    else:
        print("❌ FAILED")
        print(f"Full Error Response:")
        print(response.text)
            
except Exception as e:
    print(f"Exception: {e}")

print("\n" + "="*70)
print("SUMMARY")
print("="*70)
print("""
If TEST 1 works but others fail:
  → Problem might be with the long text or specific formatting

If TEST 2 works better:
  → Add safetySettings to the n8n node

If all fail:
  → API key might be invalid or expired
  → Check if API is enabled in Google Cloud
""")
