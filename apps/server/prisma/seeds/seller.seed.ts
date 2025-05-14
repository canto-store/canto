import { PrismaClient } from "@prisma/client";

export const name = "seller";
export const description = "Seed for seller";

export async function run(prisma: PrismaClient): Promise<void> {
  const seller = await prisma.seller.create({
    data: {
      name: "Seller",
      email: "omar.soubky@proton.me",
      password: "123456",
      phone_number: "01000000000",
    },
  });
  console.log(`Created seller with id: ${seller.id}`);
}
