import { Router } from "express";
import BrandController from "./brand.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new BrandController();

router.get("/", controller.getAllBrands.bind(controller));
router.get("/my-brand", authMiddleware, controller.getMyBrand.bind(controller));
router.get("/:id", controller.getBrandById.bind(controller));
router.post("/", authMiddleware, controller.createBrand.bind(controller));
router.put("/:id", controller.updateBrand.bind(controller));
router.delete("/:id", controller.deleteBrand.bind(controller));

export default router;
