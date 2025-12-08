###############################
# BASE IMAGE
###############################
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install OpenSSL for Prisma (Bun still needs it)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*


###############################
# DEPS (install workspace deps using Bun)
###############################
FROM base AS deps
WORKDIR /usr/src/app

# Copy workspace manifests first for caching
COPY bunfig.toml bun.lock package.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY modules ./modules

# Install dependencies (cached)
RUN bun install --frozen-lockfile


###############################
# BUILD
###############################
FROM deps AS build
ARG TARGET_APP
ARG NODE_ENV=production
ARG NEXT_PUBLIC_BACKEND_URL
ARG VITE_BACKEND_URL

WORKDIR /usr/src/app

# Copy full source AFTER deps
COPY apps ./apps
COPY modules ./modules

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Build shared modules
RUN bun run --filter='@canto/*' build

# Build only target
RUN bun run --filter=${TARGET_APP} build


###############################
# SERVER DEPLOY (Express API)
###############################
FROM base AS deploy-server
WORKDIR /tmp/server

# Copy all workspace manifests (must match deps stage for frozen lockfile)
COPY bunfig.toml bun.lock package.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY apps/server/prisma ./apps/server/prisma/
COPY apps/server/prisma.config.ts ./apps/server/
COPY modules ./modules

# Install only production deps
RUN bun install --production --frozen-lockfile

# Generate Prisma client (doesn't need database connection)
RUN cd apps/server && bunx prisma generate

# Copy entrypoint script for migrations
COPY apps/server/docker-entrypoint.sh ./apps/server/


###############################
# WEB PRODUCTION (Next.js)
###############################
FROM node:20-slim AS web
ARG NODE_ENV=production
ARG PORT=3000

WORKDIR /app

# Required users for Next.js standalone runtime
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Bring built Next.js standalone server
COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/web/public ./apps/web/public

USER nextjs

ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=${PORT}
ENV HOSTNAME="0.0.0.0"

EXPOSE ${PORT}
CMD ["node", "apps/web/server.js"]


###############################
# EXPRESS SERVER FINAL RUNTIME
###############################
FROM oven/bun:1-slim AS server
ARG NODE_ENV=production
ARG PORT=8000
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY --from=deploy-server /tmp/server ./

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

EXPOSE ${PORT}

# Run migrations at startup, then start server
ENTRYPOINT ["sh", "apps/server/docker-entrypoint.sh"]
CMD ["bun", "run", "apps/server/src/index.ts"]


###############################
# DASHBOARD (Vite) PRODUCTION
###############################
FROM oven/bun:1-slim AS dashboard
ARG NODE_ENV=production
ARG PORT=5173

WORKDIR /app

# Copy built static site from Bun's build
COPY --from=build /usr/src/app/apps/dashboard/dist ./dist

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
EXPOSE ${PORT}

# Use Bun's built-in static file server with SPA fallback
CMD ["sh", "-c", "bun --bun x serve dist -l tcp://0.0.0.0:${PORT} -s"]
