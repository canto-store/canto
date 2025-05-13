import morgan from "morgan";
import { Request, Response, NextFunction } from "express";

/**
 * HTTP request logger middleware
 *
 * Format: :method :url :status :response-time ms - :res[content-length]
 * Example: GET /api/users 200 5.123 ms - 1024
 */
const logger = morgan((tokens, req: Request, res: Response) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});

export default logger;
