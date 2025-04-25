import { PrismaClient } from "@prisma/client";
import { CreateUserDto, LoginDto } from "./auth.types";
import Bcrypt from "../../utils/bcrypt";

 class AuthService {
    private readonly prisma = new PrismaClient();


    async register(dto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        dto.password = await Bcrypt.hash(dto.password);
        const user = await this.prisma.user.create({
            data: dto,
        });
        return {...user, password: undefined};
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: {
                id: true,
                name: true,
                email: true,
                phone_number: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user ;
    }


}

export default AuthService;
