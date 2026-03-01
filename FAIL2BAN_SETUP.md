# Fail2ban Setup Guide

Fail2ban monitors SSH and application logs, automatically banning IPs after repeated failed login attempts. It's your last line of defense against brute force attacks.

## How It Works

1. **Monitors logs** → Watches `/var/log/auth.log` for failed attempts
2. **Counts failures** → After N failed attempts in M minutes, triggers action
3. **Bans IP** → Blocks the IP using `iptables` firewall rules
4. **Auto-unban** → Removes ban after configurable time period

## Benefits

✅ **Stops brute force attacks** — Automatically blocks repeat offenders
✅ **Works with any SSH config** — Protects passwords + keys
✅ **Low overhead** — Efficient log monitoring
✅ **Configurable** — Customize ban duration, attempt threshold
✅ **Combined with SSH keys** — Defense in depth

## Prerequisites

- Docker & docker-compose
- Access to `/var/log/auth.log` on host
- fail2ban service in docker-compose.yml (already added)

## Step 1: Start Fail2ban Container

```bash
cd /home/redbend/Desktop/Local-Projects/NEXUS-V2

# Start with fail2ban profile
docker compose --profile fail2ban up -d fail2ban

# Verify it's running
docker compose logs fail2ban
```

## Step 2: Create Fail2ban Configuration

Create `/etc/fail2ban/jail.local` on the **server**:

```bash
sudo mkdir -p /etc/fail2ban
sudo nano /etc/fail2ban/jail.local
```

Add this configuration:

```ini
[DEFAULT]
# Bantime and findtime in seconds
bantime = 3600              # Ban for 1 hour
findtime = 600              # Look at last 10 minutes
maxretry = 5                # Ban after 5 failed attempts
destemail = caspertech92@gmail.com
sendername = Fail2ban Alert
action = %(action_mwl)s     # Ban + email + log

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3                # SSH stricter: 3 attempts
findtime = 300              # Within 5 minutes

[sshd-ddos]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 10
findtime = 60               # Very aggressive: 10 in 1 minute
bantime = 7200              # Ban for 2 hours

[traefik-http-auth]
enabled = true
port = http,https
logpath = /var/log/traefik/access.log
# Pattern: failed auth attempts
failregex = ^<ADDR> .* ".*" .* .*401.*$
maxretry = 5
bantime = 1800

[nginx]
enabled = false             # Only if running nginx
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 5
```

## Step 3: Docker-Specific Configuration

Create a fail2ban jail for Docker:

```bash
sudo nano /etc/fail2ban/jail.d/docker.local
```

Add:

```ini
[DEFAULT]
chain = FORWARD
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3
```

## Step 4: Configure Email Alerts (Optional)

Edit `/etc/fail2ban/action.d/sendmail-whois.conf`:

```bash
sudo nano /etc/fail2ban/action.d/sendmail-whois.conf
```

Update:

```ini
[Definition]
actionstart = printf %%b "From: <%(sender)s>\nSubject: [Fail2Ban] %(action)s\nTo: %(destemail)s\n\nStarting Ban\n\nHostname: %(hostname)s\n" | ...

actionban = printf %%b "From: <%(sender)s>\nSubject: [Fail2Ban] %(action)s\nTo: %(destemail)s\n\nBan [%(ip)s] for [%(bantime)s]\n\nAttempts: %(attempts)d\nLoglines:\n%(loglines)s" | ...
```

For Gmail/Resend, consider using a webhook to n8n instead.

## Step 5: Enable Fail2ban Service

```bash
# Start the service
sudo systemctl start fail2ban

# Enable on boot
sudo systemctl enable fail2ban

# Check status
sudo systemctl status fail2ban

# View logs
sudo journalctl -u fail2ban -n 20
```

## Step 6: Monitoring Fail2ban

```bash
# View all jails
sudo fail2ban-client status

# Check specific jail
sudo fail2ban-client status sshd

# View banned IPs
sudo iptables -L -n | grep REJECT

# Check recent bans
sudo tail -f /var/log/fail2ban.log
```

## Step 7: Test Fail2ban

```bash
# Generate intentional failed login attempts
for i in {1..5}; do
  ssh -i /dev/null invalid_user@localhost
  sleep 1
done

# Check if your IP is banned
sudo fail2ban-client status sshd

# View fail2ban log
sudo tail -20 /var/log/fail2ban.log
```

## Unban an IP (If Needed)

```bash
# Unban specific IP
sudo fail2ban-client set sshd unbanip 192.168.1.100

# Unban all from jail
sudo iptables -F fail2ban-sshd

# Restart fail2ban
sudo systemctl restart fail2ban
```

## Advanced: Custom Jails

Create a custom jail for your app:

```bash
sudo nano /etc/fail2ban/jail.d/nexus.conf
```

Add:

```ini
[nexus-api-auth]
enabled = true
port = http,https
logpath = /var/log/nexus/*.log
failregex = ^.*\[(?P<ip>\S+)\].*"POST.*auth.*" 401.*$
maxretry = 10
bantime = 1800
```

## Docker Compose Integration

View fail2ban logs from docker-compose:

```bash
# Real-time logs
docker compose logs -f fail2ban

# Search for bans
docker compose logs fail2ban | grep -i "ban\|unban"

# Get banned IPs
docker compose exec fail2ban fail2ban-client status sshd
```

## Whitelist Safe IPs

Create `/etc/fail2ban/jail.d/whitelist.conf`:

```ini
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1 192.168.1.0/24 203.0.113.0/24
```

Add your office/home IP so you don't ban yourself!

## Database Backup

Fail2ban stores IP history in SQLite:

```bash
# Backup database
sudo cp /var/lib/fail2ban/fail2ban.sqlite3 ~/fail2ban_backup.db

# View database
sudo sqlite3 /var/lib/fail2ban/fail2ban.sqlite3 "SELECT * FROM bans LIMIT 10;"
```

## Fail2ban + Cloudflare Tunnel Integration

If using Cloudflare Tunnel, update rules:

```ini
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1 103.21.244.0/22 103.22.200.0/22
# ^ Add Cloudflare IPs
```

Get latest Cloudflare IPs:
```bash
curl https://www.cloudflare.com/ips-v4 | head -5
```

## Monitoring Dashboards

View fail2ban stats with Grafana:

1. Add data source: `prometheus:9090`
2. Import dashboard: https://grafana.com/grafana/dashboards/4717

Or install fail2ban exporter for Prometheus:

```bash
docker pull fail2ban/fail2ban-prometheus-exporter:latest
```

## Troubleshooting

### Fail2ban not banning

```bash
# Check logs
sudo tail -f /var/log/fail2ban.log

# Verify regex matches
sudo fail2ban-regex /var/log/auth.log '<failregex>'

# Check if jail is enabled
sudo fail2ban-client status sshd
```

### Can't access own SSH

If you get banned:

```bash
# On server console or physical access
sudo fail2ban-client set sshd unbanip YOUR_IP

# Check ban list
sudo fail2ban-client status sshd
```

### Too many false positives

Adjust in `jail.local`:

```ini
[sshd]
maxretry = 10        # Increase threshold
findtime = 900       # Extend window to 15 mins
```

### Docker logs not showing bans

Ensure fail2ban container can read host logs:

```bash
# Check volume mount in docker-compose
docker compose ps
docker compose exec fail2ban ls -la /var/log/auth.log
```

## Security Best Practices

1. **Combine with SSH keys** — Keys don't trigger Fail2ban
2. **Whitelist trusted IPs** — Prevent accidental self-bans
3. **Monitor alerts** — Set up email/Telegram notifications
4. **Regular backups** — Backup ban database
5. **Keep updated** — `sudo apt update && sudo apt upgrade fail2ban`

## Monitoring with Telegram (Optional)

Add Telegram alerts in `/etc/fail2ban/jail.local`:

```ini
[DEFAULT]
action = %(action_mwl)s telegram

[set-telegram]
actionstart = curl -s -X POST "https://api.telegram.org/bot{TOKEN}/sendMessage" -d "chat_id={CHAT_ID}&text=Fail2ban started"
actionban = curl -s -X POST "https://api.telegram.org/bot{TOKEN}/sendMessage" -d "chat_id={CHAT_ID}&text=IP %{ip}s banned"
```

## Resources

- [Official Docs](https://www.fail2ban.org/wiki/index.php/Main_Page)
- [Configuration Reference](https://www.fail2ban.org/wiki/index.php/Fail2ban_Configuration_File)
- [Regular Expressions](https://www.fail2ban.org/wiki/index.php/Regular_expression)

---

**Recommendation:** Start with conservative settings (fewer bans) and gradually tighten as you monitor false positives.
