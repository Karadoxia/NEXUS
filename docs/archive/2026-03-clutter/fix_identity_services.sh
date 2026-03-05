#!/bin/bash
# Complete Fix Script for LDAP and Semaphore Issues
# Run this if services are failing to start
# Created: March 5, 2026

set -e

echo "=========================================="
echo "🔧 NEXUS Identity Services - Complete Fix"
echo "=========================================="
echo ""

# Source environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "Step 1: Fixing PostgreSQL Database Setup"
echo "=========================================="

echo "Creating/updating databases and users..."
docker exec nexus-postgres psql -U nexus -d postgres << 'EOF'
-- Create databases if they don't exist
SELECT 'CREATE DATABASE semaphore' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'semaphore')\gexec
SELECT 'CREATE DATABASE keycloak' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'keycloak')\gexec

-- Create users if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'semaphore') THEN
    CREATE USER semaphore WITH PASSWORD 'your_strong_server_password';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'keycloak') THEN
    CREATE USER keycloak WITH PASSWORD 'your_strong_server_password';
  END IF;
END
$$;

-- Update passwords
ALTER USER semaphore WITH PASSWORD 'your_strong_server_password';
ALTER USER keycloak WITH PASSWORD 'your_strong_server_password';

-- Set database ownership
ALTER DATABASE semaphore OWNER TO semaphore;
ALTER DATABASE keycloak OWNER TO keycloak;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE semaphore TO semaphore;
GRANT ALL PRIVILEGES ON DATABASE keycloak TO keycloak;
EOF

echo "✓ Databases and users configured"
echo ""

echo "Step 2: Fixing Schema Permissions"
echo "=========================================="

echo "Granting semaphore schema permissions..."
docker exec nexus-postgres psql -U nexus -d semaphore << 'EOF'
-- Grant all permissions on public schema
GRANT ALL ON SCHEMA public TO semaphore;
GRANT CREATE ON SCHEMA public TO semaphore;
GRANT USAGE ON SCHEMA public TO semaphore;

-- Change schema ownership
ALTER SCHEMA public OWNER TO semaphore;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO semaphore;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO semaphore;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO semaphore;
EOF

echo "Granting keycloak schema permissions..."
docker exec nexus-postgres psql -U nexus -d keycloak << 'EOF'
-- Grant all permissions on public schema
GRANT ALL ON SCHEMA public TO keycloak;
GRANT CREATE ON SCHEMA public TO keycloak;
GRANT USAGE ON SCHEMA public TO keycloak;

-- Change schema ownership
ALTER SCHEMA public OWNER TO keycloak;

-- Grant default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO keycloak;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO keycloak;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO keycloak;
EOF

echo "✓ Schema permissions configured"
echo ""

echo "Step 3: Cleaning Up Failed Containers"
echo "=========================================="

echo "Stopping containers..."
docker stop nexus-semaphore nexus-keycloak 2>/dev/null || true
docker stop nexus-lldap 2>/dev/null || true

echo "Removing containers..."
docker rm nexus-semaphore nexus-keycloak 2>/dev/null || true
docker rm nexus-lldap 2>/dev/null || true

echo "✓ Old containers removed"
echo ""

echo "Step 4: Starting Services"
echo "=========================================="

# Get the compose project directory
PROJECT_DIR="/mnt/Data_Disk/2027-Projects/NEXUS-PROJECT/00-2027-MyLocalServer"

echo "Starting LLDAP..."
docker compose --project-directory "$PROJECT_DIR" -p nexus-v2 up -d lldap

echo "Waiting for LLDAP to be healthy (30s)..."
for i in {1..30}; do
    if docker inspect nexus-lldap --format='{{.State.Health.Status}}' 2>/dev/null | grep -q "healthy"; then
        echo "✓ LLDAP is healthy"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

echo "Starting Keycloak..."
docker compose --project-directory "$PROJECT_DIR" -p nexus-v2 up -d keycloak

echo "Starting Semaphore..."
docker compose --project-directory "$PROJECT_DIR" -p nexus-v2 up -d semaphore

echo ""
echo "Step 5: Monitoring Service Startup"
echo "=========================================="

echo "Waiting 20 seconds for services to initialize..."
sleep 20

echo ""
echo "Current Status:"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "NAME|lldap|semaphore|keycloak"

echo ""
echo "=========================================="
echo "✅ Fix Complete!"
echo "=========================================="
echo ""
echo "Service URLs:"
echo "  LLDAP:     http://localhost:17170"
echo "  Keycloak:  http://localhost:8180"
echo "  Semaphore: http://localhost:3001"
echo ""
echo "LDAP Configuration:"
echo "  Base DN:   dc=nexus-io,dc=org"
echo "  Port:      3890"
echo ""
echo "Default Credentials:"
echo "  LLDAP Admin: Check LLDAP_ADMIN_PASSWORD in .env"
echo "  Keycloak Admin: admin / (Check KEYCLOAK_ADMIN_PASSWORD in .env)"
echo "  Semaphore Admin: admin / (Check SEMAPHORE_ADMIN_PASSWORD in .env)"
echo ""
echo "To check logs:"
echo "  docker logs nexus-lldap"
echo "  docker logs nexus-keycloak"
echo "  docker logs nexus-semaphore"
echo ""
