import { Router } from "express";
import AuthController from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const ctl = new AuthController();

router.post("/register", ctl.register.bind(ctl));
router.post("/login", ctl.login.bind(ctl));
router.get("/me", authMiddleware, ctl.me.bind(ctl));

export default router;
