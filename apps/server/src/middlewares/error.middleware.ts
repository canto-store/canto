import { ErrorRequestHandler } from 'express'
import AppError from '../utils/appError'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from './auth.middleware'

const prisma = new PrismaClient()

const errorMiddleware: ErrorRequestHandler = async (
  err: any,
  req: AuthRequest,
  res,
  _next
) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
  })

  prisma.errorLog
    .create({
      data: {
        message: err.message,
        stack: err.stack ?? 'No stack trace',
        userId: req.user?.id ?? null,
      },
    })
    .catch(dbError => console.error('Failed to log error:', dbError))

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  })
}

export default errorMiddleware
