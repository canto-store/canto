FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all app package.json files for dependency resolution
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY apps/dashboard/package.json ./apps/dashboard/

# Enable pnpm and install dependencies
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile

# Copy prisma schema and run database deployment
COPY apps/server/prisma ./apps/server/prisma
RUN --mount=type=secret,id=database_url \
  export DATABASE_URL=$(cat /run/secrets/database_url) && \
  cd apps/server && \
  pnpm run db:deploy

# Copy the server app source code
COPY apps/server ./apps/server

# Build the server app
RUN cd apps/server && pnpm run build

EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000
CMD ["node", "apps/server/build/src/index.js"]
