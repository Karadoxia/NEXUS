#!/usr/bin/env python3
"""Create N8N admin user directly in database"""
import subprocess
import json
import bcrypt
import uuid

EMAIL = "caspertech92@gmail.com"
PASSWORD = "C@sper@22032011"
FIRST_NAME = "Nexus"
LAST_NAME = "Admin"

# Hash the password
password_hash = bcrypt.hashpw(PASSWORD.encode(), bcrypt.gensalt()).decode()
print(f"Password hash: {password_hash[:20]}...")

# First, delete existing users
subprocess.run(
    ["docker", "exec", "nexus-postgres", "psql", "-U", "nexus", "-d", "n8n", "-c",
     'DELETE FROM "user" WHERE email != \'\';'],
    check=False
)

# Create the admin user
user_id = str(uuid.uuid4())
insert_sql = f"""
INSERT INTO "user" (id, email, "firstName", "lastName", password, "roleSlug")
VALUES ('{user_id}', '{EMAIL}', '{FIRST_NAME}', '{LAST_NAME}', '{password_hash}', 'global:admin');
"""

result = subprocess.run(
    ["docker", "exec", "nexus-postgres", "psql", "-U", "nexus", "-d", "n8n", "-c", insert_sql],
    capture_output=True, text=True
)

if result.returncode == 0:
    print("✓ Admin user created successfully")
    print(f"  Email: {EMAIL}")
    print(f"  Password: {PASSWORD}")
else:
    print(f"✗ Error creating user: {result.stderr}")
    exit(1)

# Verify
verify_result = subprocess.run(
    ["docker", "exec", "nexus-postgres", "psql", "-U", "nexus", "-d", "n8n", "-c",
     "SELECT email FROM \"user\" WHERE email != '';"],
    capture_output=True, text=True
)
print(f"\nVerification:\n{verify_result.stdout}")
