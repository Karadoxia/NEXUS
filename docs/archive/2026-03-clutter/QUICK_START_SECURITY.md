# Quick Start: Security Setup (TL;DR)

Fast setup guide if you just want to get it working.

## 1️⃣ Cloudflare Tunnel (Fastest: 5 minutes)

```bash
# On YOUR LOCAL MACHINE
brew install cloudflare/cloudflare/cloudflared
cloudflared tunnel login
cloudflared tunnel create nexus

# Copy the Tunnel Token (UUID), then:
# Edit .env: CLOUDFLARE_TUNNEL_TOKEN=<paste-token-here>

# On SERVER
docker compose --profile cloudflare-tunnel up -d cloudflared

# In Cloudflare Dashboard → DNS:
# Add CNAME records pointing to your domain
# app.nexus-io.duckdns.org → CNAME nexus.example.com

# Test
curl https://app.nexus-io.duckdns.org
```

## 2️⃣ SSH Keys (Fastest: 5 minutes)

```bash
# On YOUR LOCAL MACHINE
ssh-keygen -t ed25519 -f ~/.ssh/nexus_server
ssh-copy-id -i ~/.ssh/nexus_server redbend@77.133.1.37

# Test
ssh -i ~/.ssh/nexus_server redbend@77.133.1.37

# On SERVER (disable passwords)
sudo nano /etc/ssh/sshd_config
# Change: PasswordAuthentication no

sudo systemctl restart sshd

# Test in NEW terminal (keep old one open!)
ssh -i ~/.ssh/nexus_server redbend@77.133.1.37
```

## 3️⃣ Fail2ban (Fastest: 3 minutes)

```bash
# On SERVER
docker compose --profile fail2ban up -d fail2ban

sudo nano /etc/fail2ban/jail.local
# Add minimal config:
[DEFAULT]
bantime = 3600
maxretry = 5

[sshd]
enabled = true
maxretry = 3

# Start
sudo systemctl start fail2ban

# Verify
sudo fail2ban-client status sshd
```

## All Together (Quick Check)

```bash
# Verify everything
✅ Cloudflare Tunnel: docker compose ps cloudflared
✅ SSH Keys: ssh nexus "whoami"
✅ Fail2ban: docker compose ps fail2ban
✅ Password Auth Disabled: ssh redbend@77.133.1.37 2>&1 | grep "publickey"
```

## What's Protected Now

| Attack | Before | After |
|--------|--------|-------|
| SSH password guessing | Possible | ✅ Blocked (Fail2ban) |
| DDoS to 77.133.1.37 | Hits server | ✅ Absorbed by Cloudflare |
| Port forwarding needed | ❌ Yes | ✅ No (Tunnel) |
| Password phishing | ❌ Works | ✅ Useless (keys required) |

## Troubleshooting Fast

```bash
# SSH not working?
ssh -vvv -i ~/.ssh/nexus_server redbend@77.133.1.37

# Tunnel not connecting?
docker compose logs cloudflared | tail -20

# Fail2ban not running?
docker compose logs fail2ban | grep error

# Can't access app?
curl -v https://app.nexus-io.duckdns.org
```

## Next Steps (Optional)

- [ ] Add Cloudflare Zero-Trust Access (password + 2FA)
- [ ] Set up Telegram alerts for Fail2ban bans
- [ ] SSH key rotation (every 12 months)
- [ ] Monitor Traefik metrics in Grafana

---

**Done!** Your NEXUS app is now protected by enterprise-grade security. See detailed guides for advanced configuration.
