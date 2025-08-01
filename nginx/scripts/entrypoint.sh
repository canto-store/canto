#!/bin/sh
# Initialize SSL certificates
/usr/local/bin/ssl-init.sh

# Start crond for certificate renewals
crond

# Start nginx in foreground
exec nginx -g "daemon off;"
