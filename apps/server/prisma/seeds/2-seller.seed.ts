import { PrismaClient } from "@prisma/client";
import Bcrypt from "../../src/utils/bcrypt";

export const name = "seller";
export const description = "Seed for seller";

export async function run(prisma: PrismaClient): Promise<void> {
  const encryptedPassword = await Bcrypt.hash("123456");
  const seller = await prisma.seller.create({
    data: {
      name: "Seller",
      email: "omar.soubky@proton.me",
      password: encryptedPassword,
      phone_number: "01000000000",
    },
  });
  console.log(`Created seller with id: ${seller.id}`);
}
