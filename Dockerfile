###############################
# BASE IMAGE
###############################
FROM oven/bun:1 as base
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
RUN bun run --filter=modules build

# Build only target
RUN bun run --filter=${TARGET_APP} build


###############################
# SERVER DEPLOY (Express API)
###############################
FROM base AS deploy-server
WORKDIR /tmp/server

COPY bunfig.toml bun.lock package.json ./
COPY apps/server/package.json ./apps/server/
COPY apps/server/prisma ./apps/server/prisma/
COPY modules ./modules

# Install only production deps
RUN bun install --production --frozen-lockfile

# Copy built assets
COPY --from=build /usr/src/app/apps/server/build ./apps/server/build

# Prisma migration + generate
RUN --mount=type=secret,id=database_url,env=DATABASE_URL \
    bunx prisma migrate deploy

RUN bunx prisma generate


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
FROM node:20-slim AS server
ARG NODE_ENV=production
ARG PORT=8000
WORKDIR /app

COPY --from=deploy-server /tmp/server ./

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

EXPOSE ${PORT}
CMD ["node", "apps/server/build/src/index.js"]


###############################
# DASHBOARD (Vite) PRODUCTION
###############################
FROM nginx:alpine AS dashboard
ARG NODE_ENV=production
ARG PORT=5173

WORKDIR /app

# Copy built static site from Bun's build
COPY --from=build /usr/src/app/apps/dashboard/dist /usr/share/nginx/html

ENV NODE_ENV=${NODE_ENV}
EXPOSE ${PORT}

CMD ["nginx", "-g", "daemon off;"]
