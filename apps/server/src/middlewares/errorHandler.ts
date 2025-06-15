// errorHandler.ts
import { ErrorRequestHandler } from 'express'
import AppError from '../utils/appError'

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const error = err as AppError

  if (error.isOperational) {
    res.status(error.status).json({
      status: 'error',
      message: error.message,
    })
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      details: error.stack || error.message || String(error),
    })
  }
}

export default errorHandler
