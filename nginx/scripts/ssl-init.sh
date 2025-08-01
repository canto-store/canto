#!/bin/sh
# Initialize SSL certificates using Let's Encrypt or fall back to self-signed

# Check if DOMAIN environment variable is set
if [ -z "$DOMAIN" ]; then
  echo "Error: DOMAIN environment variable is not set."
  exit 1
fi

# Extract the subdomains from DOMAIN (expected format: canto-store.com)
MAIN_DOMAIN=$DOMAIN
API_DOMAIN="api.$DOMAIN"
DASHBOARD_DOMAIN="dashboard.$DOMAIN"

# Check if valid certificates already exist
if [ -f "/etc/nginx/ssl/live/$MAIN_DOMAIN/fullchain.pem" ] && 
   [ -f "/etc/nginx/ssl/live/$API_DOMAIN/fullchain.pem" ] && 
   [ -f "/etc/nginx/ssl/live/$DASHBOARD_DOMAIN/fullchain.pem" ]; then
  echo "Valid certificates already exist. Skipping certificate generation."
  exit 0
fi

# Create directories for Let's Encrypt
mkdir -p /etc/letsencrypt/live
mkdir -p /var/www/certbot

# Request Let's Encrypt certificates
echo "Requesting Let's Encrypt certificates..."

# Stop nginx temporarily to free up port 80
nginx -s stop || true

# Request certificate for main domain
certbot certonly --standalone -d $MAIN_DOMAIN -d www.$MAIN_DOMAIN \
  --non-interactive --agree-tos --email admin@$DOMAIN \
  --cert-name $MAIN_DOMAIN \
  --logs-dir /var/log/letsencrypt

# Request certificate for API subdomain
certbot certonly --standalone -d $API_DOMAIN \
  --non-interactive --agree-tos --email admin@$DOMAIN \
  --cert-name $API_DOMAIN \
  --logs-dir /var/log/letsencrypt

# Request certificate for Dashboard subdomain
certbot certonly --standalone -d $DASHBOARD_DOMAIN \
  --non-interactive --agree-tos --email admin@$DOMAIN \
  --cert-name $DASHBOARD_DOMAIN \
  --logs-dir /var/log/letsencrypt

# Create directory structure for certificates
mkdir -p /etc/nginx/ssl/live/$MAIN_DOMAIN
mkdir -p /etc/nginx/ssl/live/$API_DOMAIN
mkdir -p /etc/nginx/ssl/live/$DASHBOARD_DOMAIN

# Copy certificates to nginx ssl directory
if [ -d "/etc/letsencrypt/live/$MAIN_DOMAIN" ]; then
  cp /etc/letsencrypt/live/$MAIN_DOMAIN/fullchain.pem /etc/nginx/ssl/live/$MAIN_DOMAIN/fullchain.pem
  cp /etc/letsencrypt/live/$MAIN_DOMAIN/privkey.pem /etc/nginx/ssl/live/$MAIN_DOMAIN/privkey.pem
else
  echo "Failed to obtain certificate for $MAIN_DOMAIN"
fi

if [ -d "/etc/letsencrypt/live/$API_DOMAIN" ]; then
  cp /etc/letsencrypt/live/$API_DOMAIN/fullchain.pem /etc/nginx/ssl/live/$API_DOMAIN/fullchain.pem
  cp /etc/letsencrypt/live/$API_DOMAIN/privkey.pem /etc/nginx/ssl/live/$API_DOMAIN/privkey.pem
else
  echo "Failed to obtain certificate for $API_DOMAIN"
fi

if [ -d "/etc/letsencrypt/live/$DASHBOARD_DOMAIN" ]; then
  cp /etc/letsencrypt/live/$DASHBOARD_DOMAIN/fullchain.pem /etc/nginx/ssl/live/$DASHBOARD_DOMAIN/fullchain.pem
  cp /etc/letsencrypt/live/$DASHBOARD_DOMAIN/privkey.pem /etc/nginx/ssl/live/$DASHBOARD_DOMAIN/privkey.pem
else
  echo "Failed to obtain certificate for $DASHBOARD_DOMAIN"
fi

# Add a cron job to auto-renew certificates
echo "0 12 * * * certbot renew --quiet --post-hook 'nginx -s reload'" > /etc/crontabs/root

echo "SSL certificates initialization completed."
