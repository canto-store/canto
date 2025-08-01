#!/bin/bash

# Production deployment script for the complete stack
set -e

echo "🚀 Starting production deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    echo "   cp .env.example .env"
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p ssl
mkdir -p logs/nginx
mkdir -p certbot

# Set proper permissions
echo "🔐 Setting proper permissions..."
chmod 755 ssl logs certbot
chmod 755 logs/nginx

# Pull latest images and build
echo "🔨 Building and pulling images..."
docker-compose pull --ignore-pull-failures
docker-compose build --no-cache

# Start services
echo "🌟 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service status
echo "📊 Checking service status..."
docker-compose ps

# Show logs for any failed services
FAILED_SERVICES=$(docker-compose ps --services --filter "status=exited")
if [ ! -z "$FAILED_SERVICES" ]; then
    echo "❌ Some services failed to start:"
    for service in $FAILED_SERVICES; do
        echo "--- Logs for $service ---"
        docker-compose logs --tail=50 $service
    done
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your application should be available at:"
echo "   HTTP:  http://$(grep DOMAIN .env | cut -d '=' -f2)"
echo "   HTTPS: https://$(grep DOMAIN .env | cut -d '=' -f2)"
echo ""
echo "📋 Useful commands:"
echo "   View logs:           docker-compose logs -f"
echo "   Stop services:       docker-compose down"
echo "   Restart services:    docker-compose restart"
echo "   Update services:     ./start.sh"
echo ""
echo "🔒 SSL Certificate Setup:"
echo "   For Let's Encrypt:   Place certificates in ./ssl/ directory"
echo "   For manual certs:    Copy cert.pem and private.key to ./ssl/"
echo ""
echo "📝 Check logs at: ./logs/nginx/"