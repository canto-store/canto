import { Request, Response, NextFunction } from "express";
import BrandService from "./brand.service";
import { Brand } from "@prisma/client";
import { AuthRequest } from "../../../middlewares/auth.middleware";

class BrandController {
  private brandService: BrandService;

  constructor() {
    this.brandService = new BrandService();
  }

  public getAllBrands = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const brands = await this.brandService.getAllBrands();
      res.status(200).json(brands);
    } catch (error) {
      next(error);
    }
  };

  public getBrandById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const brand = await this.brandService.getBrandById(Number(id));
      res.status(200).json(brand);
    } catch (error) {
      next(error);
    }
  };

  public createBrand = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sellerId = req.user.id;
      const brandData: Omit<
        Brand,
        "sellerId" | "id" | "created_at" | "updated_at"
      > = req.body;
      const newBrand = await this.brandService.createBrand(brandData, sellerId);
      res.status(201).json(newBrand);
    } catch (error) {
      next(error);
    }
  };

  public updateBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const brandData: Brand = req.body;
      const updated = await this.brandService.updateBrand(
        Number(id),
        brandData
      );
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

  public deleteBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const deleted = await this.brandService.deleteBrand(Number(id));
      res.status(200).json({ message: "Brand deleted", brand: deleted });
    } catch (error) {
      next(error);
    }
  };

  public getMyBrand = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const brand = await this.brandService.getMyBrand(userId);
      res.status(200).json(brand);
    } catch (error) {
      next(error);
    }
  };
}

export default BrandController;
