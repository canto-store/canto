# Canto E-Commerce AI Development Guide

## Architecture Overview

Canto is a **Bun monorepo workspace** with three main applications:

- `apps/web/` - Next.js 15 customer frontend (port 5000 in dev, 3000 in prod)
- `apps/dashboard/` - Vite admin dashboard with TanStack Router (port 5173)
- `apps/server/` - Express.js API with PostgreSQL + Elasticsearch (port 3001)
- `modules/types/` - Shared TypeScript types using Zod validation

**Key Integration Points:**

- Shared types via `@canto/types` workspace package
- PostgreSQL with Prisma ORM for relational data
- Elasticsearch for product search and analytics
- AWS S3 for file uploads
- Email system with React Email templates

## Critical Developer Workflows

### Database Operations (from `apps/server/`)

```bash
bun run db:migrate     # Create and apply new migrations
bunx prisma generate   # Regenerate client after schema changes
bunx prisma db seed    # Populate with seed data
bunx prisma studio     # Visual database browser
```

### Development Setup

```bash
# Root level - starts all apps in parallel
bun run dev

# Individual apps (use --cwd for workspace targeting)
bun run --cwd apps/web dev
bun run --cwd apps/server dev
bun run --cwd apps/dashboard dev
```

### Environment Configuration

- **Frontend**: `apps/web/.env.local`
- **Backend**: `apps/server/.env`
- **Dashboard**: Uses `VITE_BACKEND_URL` prefix

## Project-Specific Patterns

### Module-Based Backend Architecture

Server follows **domain modules** pattern in `apps/server/src/modules/`:

```
modules/
├── auth/           # v1 & v2 authentication APIs
├── product/        # Products, categories, options, home
├── seller/         # Brand management, sales tracking
├── user/           # Address, cart, balance, wishlist
├── order/          # Order processing & management
├── search/         # Elasticsearch integration
└── dashboard/      # Admin analytics & reporting
```

### Database Patterns

- **Enums**: `UserRole`, `OrderStatus`, `ProductStatus`, `SaleType`, `ReturnStatus`
- **Relationships**: Users can have multiple roles, cascade deletes on product variants
- **Activity Tracking**: `ActivityType` enum tracks seller registration, product changes
- **Multi-tenant**: Sellers own brands, brands own products

### Frontend State Management

- **Web**: Zustand stores in `apps/web/src/stores/`
- **Dashboard**: Zustand + TanStack Query for server state
- **Shared Types**: Import from `@canto/types` for API contracts

### Authentication Flow

- **Dual API versions**: `/v1/auth` and `/v2/auth` routes
- **JWT + Cookies**: Secure httpOnly cookies with JWT tokens
- **Role-based**: GUEST, USER, SELLER, ADMIN hierarchy
- **Reset tokens**: UUID-based with expiry tracking

## Integration Patterns

### Cross-App Communication

- **API Base URLs**: Environment-specific in each frontend
- **CORS Setup**: Different origins for prod/staging/dev in server
- **Type Safety**: Shared Zod schemas in `modules/types/`

### Search Implementation

- **Elasticsearch**: Product indexing with configurable auth
- **Search Modules**: `apps/server/src/modules/search/`
- **Connection Health**: Startup checks for ES availability

### File Upload Strategy

- **AWS S3**: Digital Ocean Spaces integration
- **Upload Module**: `apps/server/src/modules/upload/`
- **Environment Keys**: SPACES_KEY, SPACES_SECRET, SPACES_BUCKET

## Development Guidelines

### Workspace Commands

Always use `bun run --cwd apps/[app]` for app-specific operations. Root-level scripts coordinate all apps.

### Database Schema Changes

1. Modify `apps/server/prisma/schema.prisma`
2. Run `bun run db:migrate` with descriptive name
3. Run `bunx prisma generate` to update client
4. Update `@canto/types` if API contracts change

### Adding New Features

1. **Backend**: Create module in `src/modules/[domain]/`
2. **Routes**: Export from module and import in `src/routes.ts`
3. **Types**: Define in `modules/types/[domain]/` with Zod schemas
4. **Frontend**: Import types from `@canto/types`

### Docker Deployment

- **Multi-stage**: Each app has separate container images
- **Environment**: Uses `.env` files with `${VARIABLE}` substitution
- **Networks**: `canto-network` for inter-service communication
- **Staging**: Separate `docker-compose.staging.yml` configuration

## Key Files to Understand

- `apps/server/src/routes.ts` - Complete API route mapping
- `apps/server/prisma/schema.prisma` - Full data model with relationships
- `modules/types/` - Shared type definitions and validation
- `apps/server/src/index.ts` - CORS and middleware configuration
- Root `package.json` - Monorepo workspace scripts and tooling
