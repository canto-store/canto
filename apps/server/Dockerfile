FROM node:lts-alpine

# Set working directory
WORKDIR /app

# Copy only dependency files first for caching
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
RUN --mount=type=secret,id=uploadthing_token \
  export UPLOADTHING_TOKEN=$(cat /run/secrets/uploadthing_token) && \
  pnpm run db:deploy

COPY . ./
RUN pnpm run build

EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000
CMD ["node", "build/src/index.js"]
