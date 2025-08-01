#!/bin/bash

# Health check script for all services
set -e

echo "🏥 Checking service health..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service health
check_service() {
    local service=$1
    local status=$(docker-compose ps -q $service | xargs docker inspect --format='{{.State.Health.Status}}' 2>/dev/null || echo "not_found")
    
    case $status in
        "healthy")
            echo -e "${GREEN}✅ $service: Healthy${NC}"
            return 0
            ;;
        "unhealthy")
            echo -e "${RED}❌ $service: Unhealthy${NC}"
            return 1
            ;;
        "starting")
            echo -e "${YELLOW}⏳ $service: Starting${NC}"
            return 1
            ;;
        "not_found")
            echo -e "${RED}❌ $service: Not found or not running${NC}"
            return 1
            ;;
        *)
            echo -e "${RED}❌ $service: Unknown status ($status)${NC}"
            return 1
            ;;
    esac
}

# Check all services
services=("web" "server" "dashboard" "nginx")
all_healthy=true

for service in "${services[@]}"; do
    if ! check_service $service; then
        all_healthy=false
    fi
done

echo ""

if $all_healthy; then
    echo -e "${GREEN}🎉 All services are healthy!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some services are not healthy. Check logs with: docker-compose logs${NC}"
    exit 1
fi