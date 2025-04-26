FROM node:lts-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/web ./apps/web

RUN corepack enable pnpm

RUN pnpm install --frozen-lockfile --filter web

FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app/apps/web

RUN corepack enable pnpm

RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
