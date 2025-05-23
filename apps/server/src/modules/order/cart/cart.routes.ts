import { Router } from "express";
import CartController from "./cart.controller";

const router = Router();
const controller = new CartController();

router.get("/user/:userId", controller.getCartByUser.bind(controller));

router.delete("/user/:userId", controller.clearCart.bind(controller));

router.post("/items", controller.addItem.bind(controller));

router.put("/items/:id", controller.updateItem.bind(controller));

router.delete("/items/:id", controller.deleteItem.bind(controller));

export default router;
