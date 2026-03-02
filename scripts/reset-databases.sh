#!/bin/bash

# ============================================================
# NEXUS DATABASE RESET SCRIPT
#
# DANGER: This will DELETE all data in all databases!
# Usage: ./scripts/reset-databases.sh [--with-migrations]
#
# Options:
#   --with-migrations    Also run Prisma migrations after reset
#   --seed               Also seed with test data
# ============================================================

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
WITH_MIGRATIONS=false
WITH_SEED=false

for arg in "$@"; do
  case "$arg" in
    --with-migrations) WITH_MIGRATIONS=true ;;
    --seed) WITH_SEED=true ;;
  esac
done

echo -e "${YELLOW}⚠️  DATABASE RESET WARNING${NC}"
echo "This will DELETE ALL data in:"
echo "  - nexus_v2 (commerce database)"
echo "  - nexus_hr (employee database)"
echo "  - nexus_ai (ML/AI database)"
echo ""
read -p "Type 'YES' to continue: " confirm
if [ "$confirm" != "YES" ]; then
  echo "Cancelled."
  exit 0
fi

echo ""
echo -e "${YELLOW}🔄 Starting database reset...${NC}"

# Ensure containers are running
echo "Checking Docker containers..."
if ! docker-compose ps postgres | grep -q "Up"; then
  echo -e "${YELLOW}Starting PostgreSQL containers...${NC}"
  docker-compose up -d postgres postgres-ai
  sleep 5
fi

# Get database password from Docker secrets or .env
if [ -f db_password.txt ]; then
  DB_PASSWORD=$(cat db_password.txt)
else
  DB_PASSWORD="${DB_PASSWORD:-password}"
fi

export PGPASSWORD=$DB_PASSWORD

# Reset nexus_v2 database
echo ""
echo -e "${YELLOW}🗑️  Dropping nexus_v2 database...${NC}"
docker-compose exec -T postgres psql -U nexus -h localhost -c "DROP DATABASE IF EXISTS nexus_v2;" || true
echo -e "${GREEN}✅ Created fresh nexus_v2${NC}"

# Create nexus_v2 database
docker-compose exec -T postgres psql -U nexus -h localhost -c "CREATE DATABASE nexus_v2;"

# Reset nexus_hr database
echo ""
echo -e "${YELLOW}🗑️  Dropping nexus_hr database...${NC}"
docker-compose exec -T postgres psql -U nexus -h localhost -c "DROP DATABASE IF EXISTS nexus_hr;" || true
docker-compose exec -T postgres psql -U nexus -h localhost -c "CREATE DATABASE nexus_hr;"
echo -e "${GREEN}✅ Created fresh nexus_hr${NC}"

# Reset nexus_ai database
echo ""
echo -e "${YELLOW}🗑️  Dropping nexus_ai database...${NC}"
docker-compose exec -T postgres-ai psql -U nexus_ai -h localhost -c "DROP DATABASE IF EXISTS nexus_ai;" || true
docker-compose exec -T postgres-ai psql -U nexus_ai -h localhost -c "CREATE DATABASE nexus_ai;"
echo -e "${GREEN}✅ Created fresh nexus_ai${NC}"

# Run migrations if requested
if [ "$WITH_MIGRATIONS" = true ]; then
  echo ""
  echo -e "${YELLOW}📦 Running Prisma migrations...${NC}"

  echo "Migrating nexus_v2..."
  npx prisma migrate deploy --schema=prisma/schema.prisma

  echo "Migrating nexus_hr..."
  npx prisma migrate deploy --schema=prisma/schema.hr.prisma

  echo "Migrating nexus_ai..."
  npx prisma migrate deploy --schema=prisma/schema.ai.prisma

  echo -e "${GREEN}✅ Migrations complete${NC}"
fi

# Seed with test data if requested
if [ "$WITH_SEED" = true ]; then
  echo ""
  echo -e "${YELLOW}🌱 Seeding test data...${NC}"

  npx prisma db seed

  echo ""
  echo "Seeding HR test accounts..."
  docker-compose exec -T postgres psql -U nexus -h localhost -d nexus_hr << 'EOF'
INSERT INTO "Employee" (id, email, name, "hashedPassword", role, "isActive", "createdAt", "createdBy") VALUES
  ('emp-001', 'caspertech92@gmail.com', 'Admin User', '$2b$10$p2KpyCEI5.FyUwpfph4Xper3ajTC5oYq/VanGzDBX2dUd68b.TsxC', 'ADMIN', true, NOW(), 'system'),
  ('emp-002', 'admin@example.com', 'Secondary Admin', '$2b$10$p2KpyCEI5.FyUwpfph4Xper3ajTC5oYq/VanGzDBX2dUd68b.TsxC', 'ADMIN', true, NOW(), 'system');
EOF

  echo -e "${GREEN}✅ Test data seeded${NC}"
fi

echo ""
echo -e "${GREEN}✅ Database reset complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update n8n workflows with fresh database references"
echo "2. Restart services: docker-compose restart"
echo "3. Test login/signup endpoints"
echo "4. Verify n8n workflows can connect to databases"
echo ""
echo "Database Connection Strings:"
echo "  nexus_v2: postgresql://nexus:$DB_PASSWORD@localhost:5432/nexus_v2"
echo "  nexus_hr: postgresql://nexus:$DB_PASSWORD@localhost:5432/nexus_hr"
echo "  nexus_ai: postgresql://nexus_ai:$DB_PASSWORD@localhost:5432/nexus_ai"
