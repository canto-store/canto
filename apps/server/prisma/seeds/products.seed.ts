export const FEATURED_PRODUCTS = [
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

export const NEW_ARRIVALS = [
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

export const BEST_SELLERS = [
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

const ALL_PRODUCTS = [...FEATURED_PRODUCTS, ...NEW_ARRIVALS, ...BEST_SELLERS];

import { PrismaClient } from "@prisma/client";
import { ProductStatus } from "../../src/modules/product/product.types";

export const name = "products";
export const description = "Seed for products";

export async function run(prisma: PrismaClient): Promise<void> {
  console.log("Creating products...");

  // Create each product in the ALL_PRODUCTS array
  for (let i = 0; i < ALL_PRODUCTS.length; i++) {
    const productInfo = ALL_PRODUCTS[i];

    const product = await prisma.product.create({
      data: {
        name: productInfo.name,
        slug: productInfo.slug,
        status: ProductStatus.ACTIVE,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        brand: { connect: { id: 1 } }, // Assuming 5 brands exist
        category: { connect: { id: (i % 10) + 1 } }, // Distribute across 5 categories
        variants: {
          create: [
            {
              sku: `SKU-${String(i + 1).padStart(3, "0")}`,
              price: Math.round(productInfo.price * 100), // Convert to cents
              stock: 10 + Math.floor(Math.random() * 90), // Random stock between 10-99
              sale:
                "salePrice" in productInfo ? { connect: { id: 1 } } : undefined,
              images: {
                create: [
                  {
                    url: productInfo.image,
                    alt_text: productInfo.name,
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log(
      `🚀 ~ Created Product ${i + 1}/${ALL_PRODUCTS.length}: ${product.id} - ${
        product.name
      }`
    );
  }
}
