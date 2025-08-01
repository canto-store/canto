FROM nginx:alpine

# Install openssl for certificate generation and certbot for Let's Encrypt
RUN apk add --no-cache openssl certbot certbot-nginx cronie

# Create necessary directories
RUN mkdir -p /etc/nginx/ssl/live \
    /etc/nginx/conf/sites \
    /var/log/nginx \
    /var/cache/nginx \
    /var/www/certbot

# Copy configuration files
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/ssl.conf /etc/nginx/conf/ssl.conf
COPY conf/security.conf /etc/nginx/conf/security.conf
COPY conf/sites/ /etc/nginx/conf/sites/

# Generate self-signed certificates for development fallback
RUN openssl req -x509 -newkey rsa:2048 -keyout /etc/nginx/ssl/default.key \
    -out /etc/nginx/ssl/default.crt -days 365 -nodes \
    -subj "/C=US/ST=Dev/L=Dev/O=Dev/OU=Dev/CN=localhost"

# Create DH parameters for enhanced security
RUN openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048

# Set proper permissions
RUN chmod 600 /etc/nginx/ssl/*.key \
    && chmod 644 /etc/nginx/ssl/*.crt \
    && chmod 644 /etc/nginx/ssl/dhparam.pem

# Copy SSL initialization script
COPY scripts/ssl-init.sh /usr/local/bin/ssl-init.sh
RUN chmod +x /usr/local/bin/ssl-init.sh

# Create entrypoint script
RUN echo '#!/bin/sh\n\
# Initialize SSL certificates\n\
/usr/local/bin/ssl-init.sh\n\
\n\
# Start crond for certificate renewals\n\
crond\n\
\n\
# Start nginx in foreground\n\
exec nginx -g "daemon off;"\n\
' > /entrypoint.sh \
&& chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Create nginx user and set ownership
RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx

# Expose ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]