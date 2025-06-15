# Canto E-Commerce

A full-stack e-commerce application built with Next.js, React, TypeScript, and Node.js, organized as a pnpm monorepo workspace.

## Tech Stack

### Frontend (Web)

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Query
- Zustand (State Management)

### Dashboard

- Vite
- React 19
- TypeScript
- Tailwind CSS
- TanStack Router
- React Query
- React Table

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Elasticsearch

## Database Documentation

The complete database schema and relationships can be found in our [Database Documentation](https://dbdocs.io/omar.soubky/Canto-Store-Database). This includes:

- Entity Relationship Diagrams (ERD)
- Table schemas and relationships
- Field descriptions and constraints
- Indexes and foreign keys

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd canto
   ```

2. Install all dependencies (this will install dependencies for all workspace packages):

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   # Frontend (.env.local)
   cp apps/web/.env.example apps/web/.env.local

   # Backend (.env)
   cp apps/server/.env.example apps/server/.env
   ```

4. Set up the database:

   ```bash
   # Navigate to server directory
   cd apps/server

   # Create and migrate the database
   pnpm db:migrate

   # Generate Prisma client
   npx prisma generate

   # Seed the database with initial data
   npx prisma db seed
   ```

### Development

Start all applications in development mode:

```bash
# Start all apps in parallel (from root directory)
pnpm dev
```

Or start individual applications:

```bash
# Start backend server only
pnpm --filter server dev

# Start web frontend only
pnpm --filter web dev

# Start dashboard only
pnpm --filter dashboard dev
```

The applications will be available at:

- **Web Frontend**: [http://localhost:3000](http://localhost:3000)
- **Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

## Project Structure

```
canto/
├── apps/
│   ├── web/              # Next.js frontend application
│   │   ├── components/   # React components
│   │   ├── lib/         # Frontend utilities and data
│   │   └── app/         # Next.js app router pages
│   │
│   ├── dashboard/        # Vite-based admin dashboard
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── pages/       # Dashboard pages
│   │   │   └── lib/         # Utilities and services
│   │
│   └── server/          # Node.js backend application
│       ├── src/
│       │   ├── config/      # Configuration files
│       │   ├── controllers/ # Route controllers
│       │   ├── middleware/  # Custom middleware
│       │   ├── models/      # Database models
│       │   ├── routes/      # API routes
│       │   ├── services/    # Business logic
│       │   ├── types/       # TypeScript types
│       │   └── utils/       # Utility functions
│       ├── prisma/       # Database schema and migrations
│
├── package.json         # Root workspace configuration
├── pnpm-workspace.yaml  # pnpm workspace configuration
└── pnpm-lock.yaml      # Lockfile for all dependencies
```

## Available Scripts

### Root Level Commands (affects all workspaces)

```bash
# Install dependencies for all packages
pnpm install

# Run development servers for all apps
pnpm dev

# Build all applications
pnpm build

# Lint all packages
pnpm lint

# Format all code
pnpm format

# Type check all packages
pnpm type-check
```

### Package-Specific Commands

```bash
# Run commands for specific packages
pnpm --filter web <command>        # Web frontend
pnpm --filter server <command>     # Backend server
pnpm --filter dashboard <command>  # Dashboard

# Examples:
pnpm --filter web build
pnpm --filter server db:migrate
pnpm --filter dashboard preview
```

## API Documentation

The complete API documentation is available in our [Apidog Project](https://app.apidog.com/project/885156). This includes:

- Detailed endpoint documentation
- Request/response examples
- Error handling

## Development Workflow

### Backend Development

```bash
# Generate Prisma client after schema changes
cd apps/server
npx prisma generate

# Create new migration
pnpm db:migrate

# Reset database
npx prisma migrate reset

# Deploy migrations (production)
pnpm db:deploy
```

### Frontend Development

```bash
# Web app (Next.js)
cd apps/web
pnpm dev

# Dashboard (Vite)
cd apps/dashboard
pnpm dev
```

### Docker Support

The backend can be run using Docker:

```bash
cd apps/server

# Build the image
docker build -t canto-server .

# Run the container
docker run -p 3001:3001 canto-server
```

## Data Management

Application data is organized in the `apps/web/lib/data/` directory:

- `hero-slides.ts` - Hero slider content
- `categories.ts` - Product categories
- `featured-products.ts` - Featured products
