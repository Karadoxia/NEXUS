# LDAP & Identity Services Configuration Summary

**Date**: March 5, 2026  
**System**: NEXUS-V2 Identity Services Stack

---

## 🎯 Current Configuration

### LDAP Directory (LLDAP)

**Base Configuration:**
- **Base DN**: `dc=nexus-io,dc=org` ✅ (Updated from dc=yourshop,dc=com)
- **Container**: `nexus-lldap`
- **Image**: `lldap/lldap:stable`
- **Ports**: 
  - LDAP: `127.0.0.1:3890:3890` (internal only)
  - Web UI: `17170:17170` (public)
- **Web UI**: http://localhost:17170

**Environment Variables:**
```bash
LLDAP_JWT_SECRET=${LLDAP_JWT_SECRET}
LLDAP_LDAP_USER_PASS=${LLDAP_ADMIN_PASSWORD}
LLDAP_LDAP_BASE_DN=dc=nexus-io,dc=org
```

**Security Changes Made:**
- ✅ Removed `user: "1000:1000"` - LLDAP needs root for initialization
- ✅ Removed `cap_drop: ALL` - LLDAP needs capabilities to manage /data folder
- ✅ Kept `security_opt: no-new-privileges:true` for security

**Data Persistence:**
- Volume: `lldap-data:/data`

---

### Keycloak (OAuth2/OIDC)

**Base Configuration:**
- **Container**: `nexus-keycloak`
- **Image**: `quay.io/keycloak/keycloak:latest`
- **Port**: `8180:8080`
- **Admin UI**: http://localhost:8180
- **Database**: PostgreSQL (keycloak database)

**Environment Variables:**
```bash
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD:-change-me}
KC_DB=postgres
KC_DB_URL=jdbc:postgresql://postgres:5432/keycloak
KC_DB_USERNAME=keycloak
KC_DB_PASSWORD=${DB_PASSWORD}
KC_PROXY=edge
KC_HOSTNAME_STRICT=false
KC_HTTP_ENABLED=true
```

**Security Changes Made:**
- ✅ Removed `user: "1000:1000"` - Keycloak needs proper permissions
- ✅ Removed `cap_drop: ALL` - Keycloak needs capabilities
- ✅ Added `command: start` - Explicit start command

**Database Setup:**
```sql
Database: keycloak
Owner: keycloak
Password: your_strong_server_password
Permissions: ALL ON SCHEMA public
```

---

### Semaphore (Ansible Automation)

**Base Configuration:**
- **Container**: `nexus-semaphore`
- **Image**: `semaphoreui/semaphore:latest`
- **Port**: `3001:3000`
- **Admin UI**: http://localhost:3001
- **Database**: PostgreSQL (semaphore database)

**Environment Variables:**
```bash
SEMAPHORE_DB_USER=semaphore
SEMAPHORE_DB_PASS=${DB_PASSWORD}
SEMAPHORE_DB_HOST=postgres
SEMAPHORE_DB_PORT=5432
SEMAPHORE_DB_DIALECT=postgres
SEMAPHORE_DB=semaphore
SEMAPHORE_ADMIN=admin
SEMAPHORE_ADMIN_EMAIL=caspertech78@gmail.com
SEMAPHORE_ADMIN_PASSWORD=${SEMAPHORE_ADMIN_PASSWORD:-change-me}
```

**LDAP Integration (Updated):**
```bash
SEMAPHORE_LDAP_ACTIVATED=yes
SEMAPHORE_LDAP_HOST=lldap
SEMAPHORE_LDAP_PORT=3890
SEMAPHORE_LDAP_DN_BIND=cn=svc.readonly,ou=people,dc=nexus-io,dc=org
SEMAPHORE_LDAP_PASSWORD=${LDAP_READONLY_PASSWORD:-change-me}
SEMAPHORE_LDAP_DN_SEARCH=dc=nexus-io,dc=org
SEMAPHORE_LDAP_SEARCH_FILTER=(&(uid=%s)(memberOf=cn=infra_admins,ou=groups,dc=nexus-io,dc=org))
```

**Security Changes Made:**
- ✅ Removed `user: "1000:1000"` - Semaphore needs proper permissions
- ✅ Removed `cap_drop: ALL` - Semaphore needs capabilities

**Database Setup:**
```sql
Database: semaphore
Owner: semaphore
Password: your_strong_server_password
Permissions: ALL ON SCHEMA public + CREATE
```

---

## 🔧 Issues Fixed

### 1. LLDAP Permission Errors ✅
**Problem**: Container kept restarting with "chown: Operation not permitted"

**Root Cause**: Running as non-root user (`1000:1000`) prevented LLDAP from setting up /data folder permissions

**Solution**: 
- Removed `user: "1000:1000"` directive
- Removed `cap_drop: ALL` to allow necessary capabilities
- Maintained `no-new-privileges:true` for security

**Result**: LLDAP starts successfully and maintains healthy status

---

### 2. Keycloak Help Screen Loop ✅
**Problem**: Container showed help screen instead of starting server

**Root Cause**: Missing explicit start command

**Solution**: Added `command: start` to docker-compose.yml

**Result**: Keycloak starts in production mode properly

---

### 3. Semaphore Database Permission Errors ✅
**Problem**: "permission denied for schema public" and "relation migrations does not exist"

**Root Cause**: 
- Database existed but owned by `nexus` user
- Schema `public` owned by `pg_database_owner`
- Semaphore user lacked CREATE permissions

**Solution**:
```sql
ALTER DATABASE semaphore OWNER TO semaphore;
ALTER SCHEMA public OWNER TO semaphore;
GRANT ALL ON SCHEMA public TO semaphore;
GRANT CREATE ON SCHEMA public TO semaphore;
```

**Result**: Semaphore can now create migrations table and initialize

---

### 4. LDAP Base DN Update ✅
**Problem**: Using placeholder domain `dc=yourshop,dc=com`

**Solution**: Updated to `dc=nexus-io,dc=org` to match nexus-io.duckdns.org domain

**Affected Services**:
- LLDAP configuration
- Semaphore LDAP integration
- Keycloak federation (when configured)

---

## 📋 Database Configuration

### PostgreSQL Databases Created

| Database | Owner | Purpose | Password |
|----------|-------|---------|----------|
| keycloak | keycloak | Keycloak identity store | ${DB_PASSWORD} |
| semaphore | semaphore | Semaphore automation | ${DB_PASSWORD} |

### Database Users

```sql
-- Keycloak user
CREATE USER keycloak WITH PASSWORD 'your_strong_server_password';
ALTER DATABASE keycloak OWNER TO keycloak;
GRANT ALL ON SCHEMA public TO keycloak;

-- Semaphore user  
CREATE USER semaphore WITH PASSWORD 'your_strong_server_password';
ALTER DATABASE semaphore OWNER TO semaphore;
GRANT ALL ON SCHEMA public TO semaphore;
```

---

## 🚀 Quick Start Commands

### Check Service Status
```bash
docker ps | grep -E "lldap|keycloak|semaphore"
```

### View Logs
```bash
docker logs nexus-lldap --tail 50
docker logs nexus-keycloak --tail 50
docker logs nexus-semaphore --tail 50
```

### Restart Services
```bash
docker restart nexus-lldap
docker restart nexus-keycloak
docker restart nexus-semaphore
```

### Run Diagnostic Script
```bash
chmod +x debug_ldap_semaphore.sh
./debug_ldap_semaphore.sh
```

### Run Complete Fix
```bash
chmod +x fix_identity_services.sh
./fix_identity_services.sh
```

---

## 🔐 Security Considerations

### What We Removed (and Why)

1. **`user: "1000:1000"`**
   - **Why removed**: Services need proper initialization permissions
   - **Security impact**: Containers run as their default users (usually root for setup, then drop privileges)
   - **Mitigation**: `no-new-privileges:true` still enforced

2. **`cap_drop: ALL`**
   - **Why removed**: Too restrictive for service initialization
   - **Security impact**: Services have default capabilities
   - **Mitigation**: 
     - `no-new-privileges:true` prevents privilege escalation
     - Services run in isolated networks
     - No external port exposure for LDAP (127.0.0.1 binding)

### What We Kept

- ✅ `security_opt: no-new-privileges:true` (all services)
- ✅ Network isolation (separate networks for identity, backend, proxy)
- ✅ Internal-only LDAP port (127.0.0.1:3890)
- ✅ Resource limits (CPU/memory constraints)
- ✅ Health checks with retry logic

---

## 📊 Service Dependencies

```
PostgreSQL (healthy)
    ├── Keycloak (depends_on: postgres)
    └── Semaphore (depends_on: postgres)

LLDAP (healthy)
    └── Semaphore (depends_on: lldap)
```

All services wait for PostgreSQL to be healthy before starting.
Semaphore additionally waits for LLDAP to be healthy.

---

## 🌐 Network Configuration

### Networks Used

- **`backend`**: Database connectivity
- **`identity`**: LDAP/authentication services
- **`infrastructure`**: Semaphore playbook execution
- **`proxy`**: Traefik reverse proxy

### Port Mappings

| Service | Internal Port | External Port | Access |
|---------|---------------|---------------|--------|
| LLDAP (LDAP) | 3890 | 127.0.0.1:3890 | Internal only |
| LLDAP (Web) | 17170 | 17170 | Public |
| Keycloak | 8080 | 8180 | Public |
| Semaphore | 3000 | 3001 | Public |

---

## ✅ Verification Steps

1. **Check all containers are running:**
   ```bash
   docker ps | grep -E "lldap|keycloak|semaphore"
   ```
   Expected: All 3 containers showing "Up" status

2. **Verify LLDAP is healthy:**
   ```bash
   docker inspect nexus-lldap --format='{{.State.Health.Status}}'
   ```
   Expected: `healthy`

3. **Test LLDAP web interface:**
   - Open: http://localhost:17170
   - Should show LLDAP login screen

4. **Test Keycloak admin console:**
   - Open: http://localhost:8180
   - Login: admin / ${KEYCLOAK_ADMIN_PASSWORD}

5. **Test Semaphore UI:**
   - Open: http://localhost:3001
   - Should show Semaphore login/setup screen

6. **Test database connections:**
   ```bash
   docker exec nexus-postgres psql -U semaphore -d semaphore -c "SELECT 1;"
   docker exec nexus-postgres psql -U keycloak -d keycloak -c "SELECT 1;"
   ```
   Expected: Both return `1`

---

## 🐛 Troubleshooting

### LLDAP Won't Start

**Symptoms**: Container exits immediately or restarts repeatedly

**Check logs:**
```bash
docker logs nexus-lldap --tail 50
```

**Common issues:**
- Volume permission errors → Remove volume and restart
- Port already in use → Check `netstat -tulpn | grep 17170`
- Configuration errors → Verify LLDAP_* environment variables

**Fix:**
```bash
docker stop nexus-lldap
docker rm nexus-lldap
docker volume rm nexus-v2_lldap-data
./fix_identity_services.sh
```

---

### Semaphore Database Errors

**Symptoms**: "permission denied for schema public"

**Check:**
```bash
docker exec nexus-postgres psql -U nexus -d semaphore -c "\dn+"
```

**Fix:**
```bash
docker exec nexus-postgres psql -U nexus -d semaphore << 'EOF'
ALTER SCHEMA public OWNER TO semaphore;
GRANT ALL ON SCHEMA public TO semaphore;
EOF
docker restart nexus-semaphore
```

---

### Keycloak Won't Initialize

**Symptoms**: Container shows help screen or exits

**Check:**
```bash
docker logs nexus-keycloak --tail 50
```

**Common issues:**
- Database connection failed → Check keycloak database exists
- Missing start command → Verify `command: start` in docker-compose.yml

**Fix:**
```bash
./fix_identity_services.sh
```

---

## 📝 Next Steps

### 1. Configure LLDAP Users and Groups

Access LLDAP web interface (http://localhost:17170) and create:
- Service account: `svc.readonly` (for Semaphore/Keycloak LDAP queries)
- Groups: `infra_admins`, `developers`, `operators`
- Users: Your team members

### 2. Configure Keycloak Federation

Connect Keycloak to LLDAP:
- Navigate to: User Federation → Add LDAP
- LDAP URL: `ldap://lldap:3890`
- Base DN: `dc=nexus-io,dc=org`
- Bind DN: `cn=svc.readonly,ou=people,dc=nexus-io,dc=org`

### 3. Test Semaphore LDAP Login

Once LLDAP is configured with users:
- Try logging into Semaphore with LDAP credentials
- User must be in `infra_admins` group (per search filter)

### 4. Update Password Defaults

Edit `.env` and set proper passwords:
```bash
LLDAP_ADMIN_PASSWORD=<strong-password>
KEYCLOAK_ADMIN_PASSWORD=<strong-password>
SEMAPHORE_ADMIN_PASSWORD=<strong-password>
LDAP_READONLY_PASSWORD=<strong-password>
```

Then restart services:
```bash
docker restart nexus-lldap nexus-keycloak nexus-semaphore
```

---

## 📚 Additional Resources

- **LLDAP Documentation**: https://github.com/lldap/lldap
- **Keycloak Documentation**: https://www.keycloak.org/documentation
- **Semaphore Documentation**: https://docs.semaphoreui.com/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

**Configuration Summary Generated**: March 5, 2026  
**Last Updated**: After fixing all identity service issues
