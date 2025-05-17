import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import sellerRouter from "../modules/seller/seller.routes";
import brandRoutes from "../modules/seller/brand/brand.routes";
import categoryRoutes from "../modules/category/category.routes";
import productRoutes from "../modules/product/product.routes";
import addressRouter from "../modules/user/address/address.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/seller", sellerRouter);
router.use("/brand", brandRoutes);
router.use("/categories", categoryRoutes);
router.use("/product", productRoutes);
router.use("/address", addressRouter);

export default router;
