#!/usr/bin/env python3
"""
If still failing, capture n8n error logs
"""
import subprocess
import sys

print("["*35)
print("\nChecking n8n container logs for HTTP errors...")
print("\n" + "="*70)

# Check if docker-compose is available
result = subprocess.run(
    ["docker-compose", "logs", "n8n", "--tail=100"],
    capture_output=True,
    text=True,
    cwd="/home/redbend/Desktop/Local-Projects/NEXUS-V2",
    timeout=10
)

if result.returncode == 0:
    print("N8N Container Logs (last 100 lines):")
    print("-"*70)
    print(result.stdout)
    
    # Look for errors
    if "Bad request" in result.stdout or "400" in result.stdout:
        print("\n⚠️  Found error references in logs!")
else:
    print("⚠️  Could not fetch logs. Is docker-compose running?")
    print(f"   Error: {result.stderr[:200]}")

print("\n" + "="*70)
print("""
If you see HTTP 400 errors, they'll show the exact parameter issue.

Send me:
  1. The exact error message from the "Gemini: Generate Report" node
  2. Any error details shown in the n8n UI
  3. The output above
""")
