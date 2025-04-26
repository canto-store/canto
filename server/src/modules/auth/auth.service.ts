import { PrismaClient } from "@prisma/client";
import { CreateUserDto, LoginDto, UserRole } from "./auth.types";
import Bcrypt from "../../utils/bcrypt";

class AuthService {
  private readonly prisma = new PrismaClient();

  async register(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new Error("User already exists");

    dto.password = await Bcrypt.hash(dto.password);
    const user = await this.prisma.user.create({ data: dto });
    const { password, ...rest } = user;
    return rest;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new Error("User not found");

    const valid = await Bcrypt.compare(dto.password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const { password, ...rest } = user;
    return rest;
  }

  async getById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  }
}

export default AuthService;
