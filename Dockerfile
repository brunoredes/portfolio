# ── Stage 1: Install dependencies ────────────
FROM node:22-alpine AS deps

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --ignore-scripts

# ── Stage 2: Build ──────────────────────────
FROM node:22-alpine AS build

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build && \
    rm -rf node_modules

# ── Stage 3: Serve (hardened) ────────────────
FROM macbre/nginx-http3:1.27.4 AS production

# Use the existing nginx user (uid 100) from the base image.
# Switch to root for setup, then drop back.
USER root

# Prepare writable dirs and clean defaults.
RUN rm -rf /usr/share/nginx/html/* \
           /etc/nginx/conf.d/default.conf \
           /docker-entrypoint.d/ \
           /var/log/nginx/* \
           /var/cache/nginx/* && \
    mkdir -p /tmp/nginx /var/cache/nginx /var/log/nginx && \
    chown -R nginx:nginx /tmp/nginx /var/cache/nginx /var/log/nginx

# Strip package manager and shells (exec form — bypasses /bin/sh so it can delete it)
RUN ["rm", "-f", "/sbin/apk", "/bin/sh", "/bin/ash"]

# Copy built static files (owned by root = read-only for nginx)
COPY --from=build --chown=root:root /app/dist /usr/share/nginx/html

# Copy Nginx configuration (read-only)
COPY --chown=root:root infra/nginx/nginx.conf /etc/nginx/nginx.conf

# TLS certs — readable by nginx, writable by none.
# In production, mount real certs via volume or secrets.
COPY --chown=root:nginx infra/nginx/certs/*.pem /etc/nginx/certs/
RUN ["chmod", "750", "/etc/nginx/certs"]

# Drop to non-root user
USER nginx

EXPOSE 8080

STOPSIGNAL SIGQUIT

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=5s \
    CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
