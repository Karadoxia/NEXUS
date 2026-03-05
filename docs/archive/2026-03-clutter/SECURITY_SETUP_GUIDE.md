# NEXUS Security Setup Guide

Complete security hardening for production deployment with three layers of protection.

## Security Stack Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         NEXUS Security Layers                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Layer 1: Network Access                                         │
│  ├─ Cloudflare Tunnel (No exposed IP, DDoS protected)           │
│  ├─ SSH Key Authentication (Crypto-secure)                      │
│  └─ Fail2ban (Auto-ban brute force)                             │
│                                                                   │
│  Layer 2: Reverse Proxy                                         │
│  ├─ Traefik (TLS termination, routing)                          │
│  ├─ Let's Encrypt SSL (Auto-renewal)                            │
│  └─ HTTP → HTTPS redirect                                        │
│                                                                   │
│  Layer 3: Application                                           │
│  ├─ NextAuth.js (Session-based auth)                            │
│  ├─ Admin role checking                                          │
│  └─ Rate limiting (planned)                                     │
│                                                                   │
│  Layer 4: Infrastructure                                        │
│  ├─ Private internal network                                    │
│  ├─ PostgreSQL (internal only)                                  │
│  ├─ Redis cache (internal only)                                 │
│  └─ CrowdSec (Intrusion detection)                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Current Status

| Security Feature | Status | Notes |
|------------------|--------|-------|
| Cloudflare Tunnel | ✅ Ready | Docker service added, needs token |
| SSH Key Auth | ✅ Ready | Setup guide provided |
| Fail2ban | ✅ Ready | Docker service added, needs config |
| Let's Encrypt SSL | ✅ Active | Wildcard cert for *.nexus-io.duckdns.org |
| CrowdSec IDS | ✅ Running | Community-powered threat detection |
| Traefik TLS | ✅ Active | Dashboard + HTTPS routing |
| Docker Secrets | ✅ Active | DB password, JWT, API keys encrypted |

## Quick Setup Checklist

### 1. Cloudflare Tunnel (30 minutes)

```bash
# Prerequisites: Cloudflare account, domain in Cloudflare

# Step 1: Install cloudflared locally
brew install cloudflare/cloudflare/cloudflared

# Step 2: Create tunnel
cloudflared tunnel login
cloudflared tunnel create nexus

# Step 3: Copy token to .env
# CLOUDFLARE_TUNNEL_TOKEN=<paste token here>

# Step 4: Start tunnel in Docker
docker compose --profile cloudflare-tunnel up -d cloudflared

# Step 5: Create config file ~/.cloudflared/config.yml
# (See CLOUDFLARE_TUNNEL_SETUP.md for details)

# Step 6: Add CNAME records in Cloudflare DNS
# app → nexus.example.com
# n8n → nexus.example.com
# grafana → nexus.example.com
# etc.

# Step 7: Test
curl https://app.nexus-io.duckdns.org
```

**Benefits:**
- ✅ No port forwarding needed
- ✅ DDoS protection from Cloudflare
- ✅ Works even if ISP blocks ports
- ✅ Optional Zero-Trust authentication

### 2. SSH Key Authentication (20 minutes)

```bash
# On YOUR LOCAL MACHINE:

# Step 1: Generate key
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/nexus_server

# Step 2: Copy public key to server
ssh-copy-id -i ~/.ssh/nexus_server redbend@77.133.1.37

# Step 3: Test key works
ssh -i ~/.ssh/nexus_server redbend@77.133.1.37

# Step 4: Update local SSH config
cat >> ~/.ssh/config << 'EOF'
Host nexus
    HostName 77.133.1.37
    User redbend
    IdentityFile ~/.ssh/nexus_server
    IdentitiesOnly yes
EOF

# Now you can: ssh nexus

# ON THE SERVER:

# Step 5: Disable password auth
sudo nano /etc/ssh/sshd_config

# Set these:
PasswordAuthentication no
PermitEmptyPasswords no
PermitRootLogin no
MaxAuthTries 3

# Step 6: Restart SSH
sudo sshd -t
sudo systemctl restart sshd

# Step 7: Test in new terminal (keep old one open!)
ssh nexus
```

**Benefits:**
- ✅ Immune to password brute force
- ✅ No need to type passwords
- ✅ Can revoke keys instantly
- ✅ Audit which key was used

### 3. Fail2ban Configuration (20 minutes)

```bash
# ON THE SERVER:

# Step 1: Start container
docker compose --profile fail2ban up -d fail2ban

# Step 2: Create jail config
sudo nano /etc/fail2ban/jail.local
```

Add:
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
maxretry = 3
findtime = 300
```

```bash
# Step 3: Start service
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Step 4: Monitor
sudo fail2ban-client status sshd

# Step 5: Test
for i in {1..5}; do ssh -i /dev/null invalid@localhost; done
# Check if your IP would be banned
sudo iptables -L -n | grep REJECT
```

**Benefits:**
- ✅ Automatic brute force protection
- ✅ Works with SSH keys too
- ✅ Configurable ban duration
- ✅ Low system overhead

## Attack Scenarios & Defense

### Scenario 1: Password Brute Force Attack

```
Attacker tries SSH with 1000 password guesses
├─ SSH Key Auth active → ❌ Fails on wrong key format
├─ Fail2ban watches logs → ❌ Bans after 3 attempts
└─ Result: Attack fails in <1 second
```

### Scenario 2: DDoS Attack

```
Attacker sends 100 Gbps to 77.133.1.37
├─ ISP router drops traffic → ❌ Never reaches server
├─ Or Cloudflare Tunnel absorbs → ❌ Cloudflare's edge defends
└─ Result: Protected by ISP + Cloudflare
```

### Scenario 3: Phishing Attack

```
Attacker tricks user into sharing password
├─ SSH Key Auth → ❌ Key can't be phished
├─ Zero-Trust Access → ❌ Optional email verification
└─ Result: No access with password alone
```

### Scenario 4: Compromised SSH Password

```
Attacker gains SSH credentials
├─ Key-based auth → ❌ Password useless
├─ Revoke old key → ✅ Instantly lock attacker out
└─ Generate new key → ✅ Secure access restored
```

## Monitoring & Alerting

### Real-time Monitoring

```bash
# Monitor fail2ban bans
watch -n 5 'sudo fail2ban-client status sshd'

# Monitor Traefik
docker compose logs -f traefik | grep -i "ban\|error"

# Monitor CrowdSec
docker compose logs -f crowdsec | grep -i "ban\|alert"

# Monitor SSH auth
sudo journalctl -u sshd -f
```

### Alert Setup (n8n Webhook)

In `/etc/fail2ban/jail.local`, add:

```ini
[DEFAULT]
action = %(action_mwl)s webhook

[set-webhook]
actionstart = curl -X POST http://n8n:5678/webhook/fail2ban-alert -d '{"event":"start"}'
actionban = curl -X POST http://n8n:5678/webhook/fail2ban-alert -d '{"event":"ban","ip":"%(ip)s"}'
```

Then create n8n workflow to send Telegram alerts.

## Backup & Recovery

### Backup SSH Keys

```bash
# Local backup (encrypted)
tar czf - ~/.ssh/nexus_server | gpg --symmetric > ~/nexus_key.tar.gz.gpg

# Store in safe location
cp ~/nexus_key.tar.gz.gpg /mnt/external_drive/

# Verify backup
gpg --decrypt ~/nexus_key.tar.gz.gpg | tar tzf - | head
```

### Restore from Backup

```bash
gpg --decrypt ~/nexus_key.tar.gz.gpg | tar xz -C ~/
chmod 600 ~/.ssh/nexus_server
chmod 644 ~/.ssh/nexus_server.pub
```

## Maintenance Schedule

| Task | Frequency | Command |
|------|-----------|---------|
| Rotate SSH keys | Every 12 months | See SSH_KEY_SETUP.md |
| Update Docker images | Monthly | `docker compose pull && docker compose up -d` |
| Review Fail2ban logs | Weekly | `sudo journalctl -u fail2ban -n 100` |
| Check SSL cert expiry | Monthly | `curl -vI https://app.nexus-io.duckdns.org 2>&1 \| grep expire` |
| Review auth logs | Weekly | `sudo tail -100 /var/log/auth.log` |
| Backup database | Daily | See Docker backup strategy |

## Compliance Checklist

- [ ] SSH keys generated with Ed25519
- [ ] Password auth disabled on server
- [ ] Private key stored securely (encrypted)
- [ ] Public key in `~/.ssh/authorized_keys` with 600 permissions
- [ ] Cloudflare Tunnel configured with CNAME records
- [ ] Fail2ban running with custom jails
- [ ] Let's Encrypt certificate auto-renewing
- [ ] Docker secrets (not env vars) for passwords
- [ ] Internal network isolated from public
- [ ] CrowdSec threat intel enabled

## Post-Setup Testing

```bash
# Test 1: Verify Cloudflare Tunnel
curl -vI https://app.nexus-io.duckdns.org

# Test 2: Test SSH key works
ssh nexus "whoami"

# Test 3: Verify password auth disabled
ssh -o PubkeyAuthentication=no redbend@77.133.1.37
# Should fail with "Permission denied (publickey)"

# Test 4: Check fail2ban running
docker compose logs fail2ban

# Test 5: Verify SSL certificate
openssl s_client -connect app.nexus-io.duckdns.org:443 -showcerts
```

## Troubleshooting

### Can't connect to SSH with key
See: SSH_KEY_SETUP.md → Troubleshooting

### Cloudflare Tunnel not connecting
See: CLOUDFLARE_TUNNEL_SETUP.md → Troubleshooting

### Fail2ban not banning IPs
See: FAIL2BAN_SETUP.md → Troubleshooting

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Benchmarks](https://www.cisecurity.org/benchmarks/)
- [Cloudflare Security](https://www.cloudflare.com/en-gb/learning/security/)
- [SSH Best Practices](https://man.openbsd.org/ssh_config)

## Support & Questions

For issues with:
- **Cloudflare Tunnel** → See CLOUDFLARE_TUNNEL_SETUP.md
- **SSH Keys** → See SSH_KEY_SETUP.md
- **Fail2ban** → See FAIL2BAN_SETUP.md

---

**Remember:** Security is a continuous process, not a one-time setup. Keep updating, monitoring, and improving!
