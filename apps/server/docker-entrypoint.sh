#!/bin/sh
set -e

echo "Running database migrations..."
cd apps/server && bunx prisma migrate deploy

echo "Starting server..."
cd /app
exec "$@"
