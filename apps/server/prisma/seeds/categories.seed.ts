import { PrismaClient } from "@prisma/client";

export const name = "categories";
export const description = "Seed for categories";

export async function run(prisma: PrismaClient): Promise<void> {
  const categories = await prisma.category.createMany({
    data: [
      {
        name: "Men's Fashion",
        slug: "mens-fashion",
        image:
          "https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimNblyBVHOgTbtLE7BpuWrJfeK435sxV1q98jG",
      },
      {
        name: "Women's Fashion",
        slug: "womens-fashion",
        image:
          "https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimPRWf9jkYd46AWrQwhF7q5BkJXNReV0G1gPLn",
      },
      {
        name: "Kids",
        slug: "kids",
        image:
          "https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimMRefTZz62rHY0pzhw39TeZItbkROoXPaQxdE",
      },
      {
        name: "Footwear",
        slug: "footwear",
        image:
          "https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimY46eFBiSjNvDhzJZU67fyeCXuAGQPlqHnFcE",
      },
      {
        name: "Beauty & Haircare",
        slug: "beauty-haircare",
        image:
          "https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimUJtQJaDfRo72PrT4Nl3hJGLySQAeC1KxZdau",
      },
      {
        name: "Accessories",
        slug: "accessories",
        image:
          "https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimG4qR1v0NIjr3OJ7AceQBV6bU0h8fqvodtG91",
      },
      {
        name: "Gifts",
        slug: "gifts",
        image:
          "https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFiml0RjUBrE3xkOM7PvaJScipQ68IDngw4ZGK5h",
      },
      {
        name: "Handmade",
        slug: "handmade",
        image:
          "https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimOzvthzgfckE06btChxl8rjVvPpWNQ2wu5YD4",
      },
      {
        name: "Fragrances",
        slug: "fragrances",
        image:
          "https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimuQPA78d7cPYESaoX4hqvit5nIrRJbOBuDzg3",
      },
      {
        name: "Home & Kitchen",
        slug: "home-kitchen",
        image:
          "https://zdafrb7d2x.ufs.sh/f/aSLZIlWQkFimhZRVe6Qvnb96RaXBYDdPWv37yFwM4pKkIchN",
      },
    ],
  });

  console.log(`Created ${categories.count} categories`);
}
