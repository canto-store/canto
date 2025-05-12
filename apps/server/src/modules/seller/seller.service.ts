import { PrismaClient, Seller } from "@prisma/client";
import AppError from "../../utils/appError";
import Bcrypt from "../../utils/bcrypt";


class SellerService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllSellers() {
    return await this.prisma.seller.findMany({

    });
  }

  async getSellerById(id: number) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
    });
    if (!seller) {
      throw new AppError("Seller not found", 404);
    }
    return seller;
  }

  async createSeller(data: Seller) {
    const existingSeller = await this.prisma.seller.findUnique({
        where: { email: data.email },
        });
    if (existingSeller) {
        throw new AppError('Seller with this email already exists',400);
    }
    data.password = await Bcrypt.hash(data.password);

    const seller = await this.prisma.seller.create({
        data,
    });

    return {...seller, password: undefined }; 
  }

  async updateSeller(id: number, data: Seller) {
    const existingSeller = await this.prisma.seller.findUnique({
      where: { id },
    });
    if (!existingSeller) {
      throw new AppError('Seller not found',404);
    }

    return await this.prisma.seller.update({
      where: { id },
      data,
    });
  }
}

export default SellerService;