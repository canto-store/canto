import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret";
const JWT_EXPIRES_IN = "1h";

export interface JwtPayload {
    userId: number;
    role?: string;
  }
export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
}

export function verifyJwt<T = JwtPayload>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T;
}
