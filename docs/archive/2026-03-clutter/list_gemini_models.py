#!/usr/bin/env python3
"""
List available Gemini models
"""
import requests
import json
import os
from pathlib import Path

# Get API key
gemini_key = None
key_file_paths = [
    "/home/redbend/Desktop/Local-Projects/NEXUS-V2/000-MyNotes/APIs/GEMINI-API",
    "/home/redbend/Desktop/Local-Projects/NEXUS-V2/gemini_key.txt",
]

for path in key_file_paths:
    if Path(path).exists():
        with open(path, 'r') as f:
            content = f.read().strip()
            if content.startswith("AIza"):
                gemini_key = content.split('\n')[0].strip()
                break

if not gemini_key:
    gemini_key = os.getenv("GEMINI_API_KEY")
    
if not gemini_key:
    print("❌ No API key found")
    exit(1)

print("="*70)
print("LISTING AVAILABLE GEMINI MODELS")
print("="*70)

# Try to list models
endpoints = [
    f"https://generativelanguage.googleapis.com/v1beta/models?key={gemini_key}",
    f"https://generativelanguage.googleapis.com/v1/models?key={gemini_key}",
]

for url in endpoints:
    version = "v1beta" if "v1beta" in url else "v1"
    print(f"\n→ Fetching models from {version}...")
    
    try:
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            models = data.get('models', [])
            
            print(f"✅ Found {len(models)} models:\n")
            
            for model in models:
                model_name = model.get('name', '').split('/')[-1]
                display_name = model.get('displayName', model_name)
                methods = model.get('supportedGenerationMethods', [])
                
                if 'generateContent' in methods:
                    print(f"  ✅ {model_name}")
                    print(f"     Display: {display_name}")
                    print(f"     Methods: {', '.join(methods)}")
                    print()
            
            # Find the best model
            print("="*70)
            print("RECOMMENDED MODEL")
            print("="*70)
            
            # Prefer flash models for speed/cost
            best_model = None
            for model in models:
                name = model.get('name', '').split('/')[-1]
                if 'generateContent' in model.get('supportedGenerationMethods', []):
                    if 'flash' in name.lower():
                        best_model = name
                        break
            
            if not best_model:
                # Fallback to any available model
                for model in models:
                    name = model.get('name', '').split('/')[-1]
                    if 'generateContent' in model.get('supportedGenerationMethods', []):
                        best_model = name
                        break
            
            if best_model:
                print(f"\nUse this model: {best_model}")
                print(f"\nUpdate n8n workflow URL to:")
                print(f"https://generativelanguage.googleapis.com/{version}/models/{best_model}:generateContent?key={{{{ $env.GEMINI_API_KEY }}}}")
            
            break
        else:
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text[:200]}")
            
    except Exception as e:
        print(f"Error: {e}")
