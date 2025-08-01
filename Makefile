# Makefile for easy project management

.PHONY: help install start stop restart logs health build clean dev prod

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install and setup the project
	@echo "Setting up the project..."
	@chmod +x start.sh health-check.sh
	@if [ ! -f .env ]; then cp .env.example .env; echo "Created .env file from .env.example"; fi
	@mkdir -p ssl logs/nginx certbot
	@echo "Project setup complete!"

start: ## Start all services in production mode
	@./start.sh

stop: ## Stop all services
	@echo "Stopping all services..."
	@docker-compose down

restart: ## Restart all services
	@echo "Restarting all services..."
	@docker-compose restart

logs: ## Show logs for all services
	@docker-compose logs -f

health: ## Check health of all services
	@./health-check.sh

build: ## Build all images
	@echo "Building all images..."
	@docker-compose build --no-cache

clean: ## Clean up containers, images, and volumes
	@echo "Cleaning up..."
	@docker-compose down -v --remove-orphans
	@docker system prune -f

dev: ## Start in development mode
	@echo "Starting in development mode..."
	@docker-compose up -d

prod: ## Start in production mode with resource limits
	@echo "Starting in production mode..."
	@docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

ssl-setup: ## Setup SSL certificates (manual)
	@echo "Setting up SSL certificates..."
	@echo "Place your certificate files in ./ssl/ directory:"
	@echo "  - cert.pem (certificate)"
	@echo "  - private.key (private key)"
	@echo "  - chain.pem (certificate chain, optional)"

backup: ## Backup important data
	@echo "Creating backup..."
	@mkdir -p backups/$(shell date +%Y%m%d_%H%M%S)
	@cp -r ssl logs .env backups/$(shell date +%Y%m%d_%H%M%S)/
	@echo "Backup created in backups/ directory"