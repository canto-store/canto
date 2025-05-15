import { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service";
import { CreateUserDto, LoginDto } from "./auth.types";
import { signJwt } from "../../utils/jwt";
import { AuthRequest } from "../../middlewares/auth.middleware";

class AuthController {
  private readonly authService = new AuthService();

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: CreateUserDto = req.body;
      const user = await this.authService.register(dto);
      const token = signJwt({
        id: user.id,
        role: user.role,
        firstName: user.name.split(" ")[0],
      });
      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        user.role,
        user.name.split(" ")[0]
      );
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 1000 * 60 * 60,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 3600_000,
        })
        .status(201)
        .json(user);
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: LoginDto = req.body;
      const user = await this.authService.login(dto);
      const token = signJwt({
        id: user.id,
        role: user.role,
        firstName: user.name.split(" ")[0],
      });
      const refreshToken = await this.authService.createRefreshToken(
        user.id,
        user.role,
        user.name.split(" ")[0]
      );
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 1000 * 60 * 60,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 3600_000,
        })
        .status(200)
        .json(user);
    } catch (err) {
      next(err);
    }
  }

  public async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        id: req.user.id,
        role: req.user.role,
        firstName: req.user.firstName,
      });
    } catch (err) {
      next(err);
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const old = req.cookies.refreshToken as string;
      const { accessToken, refreshToken } =
        await this.authService.rotateRefresh(old);
      res
        .cookie("token", accessToken, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 3600_000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 7 * 24 * 3600_000,
        })
        .status(200)
        .json();
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
