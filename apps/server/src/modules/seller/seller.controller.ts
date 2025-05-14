import sellerService from "./seller.service";

import { Request, Response, NextFunction } from "express";

import { Seller } from "@prisma/client";
import { AuthRequest } from "../../middlewares/auth.middleware";

class SellerController {
  private sellerService: sellerService;

  constructor() {
    this.sellerService = new sellerService();
  }

  public getAllSellers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sellers = await this.sellerService.getAllSellers();
      res.status(200).json(sellers);
    } catch (error) {
      next(error);
    }
  };

  public getSellerById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const seller = await this.sellerService.getSellerById(Number(id));
      res.status(200).json(seller);
    } catch (error) {
      next(error);
    }
  };

  public createSeller = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sellerData: Seller = req.body;
      const { seller, tokens } = await this.sellerService.createSeller(
        sellerData
      );

      res
        .cookie("token", tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 1000 * 60 * 60, // 1 hour
        })
        .cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 3600_000, // 7 days
        })
        .status(201)
        .json(seller);
    } catch (error) {
      next(error);
    }
  };

  public updateSeller = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const sellerData: Seller = req.body;
      const updatedSeller = await this.sellerService.updateSeller(
        Number(id),
        sellerData
      );
      res.status(200).json(updatedSeller);
    } catch (error) {
      next(error);
    }
  };

  public loginSeller = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const { seller, tokens } = await this.sellerService.loginSeller(
        email,
        password
      );

      // Set authentication cookies with correct settings for CORS
      res
        .cookie("token", tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax", // Use 'none' for cross-site requests if needed
          maxAge: 1000 * 60 * 60, // 1 hour
        })
        .cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax", // Use 'none' for cross-site requests if needed
          maxAge: 7 * 24 * 3600_000, // 7 days
        })
        // Set headers for CORS
        .header("Access-Control-Allow-Credentials", "true")
        .status(200)
        .json(seller);
    } catch (error) {
      next(error);
    }
  };
}

export default SellerController;
