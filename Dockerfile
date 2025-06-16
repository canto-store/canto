FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Shared dependencies stage - only install what's needed for the target
FROM base AS deps
ARG TARGET_APP
WORKDIR /usr/src/app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package.json files based on target
COPY apps/${TARGET_APP}/package.json ./apps/${TARGET_APP}/
# Copy shared packages if they exist
COPY packages/*/package.json ./packages/*/

# Fetch and install dependencies
RUN pnpm fetch --prod
RUN pnpm install --frozen-lockfile --filter=${TARGET_APP}

# Build stage - build only the target app
FROM base AS build
ARG TARGET_APP
WORKDIR /usr/src/app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy all source code (needed for potential internal dependencies)
COPY . ./

# Install all dependencies for building
RUN pnpm fetch
RUN pnpm install --frozen-lockfile

# Build only the target app
RUN pnpm --filter=${TARGET_APP} build

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

# Copy built server app
COPY --from=build /usr/src/app/apps/server/build ./build
COPY --from=build /usr/src/app/apps/server/package.json ./package.json
COPY --from=build /usr/src/app/apps/server/prisma ./prisma

# Install only production dependencies for server
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma client if needed
RUN if [ -d "prisma" ]; then npx prisma generate; fi

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