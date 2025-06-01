# Canto E-Commerce

A full-stack e-commerce application built with Next.js, React, TypeScript, and Node.js.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM

## Database Documentation

The complete database schema and relationships can be found in our [Database Documentation](https://dbdocs.io/omar.soubky/Canto-Store-Database). This includes:

- Entity Relationship Diagrams (ERD)
- Table schemas and relationships
- Field descriptions and constraints
- Indexes and foreign keys

## Getting Started

1. Clone the repository
2. Install dependencies for both frontend and backend:

   ```bash
   # Install frontend dependencies
   cd apps/web
   pnpm install

   # Install backend dependencies
   cd ../server
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
   cd apps/server
   # Create and migrate the database
   npx prisma migrate dev
   # Seed the database with initial data
   npx prisma db seed
   ```

5. Start the development servers:

   ```bash
   # Start backend server
   cd apps/server
   pnpm start

   # In a new terminal, start frontend server
   cd apps/web
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
canto/
├── apps/
│   ├── web/              # Next.js frontend application
│   │   ├── components/   # React components
│   │   ├── lib/         # Frontend utilities and data
│   │   └── app/         # Next.js app router pages
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
```

## API Documentation

The complete API documentation is available in our [Apidog Project](https://app.apidog.com/project/885156). This includes:

- Detailed endpoint documentation
- Request/response examples
- Error handling

## Development

### Backend Development

- Generate Prisma client: `npx prisma generate`
- Create new migration: `npx prisma migrate dev`
- Reset database: `npx prisma migrate reset`

### Docker Support

The backend can be run using Docker:

```bash
# Build the image
docker build -t canto-server .

# Run the container
docker run -p 3001:3001 canto-server
```

Application data is organized in the `lib/data/` directory:

- `hero-slides.ts` - Hero slider content
- `categories.ts` - Product categories
- `featured-products.ts` - Featured products
