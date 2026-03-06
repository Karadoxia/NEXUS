# SSH Key-Based Authentication Setup

This guide sets up secure SSH key-based authentication to replace password-based logins.

## Benefits

✅ **Eliminates password brute force attacks** — Keys are cryptographically secure
✅ **Fail2ban redundant** — Key auth fails before rate limiting kicks in
✅ **Passwordless login** — No need to type passwords
✅ **Auditability** — Can see which key was used

## Step 1: Generate SSH Key Pair (Local Machine)

Run on **your local machine** (not the server):

```bash
# Generate a new Ed25519 key (modern, secure, small)
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/nexus_server

# Or RSA (4096-bit) for wider compatibility
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/.ssh/nexus_server

# Set a passphrase when prompted (optional but recommended)
```

This creates:
- `~/.ssh/nexus_server` — Private key (KEEP SECURE!)
- `~/.ssh/nexus_server.pub` — Public key (safe to share)

## Step 2: Copy Public Key to Server

**Option A: Automated (If you can still use password)**

```bash
ssh-copy-id -i ~/.ssh/nexus_server redbend@77.133.1.37
# or
ssh-copy-id -i ~/.ssh/nexus_server redbend@nexus-io.duckdns.org
```

**Option B: Manual (If you don't have password access)**

1. Get your public key:
```bash
cat ~/.ssh/nexus_server.pub
```

2. On the server (via SSH or physical access), create/edit `~/.ssh/authorized_keys`:
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## Step 3: Configure Local SSH Config

Create/edit `~/.ssh/config` on your **local machine**:

```
Host nexus
    HostName 77.133.1.37
    # or: HostName nexus-io.duckdns.org
    User redbend
    IdentityFile ~/.ssh/nexus_server
    IdentitiesOnly yes
    Port 22

Host nexus-tunnel
    HostName nexus-io.duckdns.org
    User redbend
    IdentityFile ~/.ssh/nexus_server
    IdentitiesOnly yes
    Port 22
    ProxyCommand ssh -W %h:%p proxy.example.com
```

Now you can connect simply:

```bash
ssh nexus
```

## Step 4: Secure Server SSH Configuration

Edit `/etc/ssh/sshd_config` on the **server**:

```bash
# Backup original
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# Edit with sudo
sudo nano /etc/ssh/sshd_config
```

Add/modify these settings:

```
# ── Authentication ──
PubkeyAuthentication yes
PasswordAuthentication no        # Disable passwords
PermitEmptyPasswords no
PermitRootLogin no               # Disable root SSH login

# ── Security ──
MaxAuthTries 3                   # Limit failed attempts
MaxSessions 5                    # Max concurrent sessions
ClientAliveInterval 300          # Keep-alive every 5 mins
ClientAliveCountMax 2            # Timeout after 2 missed pings

# ── Port ──
Port 22                          # Or change to non-standard (2222)
AddressFamily any                # Allow IPv4 and IPv6

# ── Logging ──
SyslogFacility AUTH
LogLevel VERBOSE                 # Log all auth attempts

# ── Advanced ──
HostbasedAuthentication no
IgnoreRhosts yes
StrictModes yes
PermitUserEnvironment no
X11Forwarding no                 # Disable X11 (unless needed)
PrintMotd no
TCPKeepAlive yes
AllowUsers redbend               # Only allow specific user
```

## Step 5: Apply Changes

```bash
# Validate syntax
sudo sshd -t

# Restart SSH service
sudo systemctl restart sshd

# Check status
sudo systemctl status sshd
```

## Step 6: Test Key-Based Login

From your local machine:

```bash
# Using SSH config (simple)
ssh nexus

# Direct connection
ssh -i ~/.ssh/nexus_server redbend@77.133.1.37

# Verbose mode to debug
ssh -vvv -i ~/.ssh/nexus_server redbend@77.133.1.37
```

**Keep your original password SSH open until you confirm key auth works!**

## Step 7: Docker Container SSH Access (Optional)

If you need SSH access from within Docker containers:

```bash
# Create key in container
docker compose exec nexus-app ssh-keygen -t ed25519 -N "" -f /root/.ssh/id_ed25519

# Copy public key to your ~/.ssh/authorized_keys
docker compose exec nexus-app cat /root/.ssh/id_ed25519.pub
```

## Step 8: Backup Your Keys

Store your private key safely:

```bash
# Backup to external drive or cloud (encrypted)
cp ~/.ssh/nexus_server /secure/backup/location/

# Or encrypt before storing
tar czf ~/.ssh/nexus_server | gpg --symmetric > ~/.ssh/nexus_server.tar.gz.gpg
```

## SSH Agent Setup (Password-Protected Keys)

If you set a passphrase on your key:

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add key (you'll be asked for passphrase once)
ssh-add ~/.ssh/nexus_server

# Verify key is loaded
ssh-add -l
```

For automated scripts, use `ssh-agent`:

```bash
# Keep agent running in background
eval "$(ssh-agent -s)" && ssh-add ~/.ssh/nexus_server
```

## SSH Key Rotation (Recommended Annually)

```bash
# Generate new key
ssh-keygen -t ed25519 -f ~/.ssh/nexus_server_new

# Add new public key to server
ssh-copy-id -i ~/.ssh/nexus_server_new redbend@77.133.1.37

# Test new key works
ssh -i ~/.ssh/nexus_server_new redbend@77.133.1.37

# Remove old key from authorized_keys
nano ~/.ssh/authorized_keys

# Delete old key files locally
rm ~/.ssh/nexus_server ~/.ssh/nexus_server.pub

# Rename new key
mv ~/.ssh/nexus_server_new ~/.ssh/nexus_server
mv ~/.ssh/nexus_server_new.pub ~/.ssh/nexus_server.pub
```

## Troubleshooting

### "Permission denied (publickey)"

```bash
# Check permissions on server
ls -la ~/.ssh/
# Should show: drwx------ (700) for ~/.ssh and -rw------- (600) for authorized_keys

# Check if key is in authorized_keys
cat ~/.ssh/authorized_keys

# Verify SSH service is running
sudo systemctl status sshd
```

### "Too many authentication failures"

Edit `/etc/ssh/sshd_config`:
```
MaxAuthTries 6
```

Then restart: `sudo systemctl restart sshd`

### "Could not resolve hostname"

Check DNS:
```bash
nslookup nexus-io.duckdns.org
# Should return 77.133.1.37
```

### Key works locally but not remotely

Ensure your ISP isn't blocking SSH:
```bash
# Test connectivity
telnet 77.133.1.37 22
```

If blocked, use Cloudflare Tunnel with SSH:
```bash
# In ~/.cloudflared/config.yml, add:
- hostname: ssh.nexus-io.duckdns.org
  service: ssh://nexus-app:22
```

## Monitoring SSH Access

```bash
# View recent logins
last

# View authentication logs
sudo tail -f /var/log/auth.log

# Count failed attempts
grep "Failed password" /var/log/auth.log | wc -l

# View successful key-based logins
grep "Accepted publickey" /var/log/auth.log
```

## Additional Security: SSH Certificates (Advanced)

For teams or multiple servers, use SSH certificates:

```bash
# Generate certificate authority
ssh-keygen -t ed25519 -f /etc/ssh/ca_key -N ""

# Sign user key with CA
ssh-keygen -s /etc/ssh/ca_key -I user@nexus -n redbend -V +52w ~/.ssh/nexus_server.pub

# This creates: ~/.ssh/nexus_server-cert.pub
# Valid for 1 year (-V +52w)
```

---

**Remember:** Store your private key securely. If compromised, revoke it immediately and generate a new one.
