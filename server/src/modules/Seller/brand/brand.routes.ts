import { Router } from "express";
import BrandController from "./brand.controller";

const router = Router();
const controller = new BrandController();

router.get("/", controller.getAllBrands.bind(controller));
router.get("/:id", controller.getBrandById.bind(controller));
router.post("/", controller.createBrand.bind(controller));
router.put("/:id", controller.updateBrand.bind(controller));
router.delete("/:id", controller.deleteBrand.bind(controller));

export default router;
