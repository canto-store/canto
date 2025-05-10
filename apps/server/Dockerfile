FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy only dependency files first for caching
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile

# Copy Prisma schema for generating client
COPY prisma ./prisma
RUN pnpm run prisma:generate

# Copy the rest of the source code
COPY . ./

RUN pnpm run prisma:migrate

# Build the application
RUN pnpm run build

EXPOSE 8000

ENV PORT=8000
CMD ["node", "build/index.js"]
