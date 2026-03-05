# Cloudflare Tunnel Setup Guide

Cloudflare Tunnel provides secure public access to your NEXUS app **without port forwarding**. It creates an outbound-only connection from your server to Cloudflare's edge network.

## Benefits

✅ **No port forwarding needed** — Works even if ISP blocks ports
✅ **Built-in DDoS protection** — Cloudflare edge security
✅ **No exposed public IPs** — Only Cloudflare can reach your server
✅ **Zero-Trust access** — Optional authentication before accessing the app

## Prerequisites

- Cloudflare account (free tier works)
- Your domain registered in Cloudflare
- Docker & docker-compose installed

## Step 1: Install Cloudflared Locally

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# Linux (Ubuntu/Debian)
curl https://pkg.cloudflare.com/cloudflare-release.key | gpg --import -
sudo apt-get update
sudo apt-get install cloudflared

# Windows (PowerShell)
choco install cloudflared
```

Or download directly: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

## Step 2: Authenticate Cloudflared

Run this command on your **local machine** (not on the server):

```bash
cloudflared tunnel login
```

This opens your browser to authenticate with Cloudflare. You'll be asked to select your domain.

## Step 3: Create the Tunnel

```bash
cloudflared tunnel create nexus
```

This creates a tunnel and outputs the **Tunnel Token** (a long UUID). Copy it.

## Step 4: Add Token to .env

Edit `.env` and paste the token:

```env
CLOUDFLARE_TUNNEL_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Create Tunnel Config File

On your **server**, create `~/.cloudflared/config.yml`:

```yaml
tunnel: nexus
credentials-file: /home/redbend/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: app.nexus-io.duckdns.org
    service: http://nexus-app:3000
  - hostname: n8n.nexus-io.duckdns.org
    service: http://n8n:5678
  - hostname: grafana.nexus-io.duckdns.org
    service: http://grafana:3000
  - hostname: status.nexus-io.duckdns.org
    service: http://uptime_kuma:3001
  - hostname: vault.nexus-io.duckdns.org
    service: http://vaultwarden:80
  - service: http_status:404
```

## Step 6: Run Cloudflared in Docker

```bash
cd /home/redbend/Desktop/Local-Projects/NEXUS-V2

# Start the cloudflared service
docker compose --profile cloudflare-tunnel up -d cloudflared

# View logs
docker compose logs cloudflared
```

## Step 7: Add DNS Records in Cloudflare

In Cloudflare Dashboard → Your Domain → DNS:

1. Go to DNS > Records
2. Add CNAME records:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | app | nexus.example.com | Proxied (orange cloud) |
| CNAME | n8n | nexus.example.com | Proxied |
| CNAME | grafana | nexus.example.com | Proxied |
| CNAME | status | nexus.example.com | Proxied |
| CNAME | vault | nexus.example.com | Proxied |

Replace `nexus.example.com` with your actual domain.

## Step 8: Test the Tunnel

```bash
# Access from any external network
curl https://app.nexus-io.duckdns.org

# Check tunnel status
docker compose logs cloudflared | grep -i "tunnel"
```

## Cloudflare Zero-Trust Access (Optional)

Add authentication before accessing your app:

1. Go to **Access > Applications** in Cloudflare Dashboard
2. Click **Create Application**
3. Select **Self-hosted**
4. Configure:
   - Application name: `NEXUS App`
   - Domain: `app.nexus-io.duckdns.org`
   - Application path: `*`
5. Add policy:
   - Decision: **Allow**
   - Rules: Email → `caspertech92@gmail.com`

Now only authenticated users can access your app!

## Troubleshooting

### Tunnel not connecting

```bash
# Check if tunnel is created
cloudflared tunnel list

# Check container logs
docker compose logs cloudflared

# Verify token format
echo $CLOUDFLARE_TUNNEL_TOKEN
```

### DNS not resolving

1. Verify CNAME records in Cloudflare DNS
2. Wait 5-10 minutes for DNS propagation
3. Clear browser cache: `Ctrl+Shift+Del`

### Connection refused

Ensure Traefik is properly routing:
```bash
docker compose exec traefik curl http://nexus-app:3000
```

## Monitoring

```bash
# View real-time tunnel metrics
docker compose logs -f cloudflared | grep -E "request|packet"

# Check tunnel uptime
cloudflared tunnel info nexus
```

## Additional Resources

- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
- [Configuration Reference](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/configure-tunnels/tunnel-run/)
- [Zero-Trust Access](https://developers.cloudflare.com/cloudflare-one/access/setting-up-access/)

---

**Note:** Cloudflare Tunnel is the recommended approach for production. It's more secure and reliable than port forwarding.
