import morgan from "morgan";
import { Request, Response } from "express";
import { getColorStatus } from "../utils/helper";

/**
 * HTTP request logger middleware
 *
 * Format: :method :url :status in :response-time ms
 * Example: GET /api/users 200 in 5.123 ms
 */
const logger = morgan((tokens, req: Request, res: Response) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    getColorStatus(tokens.status(req, res) ?? ""),
    "in",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
});

export default logger;
