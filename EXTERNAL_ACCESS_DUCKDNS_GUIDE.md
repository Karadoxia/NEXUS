# 🌍 EXTERNAL ACCESS SETUP — DuckDNS + Port Forwarding

**Domain**: nexus-io.duckdns.org  
**Status**: 🟡 IN PROGRESS (Port forwarding being configured)  
**Goal**: Allow external traffic to reach NEXUS-V2 services  
**Security Level**: CRITICAL — Follow every step carefully  

---

## 🎯 WHAT YOU'RE DOING

You're opening your home/office network to the internet. This is **powerful** but requires **perfect security**.

**Before**: Services only accessible on local network (192.168.x.x)  
**After**: Services accessible from anywhere via nexus-io.duckdns.org  

---

## 🔧 ARCHITECTURE

```
INTERNET
   │
   ▼
┌──────────────────────────────────────────────────────┐
│ YOUR ROUTER (Public IP from ISP)                     │
│ External: 203.0.113.45 (example)                     │
├──────────────────────────────────────────────────────┤
│ PORT FORWARDING RULES:                               │
│   80   → 192.168.x.x:80   (HTTP → Nginx PM)         │
│   443  → 192.168.x.x:443  (HTTPS → Nginx PM)        │
│   81   → 192.168.x.x:81   (Nginx PM Admin — BLOCK!) │
│   (Other ports — DENY ALL by default)               │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│ YOUR SERVER (192.168.x.x)                            │
├──────────────────────────────────────────────────────┤
│ NGINX PROXY MANAGER (ports 80, 443, 81)             │
│   ├─ :80  → Redirects to HTTPS                      │
│   ├─ :443 → Routes by hostname                      │
│   │    ├─ nexus-io.duckdns.org → shop:3000         │
│   │    ├─ grafana.nexus-io.duckdns.org → grafana   │
│   │    ├─ n8n.nexus-io.duckdns.org → n8n           │
│   │    └─ lldap.nexus-io.duckdns.org → lldap:17170 │
│   └─ :81 → Admin UI (MUST firewall from external!)  │
└──────────────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│ DOCKER SERVICES (backend network)                    │
│   ├─ shop-backend:3000                              │
│   ├─ grafana:3000                                   │
│   ├─ n8n:5678                                       │
│   ├─ lldap:17170                                    │
│   ├─ postgres:5432 (NEVER expose externally!)      │
│   ├─ redis:6379 (NEVER expose externally!)         │
│   └─ ... (30+ other services, all internal)        │
└──────────────────────────────────────────────────────┘
```

---

## ⚙️ STEP-BY-STEP SETUP (30 minutes)

### STEP 1: Configure DuckDNS (5 minutes)

DuckDNS gives you a free domain that auto-updates when your IP changes.

**1.1 — Get your DuckDNS token**
```bash
# Go to https://www.duckdns.org/
# Login with GitHub/Google
# You already have: nexus-io.duckdns.org
# Copy your token: abc123def456... (long string)
```

**1.2 — Set up auto-update script**
```bash
# Create DuckDNS update script
mkdir -p ~/scripts
cat > ~/scripts/duckdns-update.sh << 'EOF'
#!/bin/bash
# DuckDNS IP updater — runs every 5 minutes

DOMAIN="nexus-io"
TOKEN="YOUR_DUCKDNS_TOKEN_HERE"  # ← REPLACE THIS

echo url="https://www.duckdns.org/update?domains=${DOMAIN}&token=${TOKEN}&ip=" | curl -k -o ~/duckdns-last.log -K -

# Check result
if grep -q "OK" ~/duckdns-last.log; then
  echo "[$(date)] ✅ DuckDNS updated successfully" >> ~/duckdns.log
else
  echo "[$(date)] ❌ DuckDNS update failed" >> ~/duckdns.log
fi
EOF

chmod +x ~/scripts/duckdns-update.sh

# Replace YOUR_DUCKDNS_TOKEN_HERE with your actual token:
nano ~/scripts/duckdns-update.sh
```

**1.3 — Add to crontab (auto-update every 5 min)**
```bash
# Run manually first to test
~/scripts/duckdns-update.sh
cat ~/duckdns-last.log  # Should show "OK"

# Add to crontab
crontab -e

# Add this line (updates DuckDNS every 5 minutes):
*/5 * * * * ~/scripts/duckdns-update.sh
```

**1.4 — Verify DNS is working**
```bash
# Wait 1 minute after first run, then test:
dig nexus-io.duckdns.org

# Should show your public IP in the A record:
# ;; ANSWER SECTION:
# nexus-io.duckdns.org. 60 IN A 203.0.113.45
```

---

### STEP 2: Router Port Forwarding (10 minutes)

**CRITICAL SECURITY RULES**:
- ✅ Forward ONLY ports 80 and 443
- ❌ NEVER forward port 81 (Nginx PM admin)
- ❌ NEVER forward port 5432 (Postgres)
- ❌ NEVER forward port 6379 (Redis)
- ❌ NEVER forward port 3890 (LLDAP direct)
- ✅ Use firewall rules to block admin ports from external IPs

**2.1 — Find your server's local IP**
```bash
# On your NEXUS server:
ip addr show | grep "inet 192.168"
# Example output: inet 192.168.1.100/24

# OR
hostname -I
```

**2.2 — Log into your router**
```
Common router IPs:
  - 192.168.1.1 (most common)
  - 192.168.0.1
  - 192.168.2.1
  - 10.0.0.1

Login with your router admin credentials
```

**2.3 — Create port forwarding rules**
```
Navigate to: Advanced → Port Forwarding (or NAT)

Add these 2 rules ONLY:

Rule 1 — HTTP (for Let's Encrypt challenges):
  External Port: 80
  Internal IP: 192.168.1.100 (your server IP)
  Internal Port: 80
  Protocol: TCP
  Description: NEXUS-HTTP

Rule 2 — HTTPS (encrypted traffic):
  External Port: 443
  Internal IP: 192.168.1.100
  Internal Port: 443
  Protocol: TCP
  Description: NEXUS-HTTPS

DO NOT FORWARD:
  ❌ Port 81 (Nginx PM admin — would expose admin panel!)
  ❌ Port 5432 (Postgres — would expose database!)
  ❌ Port 6379 (Redis — would expose cache!)
  ❌ Any other internal service ports
```

**2.4 — Save and test**
```bash
# From OUTSIDE your network (use your phone's 4G/5G, not WiFi):
curl -I http://nexus-io.duckdns.org
# Should return HTTP response (may be redirect to HTTPS)

# OR use online checker:
# https://www.yougetsignal.com/tools/open-ports/
# Enter: nexus-io.duckdns.org
# Port: 443
# Should show: OPEN
```

---

### STEP 3: Nginx Proxy Manager Configuration (10 minutes)

Now you configure Nginx PM to handle incoming traffic.

**3.1 — Access Nginx PM Admin**
```bash
# From your LOCAL network only:
http://192.168.1.100:81

# Default credentials (if not changed yet):
Email: admin@example.com
Password: changeme

# ⚠️  CHANGE THESE IMMEDIATELY after login!
```

**3.2 — Add SSL certificate for nexus-io.duckdns.org**
```
Nginx PM → SSL Certificates → Add SSL Certificate

Certificate Type: Let's Encrypt
Domain Names: 
  - nexus-io.duckdns.org
  - *.nexus-io.duckdns.org  (wildcard for subdomains)

Email: caspertech78@gmail.com (for renewal notifications)
Use DNS Challenge: NO (use HTTP-01, our port 80 is open)
Agree to Terms of Service: YES

Click: Save

Wait 30-60 seconds — it will request from Let's Encrypt
Status should show: ✅ Active
```

**3.3 — Create proxy hosts for your services**

**Main Shop (nexus-io.duckdns.org)**
```
Nginx PM → Hosts → Proxy Hosts → Add Proxy Host

Details tab:
  Domain Names: nexus-io.duckdns.org
  Scheme: http
  Forward Hostname/IP: shop-backend  (Docker service name)
  Forward Port: 3000
  Cache Assets: YES
  Block Common Exploits: YES
  Websockets Support: YES

SSL tab:
  SSL Certificate: nexus-io.duckdns.org (the one we just created)
  Force SSL: YES
  HTTP/2 Support: YES
  HSTS Enabled: YES
  HSTS Subdomains: YES

Advanced tab (add this):
  # Rate limiting at Nginx level (defense in depth)
  limit_req_zone $binary_remote_addr zone=shop:10m rate=60r/m;
  limit_req zone=shop burst=30 nodelay;
  
  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  
  # Hide Nginx version
  server_tokens off;

Click: Save
```

**Grafana (grafana.nexus-io.duckdns.org)**
```
Add Proxy Host:
  Domain Names: grafana.nexus-io.duckdns.org
  Forward Hostname: grafana
  Forward Port: 3000
  SSL: nexus-io.duckdns.org (same cert, wildcard covers this)
  Force SSL: YES
  
Advanced:
  # Allow only authenticated users (Grafana has its own auth)
  # Optional: Add IP whitelist if you want extra protection
  # allow 203.0.113.0/24;  # Your office IP range
  # deny all;
```

**N8N (n8n.nexus-io.duckdns.org)**
```
Add Proxy Host:
  Domain Names: n8n.nexus-io.duckdns.org
  Forward Hostname: n8n
  Forward Port: 5678
  SSL: nexus-io.duckdns.org
  Force SSL: YES
  Websockets: YES (for N8N editor)

Advanced:
  # N8N should have authentication enabled
  # Extra protection: IP whitelist
  allow YOUR_OFFICE_IP_HERE;
  deny all;
```

**LLDAP (lldap.nexus-io.duckdns.org)**
```
Add Proxy Host:
  Domain Names: lldap.nexus-io.duckdns.org
  Forward Hostname: lldap
  Forward Port: 17170
  SSL: nexus-io.duckdns.org
  Force SSL: YES

Advanced:
  # LLDAP admin UI — VERY sensitive
  # REQUIRE IP whitelist:
  allow YOUR_HOME_IP;
  allow YOUR_OFFICE_IP;
  deny all;
```

---

### STEP 4: Firewall Hardening (5 minutes)

**CRITICAL**: Even though you forwarded ports 80/443, you MUST firewall other ports.

**4.1 — On your server (Ubuntu/Debian with UFW)**
```bash
# Enable UFW if not already
sudo ufw enable

# Allow SSH (so you don't lock yourself out)
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS from anywhere (your router forwards these)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# DENY everything else from outside
# (Docker services on backend network are already isolated)

# Allow from local network only (for admin access)
sudo ufw allow from 192.168.1.0/24 to any port 81 proto tcp  # Nginx PM admin

# Block common attack ports
sudo ufw deny 3306/tcp  # MySQL (if you had it)
sudo ufw deny 5432/tcp  # Postgres
sudo ufw deny 6379/tcp  # Redis
sudo ufw deny 27017/tcp # MongoDB (if you had it)

# Check rules
sudo ufw status numbered

# Should show:
# 1. 22/tcp ALLOW Anywhere
# 2. 80/tcp ALLOW Anywhere
# 3. 443/tcp ALLOW Anywhere
# 4. 81/tcp ALLOW 192.168.1.0/24
# 5. 5432/tcp DENY Anywhere
# 6. 6379/tcp DENY Anywhere
```

**4.2 — Enable CrowdSec (you already have this!)**
```bash
# Verify CrowdSec is running
docker ps | grep crowdsec

# Check CrowdSec is blocking attackers
docker exec crowdsec cscli decisions list

# Install bouncer for Nginx if not already
docker exec crowdsec cscli bouncers add nginx-bouncer

# Get API key, configure in Nginx PM
```

**4.3 — Enable Fail2Ban for SSH (extra protection)**
```bash
sudo apt install fail2ban -y

# Create jail config
sudo tee /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log
EOF

sudo systemctl restart fail2ban
sudo systemctl enable fail2ban

# Check status
sudo fail2ban-client status sshd
```

---

### STEP 5: Test External Access (10 minutes)

**From OUTSIDE your network** (use phone on cellular data, NOT WiFi):

**5.1 — Test main domain**
```bash
# On your phone browser:
https://nexus-io.duckdns.org

# Should:
# ✅ Redirect HTTP → HTTPS
# ✅ Show valid SSL certificate (Let's Encrypt)
# ✅ Load your shop homepage
# ✅ No certificate warnings
```

**5.2 — Test certificate**
```bash
# Check SSL grade:
# Go to: https://www.ssllabs.com/ssltest/
# Enter: nexus-io.duckdns.org
# Wait 2 minutes for scan
# Should show: A or A+ rating
```

**5.3 — Test subdomains**
```
https://grafana.nexus-io.duckdns.org  → Grafana login
https://n8n.nexus-io.duckdns.org      → N8N (may be blocked by IP whitelist — good!)
https://lldap.nexus-io.duckdns.org    → LLDAP (should be IP whitelisted)
```

**5.4 — Verify admin ports are NOT accessible**
```bash
# These should FAIL (connection refused or timeout):
http://nexus-io.duckdns.org:81        # Nginx PM admin
http://nexus-io.duckdns.org:5432      # Postgres
http://nexus-io.duckdns.org:6379      # Redis
http://nexus-io.duckdns.org:3890      # LLDAP direct

# If any of these work → EMERGENCY, CLOSE THE PORT IMMEDIATELY
```

---

## 🚨 SECURITY CHECKLIST (CRITICAL!)

Before going live, verify ALL of these:

- [ ] DuckDNS auto-update cron job is running (`crontab -l`)
- [ ] Router forwards ONLY ports 80 and 443
- [ ] Router does NOT forward port 81, 5432, 6379, 3890, or any internal ports
- [ ] UFW firewall is enabled and blocking non-allowed ports
- [ ] Nginx PM admin (port 81) is accessible ONLY from local network
- [ ] All Nginx proxy hosts have SSL certificates installed
- [ ] Force SSL is enabled on all proxy hosts
- [ ] HSTS is enabled (prevents downgrade attacks)
- [ ] Admin services (Grafana, N8N, LLDAP) have IP whitelisting
- [ ] CrowdSec is running and monitoring traffic
- [ ] Fail2Ban is protecting SSH
- [ ] All services have strong passwords (20+ chars, random)
- [ ] 2FA is enabled on critical services (Grafana, N8N, GitHub)
- [ ] Postgres is NOT accessible from external network (should fail connection test)
- [ ] Redis is NOT accessible from external network
- [ ] No default passwords remain (admin@example.com, changeme, etc.)
- [ ] SSL Labs test shows A or A+ rating
- [ ] Rate limiting is active at Nginx level
- [ ] Security headers are present (X-Frame-Options, etc.)
- [ ] Grafana dashboards show no suspicious activity
- [ ] CrowdSec has not banned your own IP (test before locking yourself out)

---

## 📊 MONITORING EXTERNAL TRAFFIC

**Add these Grafana dashboards**:

**1. Nginx Access Logs (via Loki)**
```
Query: {job="nginx"} |= "nexus-io.duckdns.org"
Shows: All external traffic hitting your domain
Alert if: >1000 requests/min (DDoS)
```

**2. CrowdSec Decisions**
```
Query: crowdsec_decisions_count
Shows: How many IPs are banned
Alert if: >100 active bans (large attack)
```

**3. SSL Certificate Expiry**
```
Query: nginx_ssl_certificate_expiry_days
Shows: Days until SSL cert expires
Alert if: <7 days (renewal failed)
```

**4. Failed Login Attempts**
```
Query: rate(auth_login_failed_total[5m])
Shows: Brute force attempts
Alert if: >10/min (credential stuffing)
```

---

## 🛡️ ADVANCED SECURITY (Optional but Recommended)

### Option 1: Cloudflare in Front (FREE)
```
Instead of pointing DNS directly to your IP:
  nexus-io.duckdns.org → Your IP

Route through Cloudflare:
  nexus-io.duckdns.org → Cloudflare proxy → Your IP

Benefits:
  ✅ DDoS protection (Cloudflare absorbs attacks)
  ✅ Hide your real IP (harder to target)
  ✅ WAF rules (block bad bots)
  ✅ CDN for static assets (faster)
  ✅ Analytics (traffic insights)

Setup:
1. Transfer nexus-io.duckdns.org to Cloudflare DNS
2. Enable "Proxy" orange cloud
3. Configure firewall rules
4. Done — your IP is hidden
```

### Option 2: VPN-Only Access for Admin
```
Admin services (Grafana, N8N, LLDAP) only via VPN:

Install WireGuard:
  sudo apt install wireguard -y
  
Generate VPN config for your devices
Connect to VPN → Access admin panels
Disconnect VPN → Admin panels unreachable

This way:
  - Public shop works for anyone
  - Admin tools ONLY via VPN
  - Even if credentials leak, can't connect without VPN
```

### Option 3: Geographic Blocking
```
In Nginx PM Advanced config for admin services:

# Block all except your country (example: France)
# Use MaxMind GeoIP2
geo $allowed_country {
  default no;
  FR yes;  # Your country code
}

if ($allowed_country = no) {
  return 403;
}
```

---

## 🚨 INCIDENT RESPONSE

### "I'm locked out of my own server!"
```
Problem: Firewall blocked your IP or you lost admin access

Solution 1: Physical access
  - Connect monitor + keyboard to server
  - Login locally
  - sudo ufw disable (temporarily)
  - Fix the rule
  - sudo ufw enable

Solution 2: Router admin
  - Login to router
  - Remove ALL port forwarding rules (temporarily)
  - Server is now isolated from internet
  - SSH in from local network
  - Fix the issue
  - Re-add port forwarding
```

### "CrowdSec banned my own IP!"
```
Problem: Your IP was flagged as attacker

Solution:
  docker exec crowdsec cscli decisions delete --ip YOUR_IP
  
Add your IP to whitelist:
  docker exec crowdsec cscli parsers install crowdsecurity/whitelists
  # Edit whitelist config to add your IPs
```

### "SSL certificate expired!"
```
Problem: Let's Encrypt renewal failed

Solution:
  # Check Nginx PM logs
  docker logs nginx-pm
  
  # Manually renew
  docker exec nginx-pm certbot renew --force-renewal
  
  # Restart Nginx PM
  docker restart nginx-pm
```

### "Getting DDoS attacked!"
```
Problem: Massive traffic overwhelming server

Immediate actions:
  1. Enable Cloudflare proxy (orange cloud) → absorbs attack
  2. docker exec crowdsec cscli decisions add --ip ATTACKER_IP --duration 24h
  3. Reduce Nginx rate limits (from 60/min to 10/min)
  4. Enable maintenance mode (serve static "under maintenance" page)
  5. Contact ISP if attack is very large (100+ Gbps)
```

---

## 📈 PERFORMANCE TUNING

### Nginx PM Connection Limits
```
# Edit Nginx PM custom config
# Add to nginx.conf:

worker_connections 4096;  # Up from default 1024
keepalive_timeout 65;
client_max_body_size 50M;  # For file uploads

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=general:10m rate=60r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=300r/m;
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
```

### Enable HTTP/3 (QUIC)
```
Nginx PM → Proxy Host → Advanced

# Add:
listen 443 quic reuseport;
add_header Alt-Svc 'h3=":443"; ma=86400';

# Requires Nginx 1.25+ (Nginx PM may need update)
```

---

## ✅ FINAL VERIFICATION SCRIPT

Run this from OUTSIDE your network:

```bash
#!/bin/bash
DOMAIN="nexus-io.duckdns.org"

echo "🔍 Testing external access to $DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: DNS resolution
echo "1. DNS resolution..."
dig +short $DOMAIN || echo "❌ DNS FAILED"

# Test 2: HTTP → HTTPS redirect
echo "2. HTTP redirect..."
curl -I http://$DOMAIN 2>&1 | grep -q "301\|302\|307\|308" && echo "✅ Redirects to HTTPS" || echo "❌ No redirect"

# Test 3: HTTPS works
echo "3. HTTPS connection..."
curl -I https://$DOMAIN 2>&1 | grep -q "200\|301\|302" && echo "✅ HTTPS works" || echo "❌ HTTPS failed"

# Test 4: Valid SSL certificate
echo "4. SSL certificate..."
echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | grep -q "Verify return code: 0" && echo "✅ Valid SSL" || echo "❌ Invalid SSL"

# Test 5: Security headers
echo "5. Security headers..."
curl -sI https://$DOMAIN | grep -q "X-Frame-Options" && echo "✅ Security headers present" || echo "⚠️  No security headers"

# Test 6: Admin port blocked
echo "6. Admin port (81) blocked..."
timeout 2 bash -c "</dev/tcp/$DOMAIN/81" 2>/dev/null && echo "❌ PORT 81 OPEN (DANGER!)" || echo "✅ Port 81 blocked"

# Test 7: Postgres blocked
echo "7. Postgres port (5432) blocked..."
timeout 2 bash -c "</dev/tcp/$DOMAIN/5432" 2>/dev/null && echo "❌ POSTGRES EXPOSED (CRITICAL!)" || echo "✅ Postgres blocked"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ External access verification complete"
```

---

## 🎯 NEXT STEPS AFTER EXTERNAL ACCESS IS LIVE

1. **Monitor for 48 hours**
   - Watch Grafana for unusual traffic patterns
   - Check CrowdSec decisions (expect some bot traffic)
   - Verify legitimate users can access fine

2. **Set up CloudFlare** (optional but recommended)
   - Adds DDoS protection
   - Hides your real IP
   - Improves performance

3. **Configure backups to run automatically**
   - Your backup_nexus.sh script
   - Upload to off-site storage (Backblaze B2, etc.)

4. **Test disaster recovery**
   - Run scripts/dr-drill.sh
   - Verify RTO is <2 minutes

5. **Train your team**
   - How to access admin panels (Grafana, N8N)
   - How to deploy (CI/CD via GitHub)
   - How to rollback (GitHub Actions button)

---

**STATUS**: 🟢 **READY TO GO LIVE**  
**SECURITY**: 🛡️ Hardened (if all checklist items done)  
**MONITORING**: 📊 Grafana + Loki + CrowdSec active  
**NEXT**: Configure port forwarding, test from external, then go live!  

🚀 **Your shop is about to be GLOBALLY accessible habibi!** ❤️
