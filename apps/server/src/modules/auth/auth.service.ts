import { PrismaClient } from "@prisma/client";
import { CreateUserDto, LoginDto, UserRole } from "./auth.types";
import { signJwt, signRefreshToken, verifyJwt } from "../../utils/jwt";
import Bcrypt from "../../utils/bcrypt";
import AppError from "../../utils/appError";

class AuthService {
  private readonly prisma = new PrismaClient();

  async register(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new AppError("User already exists", 409);

    dto.password = await Bcrypt.hash(dto.password);
    const user = await this.prisma.user.create({ data: dto });
    const { password, ...rest } = user;
    return rest;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new AppError("User not found", 404);

    const valid = await Bcrypt.compare(dto.password, user.password);
    if (!valid) throw new AppError("Invalid credentials", 401);

    const { password, ...rest } = user;
    return rest;
  }

  async getById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
      },
    });
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async createRefreshToken(id: number, role: string, firstName: string) {
    const token = signRefreshToken({ id, role, firstName });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.refreshToken.create({ data: { token, expiresAt } });
    return token;
  }

  async rotateRefresh(oldToken: string) {
    const verifiedUser = verifyJwt<{
      id: number;
      role: string;
      firstName: string;
    }>(oldToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: oldToken },
    });
    if (!stored || stored.isRevoked || stored.expiresAt < new Date())
      throw new AppError("Invalid refresh", 401);
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { isRevoked: true },
    });
    const accessToken = signJwt({
      id: verifiedUser.id,
      role: verifiedUser.role,
      firstName: verifiedUser.firstName,
    });
    const refreshToken = await this.createRefreshToken(
      verifiedUser.id,
      verifiedUser.role,
      verifiedUser.firstName
    );
    const user = await this.prisma.user.findUnique({
      where: { id: verifiedUser.id },
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
    if (!user) throw new AppError("User not found", 404);
    return { accessToken, refreshToken };
  }
}

export default AuthService;
