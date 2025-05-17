import { Router } from "express";
import AddressController from "./address.controller";

const router = Router();
const addressController = new AddressController();

router.post("/", addressController.create.bind(addressController));
router.get("/", addressController.getAll.bind(addressController));
router.get("/:id", addressController.getOne.bind(addressController));
router.put("/:id", addressController.update.bind(addressController));
router.delete("/:id", addressController.delete.bind(addressController));
router.get("/user/:userId", addressController.getByUserId.bind(addressController));

export default router;
