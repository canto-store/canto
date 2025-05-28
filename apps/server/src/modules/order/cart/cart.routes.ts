import { Router } from "express";
import CartController from "./cart.controller";
import AuthMiddleware from "../../../middlewares/auth.middleware";

const router = Router();
const controller = new CartController();
const authMiddleware = new AuthMiddleware();

router.get(
  "/user",
  authMiddleware.checkAuth.bind(authMiddleware),
  controller.getCartByUser.bind(controller)
);

router.put(
  "/user",
  authMiddleware.checkAuth.bind(authMiddleware),
  controller.syncCart.bind(controller)
);

router.delete("/user/:userId", controller.clearCart.bind(controller));

router.post(
  "/items",
  authMiddleware.checkAuth.bind(authMiddleware),
  controller.addItem.bind(controller)
);

router.put(
  "/items",
  authMiddleware.checkAuth.bind(authMiddleware),
  controller.updateItem.bind(controller)
);

router.delete(
  "/items",
  authMiddleware.checkAuth.bind(authMiddleware),
  controller.deleteItem.bind(controller)
);

export default router;
