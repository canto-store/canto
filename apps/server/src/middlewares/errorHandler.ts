// errorHandler.ts
import { ErrorRequestHandler } from 'express'
import AppError from '../utils/appError'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from './auth.middleware'

const errorHandler: ErrorRequestHandler = async (
  err,
  req: AuthRequest,
  res,
  _next
) => {
  const error = err as AppError
  const prisma = new PrismaClient()

  if (error.isOperational) {
    res.status(error.status).json({
      status: 'error',
      message: error.message,
    })
  } else {
    console.error('Error occurred:', {
      message: error.message,
      stack: error.stack,
    })
    await prisma.errorLog
      .create({
        data: {
          message: error.message,
          stack: error.stack ?? 'No stack trace available',
          userId: req.user?.id ?? null,
        },
      })
      .catch(dbError => {
        console.error('Failed to log error to database:', dbError)
      })
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      details: error.stack || error.message || String(error),
    })
  }
}

export default errorHandler
