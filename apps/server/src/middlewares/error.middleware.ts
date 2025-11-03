import { ErrorRequestHandler } from 'express'
import AppError from '../utils/appError'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from './auth.middleware'

const errorMiddleware: ErrorRequestHandler = async (
  error: AppError,
  req: AuthRequest,
  res,
  _next
) => {
  const prisma = new PrismaClient()

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

export default errorMiddleware
