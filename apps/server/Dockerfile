FROM node:lts-alpine

ARG DATABASE_URL

# Set working directory
WORKDIR /app

# Copy only dependency files first for caching
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile

ENV DATABASE_URL=${DATABASE_URL}
COPY prisma ./prisma
RUN pnpm run db:deploy

COPY . ./
RUN pnpm run build

EXPOSE 8000

ENV PORT=8000
CMD ["node", "build/index.js"]
