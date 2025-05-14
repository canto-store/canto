import { Request, Response, NextFunction } from "express";
import { verifyJwt, JwtPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user: JwtPayload;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const payload = verifyJwt(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
}
