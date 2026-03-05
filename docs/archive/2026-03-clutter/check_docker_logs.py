#!/usr/bin/env python3
"""
List docker containers and find n8n
"""
import subprocess

result = subprocess.run(
    ["docker", "ps", "-a"],
    capture_output=True,
    text=True,
    timeout=10
)

print("="*70)
print("DOCKER CONTAINERS")
print("="*70)
print(result.stdout)

# Find n8n container
if "n8n" in result.stdout.lower():
    print("\n✅ n8n container found")
    # Extract container name
    for line in result.stdout.split('\n'):
        if 'n8n' in line.lower():
            parts = line.split()
            if parts:
                container_name = parts[-1]
                print(f"Container name: {container_name}")
                
                # Get logs
                print("\n" + "="*70)
                print("N8N LOGS (Last 150 lines)")
                print("="*70)
                log_result = subprocess.run(
                    ["docker", "logs", "-n", "150", container_name],
                    capture_output=True,
                    text=True,
                    timeout=15
                )
                print(log_result.stdout)
                
                # Filter error lines
                lines = log_result.stdout.split('\n')
                error_lines = [line for line in lines if any(x in line.lower() for x in ['error', 'send report', 'undefined', 'status', 'resend'])]
                
                if error_lines:
                    print("\n" + "="*70)
                    print("RELEVANT ERROR LINES")
                    print("="*70)
                    for line in error_lines[-30:]:
                        print(line)
                break
else:
    print("❌ No n8n container found")
