FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Deps stage - install dependencies with optimal caching
FROM base AS deps
COPY pnpm-lock.yaml /usr/src/app/
WORKDIR /usr/src/app
RUN pnpm fetch --prod

COPY pnpm-workspace.yaml package.json /usr/src/app/
COPY apps/web/package.json /usr/src/app/apps/web/
COPY apps/server/package.json /usr/src/app/apps/server/
COPY apps/dashboard/package.json /usr/src/app/apps/dashboard/

RUN pnpm install --frozen-lockfile

# Build stage - install all dependencies and build all apps
FROM base AS build
COPY pnpm-lock.yaml /usr/src/app/
WORKDIR /usr/src/app
RUN pnpm fetch

COPY . /usr/src/app
RUN pnpm install --offline --frozen-lockfile

RUN pnpm run -r build

# Web app (Next.js) production image
FROM base AS web
WORKDIR /app

# Create nextjs user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Next.js standalone output from build stage
COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build --chown=nextjs:nodejs /usr/src/app/apps/web/public ./apps/web/public

USER nextjs

# Next.js specific environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000
CMD ["node", "apps/web/server.js"]

# Deploy stage - create clean production deployments
FROM base AS deploy
WORKDIR /usr/src/app
COPY . /usr/src/app

# Deploy server app to a clean directory
RUN pnpm --filter=server deploy /tmp/server --prod

# Copy built files to deployment
COPY --from=build /usr/src/app/apps/server/build /tmp/server/build

# Generate Prisma client in the deployed server directory
WORKDIR /tmp/server
RUN npx prisma generate

# Server app (Express) production image  
FROM base AS server
WORKDIR /app

# Copy the clean deployment (no symlinks)
COPY --from=deploy /tmp/server ./

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000
CMD ["node", "build/src/index.js"]


# Dashboard app (Vite React) production image
FROM base AS dashboard
WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve

# Copy built dashboard app (dist folder)
COPY --from=build /usr/src/app/apps/dashboard/dist ./dist

# Set production environment
ENV NODE_ENV=production

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]