# Canto E-Commerce

A modern e-commerce application built with Next.js, React, and TypeScript.

## Component Structure

The application follows a modular component structure for better maintainability and reusability:

### Layout Components (`components/layout/`)

- `Header.tsx` - Main navigation header with cart, search, and user menu
- `Footer.tsx` - Site footer with navigation links and newsletter signup
- `PageLayout.tsx` - Wrapper component for consistent page layout
- `PageShell.tsx` - Enhanced page layout with container and title support

### Home Page Components (`components/home/`)

- `HeroSlider.tsx` - Hero image slider for the homepage
- `CategoryGrid.tsx` - Grid display of product categories
- `FeaturedProducts.tsx` - Featured products section

### Product Components (`components/products/`)

- `ProductCard.tsx` - Individual product card with image, details, and actions
- `ProductGrid.tsx` - Grid display of product cards

### Common Components (`components/common/`)

- `SliderButton.tsx` - Reusable button for sliders
- `CategoryCard.tsx` - Individual category card
- `SectionContainer.tsx` - Consistent container for page sections

### UI Components (`components/ui/`)

- Shadcn UI components

## Import Strategy

The application uses a combination of barrel imports (via index.ts files) and direct imports:

- Index files are provided in each component directory for convenient imports
- If you encounter issues with barrel imports (especially in development mode), consider importing components directly from their source files
- Circular dependencies have been avoided by using relative imports within component directories

## Data Structure

Application data is organized in the `lib/data/` directory:

- `hero-slides.ts` - Hero slider content
- `categories.ts` - Product categories
- `featured-products.ts` - Featured products

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

You can also use pnpm:

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run the development server: `pnpm dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
