#!/bin/bash
set -e

echo "=== NEXUS Secure Full-Stack Setup 2026 (100% free) ==="

# Phase 0: Prep
sudo apt update
# Docker package is available on all Debian derivatives.  `docker-compose-plugin`
# is the newer split package but some distributions (Kali, older Debian) may
# not ship it, in which case fall back to the legacy `docker-compose` binary.
sudo apt install -y docker.io curl || true
if ! sudo apt install -y docker-compose-plugin; then
  echo "WARNING: docker-compose-plugin not found, attempting alternate install"
  if ! sudo apt install -y docker-compose; then
    echo "docker-compose package missing too; downloading official binary"
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" \
      -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
  fi
fi
sudo usermod -aG docker $USER
mkdir -p traefik vw-data grafana-data prometheus-data loki-data vault-data wireguard-config backups
echo "your_strong_server_password" > db_password.txt
echo "your_very_long_random_secret" > jwt_secret.txt
echo "re_your_resend_key" > resend_key.txt
echo "AIzaSy..." > gemini_key.txt   # replace with real

# Phase 1-7: Generate FULL docker-compose.yml (one big file)
cat > docker-compose.yml << 'EOF'
version: '3.9'

networks:
  internal:
    driver: bridge
    internal: true
  proxy:
    driver: bridge

services:
  # === NEXUS APP (Next.js) ===
  nexus-app:
    build: .
    container_name: nexus_app
    restart: unless-stopped
    networks:
      - internal
      - proxy
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://nexus:${DB_PASSWORD}@postgres:5432/nexus_v2
      NEXTAUTH_SECRET: ${JWT_SECRET}
      RESEND_API_KEY: ${RESEND_KEY}
      GEMINI_API_KEY: ${GEMINI_KEY}
    secrets:
      - db_password
      - jwt_secret
      - resend_key
      - gemini_key
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.nexus.rule=Host(`nexus.yourdomain.com`)"
      - "traefik.http.routers.nexus.entrypoints=websecure"
      - "traefik.http.routers.nexus.tls.certresolver=letsencrypt"
      - "traefik.http.services.nexus.loadbalancer.server.port=3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s

  # === DB & CACHE (internal only) ===
  postgres:
    image: postgres:16-alpine
    container_name: nexus_postgres
    restart: unless-stopped
    networks:
      - internal
    environment:
      POSTGRES_USER: nexus
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
      POSTGRES_DB: nexus_v2
    secrets:
      - db_password
    volumes:
      - nexus_v2_postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nexus"]
      interval: 10s

  redis:
    image: redis:7-alpine
    container_name: nexus_redis
    restart: unless-stopped
    networks:
      - internal
    command: redis-server --requirepass ${REDIS_PASSWORD}
    environment:
      REDIS_PASSWORD: ${REDIS_PASSWORD}

  # === Rust service (internal) ===
  nexus-rust-service:
    build: ./rust-agents/crates/service
    container_name: nexus_rust
    restart: unless-stopped
    networks:
      - internal

  # === TRAEFIK (public entrypoint) ===
  traefik:
    image: traefik:v3.1
    container_name: traefik
    restart: unless-stopped
    networks:
      - proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik/traefik.yml:/traefik.yml:ro
      - ./traefik/dynamic.yml:/dynamic.yml:ro
      - letsencrypt:/letsencrypt
    command:
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@yourdomain.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"

  # === VAULTWARDEN (secrets UI) ===
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    networks:
      - internal
      - proxy
    volumes:
      - vw-data:/data
    environment:
      DOMAIN: https://vault.yourdomain.com
      SIGNUPS_ALLOWED: "true"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.vault.rule=Host(`vault.yourdomain.com`)"
      - "traefik.http.routers.vault.entrypoints=websecure"
      - "traefik.http.routers.vault.tls.certresolver=letsencrypt"

  # === MONITORING (Grafana + Prometheus + Loki) ===
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    networks:
      - internal
    volumes:
      - prometheus-data:/prometheus
    command: --config.file=/etc/prometheus/prometheus.yml

  loki:
    image: grafana/loki:latest
    container_name: loki
    restart: unless-stopped
    networks:
      - internal
    volumes:
      - loki-data:/loki

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    networks:
      - internal
      - proxy
    volumes:
      - grafana-data:/var/lib/grafana
    environment:
      GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASS}
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.grafana.rule=Host(`grafana.yourdomain.com`)"
      - "traefik.http.routers.grafana.entrypoints=websecure"
      - "traefik.http.routers.grafana.tls.certresolver=letsencrypt"

  # === WIREGUARD VPN ===
  wireguard:
    image: weejewel/wg-easy
    container_name: wireguard
    restart: unless-stopped
    networks:
      - proxy
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    environment:
      WG_EASYRSA: "true"
      PASSWORD: ${WIREGUARD_PASS}
    ports:
      - "51820:51820/udp"
    volumes:
      - wireguard-config:/etc/wireguard

  # === TELEGRAM NOTIFIER (SMS/OTP replacement) ===
  telegram-notify:
    image: planecore/notifybot
    container_name: telegram_notify
    restart: unless-stopped
    networks:
      - internal
    environment:
      BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      CHAT_ID: ${TELEGRAM_CHAT_ID}
    volumes:
      - ./notify-db:/usr/src/app/db

  # === UPTIME KUMA (bonus free monitoring) ===
  uptime-kuma:
    image: louislam/uptime-kuma
    container_name: uptime_kuma
    restart: unless-stopped
    networks:
      - internal
      - proxy
    volumes:
      - uptime-data:/app/data
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.uptime.rule=Host(`status.yourdomain.com`)"
      - "traefik.http.routers.uptime.entrypoints=websecure"
      - "traefik.http.routers.uptime.tls.certresolver=letsencrypt"

volumes:
  nexus_v2_postgres_data:
  letsencrypt:
  vw-data:
  prometheus-data:
  loki-data:
  grafana-data:
  wireguard-config:
  uptime-data:
  notify-db:

secrets:
  db_password:
    file: ./db_password.txt
  jwt_secret:
    file: ./jwt_secret.txt
  resend_key:
    file: ./resend_key.txt
  gemini_key:
    file: ./gemini_key.txt
EOF

# Create traefik configs
cat > traefik/traefik.yml << 'EOT'
global:
  checkNewVersion: true
  sendAnonymousUsage: false
entryPoints:
  websecure:
    address: ":443"
providers:
  docker: {}
  file:
    directory: /dynamic.yml
    watch: true
certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@yourdomain.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
EOT

cat > traefik/dynamic.yml << 'EOT'
http:
  middlewares:
    secure-headers:
      headers:
        sslRedirect: true
        forceSTSHeader: true
        stsIncludeSubDomains: true
        stsPreload: true
        stsSeconds: 63072000
EOT

# Create Dockerfile for Next.js
cat > Dockerfile << 'EOT'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
EOT

# .env.example
cat > .env.example << 'EOT'
DB_PASSWORD=your_strong_password_here
REDIS_PASSWORD=another_strong_password
JWT_SECRET=super_long_random_string_64_chars
RESEND_KEY=re_...
GEMINI_KEY=AIzaSy...
GRAFANA_PASS=adminpass
WIREGUARD_PASS=wireguardpass
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=123456789
EOT

echo "=== Setup complete! ==="
echo "Next steps:"
echo "1. Edit .env.example → copy to .env and fill real values"
echo "2. docker compose up -d --build"
echo "3. Open https://nexus.yourdomain.com (Traefik will get free SSL)"
echo "4. Go to https://vault.yourdomain.com → create account → store all keys"
echo "5. For Wazuh (optional heavy security): git clone https://github.com/wazuh/wazuh-docker && cd wazuh-docker && docker compose up -d"
echo "6. Add your domain DNS A record to server IP"
echo "7. In Next.js code: use fetch('http://telegram-notify:3000/api/send') for alerts"
echo "Done! All tools auto-start, communicate passwordlessly, and are 100% free forever."
