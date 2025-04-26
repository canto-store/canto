// errorHandler.ts
import { ErrorRequestHandler } from "express";
import AppError from "../utils/appError";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = err as AppError;

  if (error.isOperational) {
    res.status(error.status).json({
      status: "error",
      error: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      error: "Internal Server Error",
    });
  }
};

export default errorHandler;
