import { PrismaClient } from "@prisma/client";

export const name = "products";
export const description = "Seeds the database with sample products";

interface Brand {
  name: string;
  slug: string;
}

interface ProductSummary {
  name: string;
  brand: Brand;
  price: number;
  salePrice?: number;
  image: string;
  slug: string;
}

// Products data
const FEATURED_PRODUCTS: ProductSummary[] = [
  {
    name: "Armchair",
    brand: {
      name: "ZOYA HOME",
      slug: "zoya-home",
    },
    price: 599.99,
    salePrice: 499.99,
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "armchair",
  },
  {
    name: "Mug Set",
    brand: {
      name: "ELI HOME",
      slug: "eli-home",
    },
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "mug-set",
  },
  {
    name: "Colorful Hills",
    brand: {
      name: "MARIAM TAWFIK",
      slug: "mariam-tawfik",
    },
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "colorful-hills",
  },
  {
    name: "Spine Side Table",
    brand: {
      name: "CASA NOVELLE",
      slug: "casa-novelle",
    },
    price: 459.99,
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "spine-side-table",
  },
  {
    name: "Snake Plant",
    brand: {
      name: "MASHTAL NABTA",
      slug: "mashtal-nabta",
    },
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1572688484438-313a6e50c333?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "snake-plant",
  },
];

const NEW_ARRIVALS: ProductSummary[] = [
  {
    name: "Basic Crewneck",
    brand: {
      name: "BROWNTOAST",
      slug: "browntoast",
    },
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "basic-crewneck",
  },
  {
    name: "Pink Dreams Couch",
    brand: {
      name: "WALNUT",
      slug: "walnut",
    },
    price: 1299.99,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "pink-dreams-couch",
  },
  {
    name: "Beats Headphones",
    brand: {
      name: "TROJAN",
      slug: "trojan",
    },
    price: 349.99,
    image:
      "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "beats-headphones",
  },
  {
    name: "Canvas Backpack",
    brand: {
      name: "NOMAD",
      slug: "nomad",
    },
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "canvas-backpack",
  },
  {
    name: "Minimalist Sneakers",
    brand: {
      name: "CLEAN KICKS",
      slug: "clean-kicks",
    },
    price: 119.99,
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "minimalist-sneakers",
  },
];

const BEST_SELLERS: ProductSummary[] = [
  {
    name: "Oversized Cotton Hoodie",
    brand: {
      name: "ESSENTIALS",
      slug: "essentials",
    },
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "oversized-cotton-hoodie",
  },
  {
    name: "Classic Denim Jacket",
    brand: {
      name: "VINTAGE",
      slug: "vintage",
    },
    price: 189.99,
    image:
      "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "classic-denim-jacket",
  },
  {
    name: "Minimalist Watch",
    brand: {
      name: "TIMELESS",
      slug: "timeless",
    },
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "minimalist-watch",
  },
  {
    name: "Premium Leather Sneakers",
    brand: {
      name: "LUXE STEPS",
      slug: "luxe-steps",
    },
    price: 259.99,
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "premium-leather-sneakers",
  },
  {
    name: "Slim Fit Jeans",
    brand: {
      name: "DENIM CO",
      slug: "denim-co",
    },
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "slim-fit-jeans",
  },
];

const ADDITIONAL_PRODUCTS: ProductSummary[] = [
  {
    name: "Cashmere Sweater",
    brand: {
      name: "LUXE KNITS",
      slug: "luxe-knits",
    },
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "cashmere-sweater",
  },
  {
    name: "Leather Crossbody Bag",
    brand: {
      name: "URBAN CARRY",
      slug: "urban-carry",
    },
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "leather-crossbody-bag",
  },
  {
    name: "Aviator Sunglasses",
    brand: {
      name: "SHADE MASTERS",
      slug: "shade-masters",
    },
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "aviator-sunglasses",
  },
  {
    name: "Wireless Headphones",
    brand: {
      name: "AUDIO PRO",
      slug: "audio-pro",
    },
    price: 179.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "wireless-headphones",
  },
  {
    name: "Graphic T-Shirt",
    brand: {
      name: "STREET CULTURE",
      slug: "street-culture",
    },
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=600&h=600",
    slug: "graphic-t-shirt",
  },
];

// Combine all products, removing duplicates by slug
const ALL_PRODUCTS = [
  ...FEATURED_PRODUCTS,
  ...NEW_ARRIVALS,
  ...BEST_SELLERS,
  ...ADDITIONAL_PRODUCTS,
].filter(
  (product, index, self) =>
    index === self.findIndex((p) => p.slug === product.slug)
);

export async function run(prisma: PrismaClient): Promise<void> {
  console.log("Seeding products...");

  // Create default category if none exists
  let defaultCategory = await prisma.category.findFirst();
  if (!defaultCategory) {
    defaultCategory = await prisma.category.create({
      data: {
        name: "General",
        slug: "general",
        description: "General product category",
      },
    });
  }

  // For discounted products, we'll just note the discount without a formal sale model
  // since the sale model doesn't seem to exist in the schema
  const saleId = 1; // We'll use this as a placeholder

  // Process each product
  for (const product of ALL_PRODUCTS) {
    // Find or create the brand
    let brand = await prisma.brand.findFirst({
      where: { slug: product.brand.slug },
    });

    if (!brand) {
      // Create a seller first if none exists
      let seller = await prisma.seller.findFirst();
      if (!seller) {
        seller = await prisma.seller.create({
          data: {
            name: "Default Seller",
            email: "seller@example.com",
            password: "password123", // In a real app, this would be hashed
            phone_number: "1234567890",
          },
        });
      }

      // Now create the brand
      brand = await prisma.brand.create({
        data: {
          name: product.brand.name,
          slug: product.brand.slug,
          email: `${product.brand.slug}@example.com`,
          sellerId: seller.id,
          description: `${product.brand.name} is a premium brand offering quality products.`,
        },
      });
    }

    // Create the product
    const productRecord = await prisma.product
      .create({
        data: {
          name: product.name,
          slug: product.slug,
          description: `This is a description for ${product.name}.`,
          brandId: brand.id,
          categoryId: defaultCategory.id,
        },
      })
      .catch((error) => {
        if (error.code === "P2002") {
          console.log(
            `Product with slug ${product.slug} already exists. Skipping.`
          );
          return null;
        }
        throw error;
      });

    if (productRecord) {
      // Create a variant for the product
      const price = Math.round(product.price * 100); // Convert to cents
      const hasSalePrice =
        "salePrice" in product && product.salePrice !== undefined;

      await prisma.productVariant.create({
        data: {
          productId: productRecord.id,
          sku: `SKU-${product.slug}`,
          price: price,
          stock: 100,
          sale_id: hasSalePrice ? saleId : null,
          images: {
            create: [
              {
                url: product.image,
                alt_text: product.name,
              },
            ],
          },
        },
      });
    }
  }

  console.log("Products seeding completed!");
}
