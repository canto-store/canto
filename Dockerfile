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

# Deploy each app with production dependencies only
RUN pnpm deploy --filter=web --prod /prod/web
RUN pnpm deploy --filter=server --prod /prod/server  
RUN pnpm deploy --filter=dashboard --prod /prod/dashboard

# Web app (Next.js) production image
FROM base AS web
WORKDIR /prod/web

# Copy the deployed web app
COPY --from=build /prod/web /prod/web

# Create nextjs user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permissions for Next.js standalone output
RUN chown -R nextjs:nodejs /prod/web
USER nextjs

# Next.js specific environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000
CMD ["node", "server.js"]

# Server app (Express) production image  
FROM base AS server
WORKDIR /prod/server

# Copy the deployed server app
COPY --from=build /prod/server /prod/server

# Set production environment
ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000
CMD ["node", "build/src/index.js"]

# Dashboard app (Vite React) production image
FROM base AS dashboard
WORKDIR /prod/dashboard

# Install serve for static file serving
RUN npm install -g serve

# Copy the deployed dashboard app
COPY --from=build /prod/dashboard /prod/dashboard

# Set production environment
ENV NODE_ENV=production

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]