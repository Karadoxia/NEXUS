#!/usr/bin/env python3
"""
Get n8n container logs to see the actual error
"""
import subprocess
import json

print("="*70)
print("FETCHING N8N DOCKER LOGS")
print("="*70)

# Get n8n container logs
result = subprocess.run(
    ["docker", "logs", "-n", "100", "nexus-n8n"],
    capture_output=True,
    text=True,
    timeout=10
)

print("\n" + "="*70)
print("N8N CONTAINER LOGS (Last 100 lines)")
print("="*70)
print(result.stdout)

if result.stderr:
    print("\nSTDERR:")
    print(result.stderr)

# Try to find error messages
lines = result.stdout.split('\n')
error_lines = [line for line in lines if 'error' in line.lower() or 'send report' in line.lower() or 'status' in line.lower()]

if error_lines:
    print("\n" + "="*70)
    print("POTENTIAL ERROR LINES")
    print("="*70)
    for line in error_lines[-20:]:  # Last 20 error-related lines
        print(line)
