import { PrismaClient, Brand } from "@prisma/client";
import AppError from "../../../utils/appError";

class BrandService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllBrands() {
    return await this.prisma.brand.findMany({
      select:{
        name:true,
        slug:true,
      }
    });
  }

  async getBrandById(id: number): Promise<Brand> {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });
    if (!brand) {
      throw new AppError("Brand not found", 404);
    }
    return brand;
  }

  async createBrand(data: Brand): Promise<Brand> {
    const existing = await this.prisma.brand.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new AppError("Brand with this email already exists", 400);
    }
    const existingSeller = await this.prisma.seller.findUnique({
      where: { id: data.sellerId },
    });
    if (!existingSeller) {
      throw new AppError("Seller not found", 404);
    }

    return await this.prisma.brand.create({
      data,
    });
  }

  async updateBrand(id: number, data: Brand): Promise<Brand> {
    const existing = await this.prisma.brand.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Brand not found", 404);
    }
    if (data.email && data.email !== existing.email) {
      const emailTaken = await this.prisma.brand.findUnique({
        where: { email: data.email },
      });
      if (emailTaken) {
        throw new AppError("Email is already in use by another brand", 400);
      }
    }
    return await this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async deleteBrand(id: number): Promise<Brand> {
    const existing = await this.prisma.brand.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new AppError("Brand not found", 404);
    }
    return await this.prisma.brand.delete({
      where: { id },
    });
  }
}

export default BrandService;
