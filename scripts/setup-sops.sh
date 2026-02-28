#!/usr/bin/env bash
# =============================================================================
# NEXUS SOPS + age Setup
# Sets up encrypted secrets management so you can safely commit .env to Git.
#
# Tools used (all free & open source):
#   • age      — modern file encryption (replaces GPG)
#   • sops     — secrets manager that encrypts individual YAML/JSON/ENV values
#
# Usage:
#   ./scripts/setup-sops.sh [--install] [--init] [--encrypt] [--decrypt] [--rotate]
#
#   --install   Install age and sops binaries (Linux x86-64)
#   --init      Generate a new age key pair and write .sops.yaml config
#   --encrypt   Encrypt .env → .env.enc  (safe to commit)
#   --decrypt   Decrypt .env.enc → .env  (run on a fresh clone)
#   --rotate    Re-encrypt .env.enc with a new key (adds recipient)
#   (no flags)  Run --install then --init then --encrypt
#
# Typical first-time workflow:
#   ./scripts/setup-sops.sh          # install, generate key, encrypt .env
#   git add .env.enc .sops.yaml
#   git commit -m "chore: add encrypted secrets"
#   # On a new machine:
#   ./scripts/setup-sops.sh --install
#   age-keygen -o ~/.config/sops/age/nexus.txt   # or share your key securely
#   ./scripts/setup-sops.sh --decrypt
# =============================================================================
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
SOPS_VERSION="3.8.1"
AGE_VERSION="1.1.1"
KEY_DIR="${HOME}/.config/sops/age"
KEY_FILE="${KEY_DIR}/nexus.txt"
SOPS_CONFIG=".sops.yaml"
ENV_FILE=".env"
ENV_ENC=".env.enc"

# ── Colours ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}[✓]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
fail() { echo -e "${RED}[✗]${NC} $*"; exit 1; }
info() { echo -e "${CYAN}[i]${NC} $*"; }

# ── Helpers ───────────────────────────────────────────────────────────────────
detect_arch() {
  case "$(uname -m)" in
    x86_64)  echo "amd64" ;;
    aarch64) echo "arm64" ;;
    armv7l)  echo "arm"   ;;
    *)       fail "Unsupported architecture: $(uname -m)" ;;
  esac
}

install_binary() {
  local name="$1" url="$2" dest="/usr/local/bin/${name}"
  info "Downloading ${name}..."
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" -o "/tmp/${name}"
  else
    wget -qO "/tmp/${name}" "$url"
  fi
  chmod +x "/tmp/${name}"
  sudo mv "/tmp/${name}" "$dest"
  ok "${name} installed → ${dest}"
}

# ── Actions ───────────────────────────────────────────────────────────────────
do_install() {
  local arch; arch=$(detect_arch)
  echo ""
  echo "Installing age and sops (arch: ${arch})..."

  # Install age
  if command -v age >/dev/null 2>&1; then
    ok "age already installed ($(age --version))"
  else
    local age_url="https://github.com/FiloSottile/age/releases/download/v${AGE_VERSION}/age-v${AGE_VERSION}-linux-${arch}.tar.gz"
    info "Downloading age v${AGE_VERSION}..."
    curl -fsSL "$age_url" -o /tmp/age.tar.gz
    tar -xzf /tmp/age.tar.gz -C /tmp
    sudo mv /tmp/age/age /usr/local/bin/age
    sudo mv /tmp/age/age-keygen /usr/local/bin/age-keygen
    rm -rf /tmp/age /tmp/age.tar.gz
    ok "age installed"
  fi

  # Install sops
  if command -v sops >/dev/null 2>&1; then
    ok "sops already installed ($(sops --version))"
  else
    local sops_url="https://github.com/getsops/sops/releases/download/v${SOPS_VERSION}/sops-v${SOPS_VERSION}.linux.${arch}"
    install_binary "sops" "$sops_url"
  fi
}

do_init() {
  echo ""
  echo "Initialising SOPS + age key..."

  # Create key directory
  mkdir -p "$KEY_DIR"
  chmod 700 "$KEY_DIR"

  if [[ -f "$KEY_FILE" ]]; then
    warn "Key already exists at ${KEY_FILE} — skipping key generation"
    warn "Delete it manually if you want a fresh key"
  else
    age-keygen -o "$KEY_FILE"
    chmod 600 "$KEY_FILE"
    ok "New age key generated → ${KEY_FILE}"
    warn "BACK UP THIS KEY FILE.  If lost, your encrypted secrets are unrecoverable."
    echo ""
    info "Public key:"
    grep "public key:" "$KEY_FILE" | awk '{print $4}'
    echo ""
  fi

  # Extract public key
  local pub_key
  pub_key=$(grep "public key:" "$KEY_FILE" | awk '{print $4}')

  # Write .sops.yaml
  cat > "$SOPS_CONFIG" <<EOF
# SOPS configuration — controls which files are encrypted and with which keys.
# Committed to Git (safe — only public keys here).
creation_rules:
  - path_regex: \.env(\..*)?$
    age: >-
      ${pub_key}
EOF
  ok "Written ${SOPS_CONFIG}"

  # Add key to .gitignore if not already
  local gitignore=".gitignore"
  if [[ -f "$gitignore" ]] && grep -q "nexus.txt" "$gitignore"; then
    ok "Key file already in .gitignore"
  else
    echo "" >> "$gitignore"
    echo "# age private key (NEVER commit)" >> "$gitignore"
    echo "${KEY_FILE}" >> "$gitignore"
    ok "Added ${KEY_FILE} to .gitignore"
  fi

  echo ""
  info "Next step: run  ./scripts/setup-sops.sh --encrypt"
}

do_encrypt() {
  echo ""
  if [[ ! -f "$ENV_FILE" ]]; then
    fail "${ENV_FILE} not found — nothing to encrypt"
  fi
  if [[ ! -f "$SOPS_CONFIG" ]]; then
    fail "${SOPS_CONFIG} not found — run  ./scripts/setup-sops.sh --init  first"
  fi
  info "Encrypting ${ENV_FILE} → ${ENV_ENC}..."
  SOPS_AGE_KEY_FILE="$KEY_FILE" sops --encrypt "$ENV_FILE" > "$ENV_ENC"
  ok "Encrypted → ${ENV_ENC}"
  echo ""
  info "You can safely commit ${ENV_ENC} to Git."
  info "Add '${ENV_FILE}' to .gitignore so the plaintext is never committed."

  # Ensure .env is in .gitignore
  local gitignore=".gitignore"
  if [[ -f "$gitignore" ]] && grep -qE "^\.env$" "$gitignore"; then
    ok ".env already in .gitignore"
  else
    echo "" >> "$gitignore"
    echo "# Never commit plaintext secrets" >> "$gitignore"
    echo ".env" >> "$gitignore"
    ok "Added .env to .gitignore"
  fi
}

do_decrypt() {
  echo ""
  if [[ ! -f "$ENV_ENC" ]]; then
    fail "${ENV_ENC} not found — nothing to decrypt"
  fi
  if [[ ! -f "$KEY_FILE" ]]; then
    fail "Age key not found at ${KEY_FILE}"
    info "Share your private key securely, then place it at ${KEY_FILE}"
  fi
  info "Decrypting ${ENV_ENC} → ${ENV_FILE}..."
  SOPS_AGE_KEY_FILE="$KEY_FILE" sops --decrypt "$ENV_ENC" > "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  ok "Decrypted → ${ENV_FILE}"
}

do_rotate() {
  echo ""
  info "Re-encrypting with current key(s) from ${SOPS_CONFIG}..."
  if [[ ! -f "$ENV_ENC" ]]; then
    fail "${ENV_ENC} not found"
  fi
  SOPS_AGE_KEY_FILE="$KEY_FILE" sops --rotate --in-place "$ENV_ENC"
  ok "Rotated encryption — commit ${ENV_ENC} to Git"
}

# ── Main ──────────────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
echo "  NEXUS SOPS + age Secret Manager"
echo "═══════════════════════════════════════════"

if [[ $# -eq 0 ]]; then
  do_install
  do_init
  do_encrypt
  exit 0
fi

for arg in "$@"; do
  case "$arg" in
    --install) do_install ;;
    --init)    do_init    ;;
    --encrypt) do_encrypt ;;
    --decrypt) do_decrypt ;;
    --rotate)  do_rotate  ;;
    *)
      echo "Unknown flag: $arg"
      echo "Usage: $0 [--install] [--init] [--encrypt] [--decrypt] [--rotate]"
      exit 1
      ;;
  esac
done
