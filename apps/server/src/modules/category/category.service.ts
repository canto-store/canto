import { PrismaClient } from "@prisma/client";
import { CreateCategoryDto } from "./category.types";
import AppError from "../../utils/appError";

class CategoryService {
  private readonly prisma = new PrismaClient();

  async create(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });
    if (exists)
      throw new AppError("Category with this slug already exists", 409);

    const category = await this.prisma.category.create({ data: dto });
    return category;
  }

  async findAll() {
    return await this.prisma.category.findMany({
      select: { id: true, name: true, image: true, slug: true, aspect: true },
    });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new AppError("Category not found", 404);
    return category;
  }

  async update(id: number, dto: CreateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new AppError("Category not found", 404);

    return await this.prisma.category.update({ where: { id }, data: dto });
  }

  async delete(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new AppError("Category not found", 404);

    return await this.prisma.category.delete({ where: { id } });
  }
}

export default CategoryService;
