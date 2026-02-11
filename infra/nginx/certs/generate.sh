#!/usr/bin/env bash
# Generate self-signed TLS certs for local development / CI.
# In production, replace with real certs (e.g. Let's Encrypt).

set -euo pipefail

CERT_DIR="$(cd "$(dirname "$0")" && pwd)"

openssl req -x509 -nodes -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 \
  -keyout "${CERT_DIR}/privkey.pem" \
  -out "${CERT_DIR}/fullchain.pem" \
  -days 365 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

chmod 644 "${CERT_DIR}/fullchain.pem"
chmod 640 "${CERT_DIR}/privkey.pem"

echo "✔ Self-signed certs written to ${CERT_DIR}/"
