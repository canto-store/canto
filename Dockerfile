FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install OpenSSL to fix Prisma warnings
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Dependencies stage - optimized for Docker layer caching
FROM base AS deps
WORKDIR /usr/src/app

# Copy package files first for optimal caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY apps/dashboard/package.json ./apps/dashboard/

# Install all dependencies in a cached layer
RUN pnpm fetch
RUN pnpm install --frozen-lockfile

# Build stage - build only the target app
FROM deps AS build
ARG TARGET_APP

# Copy source code only after dependencies are installed
COPY apps/ ./apps/

# Build only the target app
RUN pnpm --filter=${TARGET_APP} build

# Deploy stage - create clean production deployment for server
FROM base AS deploy-server
WORKDIR /usr/src/app

# Copy package files for server deployment
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY apps/server/prisma/ ./apps/server/prisma/

# Deploy server app to a clean directory with only prod dependencies
RUN pnpm --filter=server deploy /tmp/server --prod

# Copy built files to deployment
COPY --from=build /usr/src/app/apps/server/build /tmp/server/build

# Copy prisma schema for client generation
COPY --from=build /usr/src/app/apps/server/prisma /tmp/server/prisma

# Generate Prisma client in the deployed server directory
WORKDIR /tmp/server
RUN npx prisma generate

# Web app (Next.js) production image
FROM base AS web
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/web/public ./apps/web/public

USER nextjs

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000
CMD ["node", "apps/web/server.js"]

# Server app (Express) production image  
FROM base AS server
WORKDIR /app

# Copy the clean deployment (no symlinks, only prod dependencies)
COPY --from=deploy-server /tmp/server ./

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000
CMD ["node", "build/src/index.js"]

# Dashboard app (Vite React) production image
FROM base AS dashboard
WORKDIR /app

RUN npm install -g serve

COPY --from=build /usr/src/app/apps/dashboard/dist ./dist

ENV NODE_ENV=production

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]