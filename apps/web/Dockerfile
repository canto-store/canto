FROM node:lts-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all app package.json files for dependency resolution  
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY apps/dashboard/package.json ./apps/dashboard/

# Enable pnpm and install dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the web app source code
COPY apps/web ./apps/web

ENV NEXT_TELEMETRY_DISABLED=1

# Enable pnpm and build the web app
RUN corepack enable pnpm && cd apps/web && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]