#!/usr/bin/env python3
"""
Get detailed workflow execution logs to see exact error messages
"""
import subprocess
import json

print("="*70)
print("GETTING N8N CONTAINER LOGS")
print("="*70)

result = subprocess.run(
    ["docker", "logs", "-n", "200", "$(docker ps -q -f name=n8n)"],
    capture_output=True,
    text=True,
    shell=True,
    timeout=15
)

print(result.stdout)

# Also check docker ps to find correct container
print("\n" + "="*70)
print("DOCKER CONTAINERS")
print("="*70)

ps_result = subprocess.run(["docker", "ps"], capture_output=True, text=True)
print(ps_result.stdout)

# Find n8n container and get logs
print("\n" + "="*70)
print("FINDING N8N CONTAINER")
print("="*70)

lines = ps_result.stdout.split('\n')
for line in lines:
    if 'n8n' in line.lower():
        print(line)
        # Extract container ID
        parts = line.split()
        if parts:
            container_id = parts[0]
            print(f"\nGetting logs for container: {container_id}")
            
            log_result = subprocess.run(
                ["docker", "logs", "-n", "300", container_id],
                capture_output=True,
                text=True,
                timeout=15
            )
            
            # Print last 100 lines
            log_lines = log_result.stdout.split('\n')
            print("\nLast 100 lines of logs:")
            for line in log_lines[-100:]:
                if line and any(x in line.lower() for x in ['error', 'send report', 'notify', 'undefined', 'status', 'access', 'denied']):
                    print(line)
