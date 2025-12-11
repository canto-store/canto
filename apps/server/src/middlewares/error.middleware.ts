import { ErrorRequestHandler } from 'express'
import { prisma } from '../utils/db'
import AppError from '../utils/appError'
import { AuthRequest } from './auth.middleware'
import { MailService } from '../modules/mail/mail.service'
import { formatDate } from '../utils/helper'
import { ErrorContext } from '../types/error.types'

export class ErrorHandler {
  mailService: MailService
  constructor() {
    this.mailService = new MailService()
    this.handle = this.handle.bind(this)
  }

  handle: ErrorRequestHandler = async (
    err: unknown,
    req: AuthRequest,
    res,
    _next
  ) => {
    const context = this.buildErrorContext(err, req)

    if (!(err instanceof AppError)) {
      this.processError(context)
    }

    return res.status(this.getHttpStatus(err)).json({
      message: err instanceof AppError ? err.message : 'Internal Server Error',
    })
  }

  private buildErrorContext(err: unknown, req: AuthRequest): ErrorContext {
    return {
      error: err,
      service: this.detectService(req),
      timestamp: new Date(),
      userId: req.user?.id ?? null,
      userName: req.user?.name ?? null,
      path: req.originalUrl,
      method: req.method,
    }
  }

  private processError(context: ErrorContext) {
    this.logError(context)
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.NODE_ENV === 'test'
    ) {
      this.mailService.sendErrorEmail(context)
    }
  }

  private getHttpStatus(err: unknown): number {
    return err instanceof AppError ? err.statusCode : 500
  }

  private async logError(ctx: ErrorContext): Promise<void> {
    console.error('Error occurred:', {
      message: ctx.error.message,
      stack: ctx.error.stack,
      timestamp: formatDate(ctx.timestamp),
      service: ctx.service,
    })

    try {
      await prisma.errorLog.create({
        data: {
          message: ctx.error.message,
          stack: ctx.error.stack ?? 'No stack trace',
          userId: ctx.userId,
          path: ctx.path,
          method: ctx.method,
          service: ctx.service,
        },
      })
    } catch (dbErr) {
      console.error('Failed to log error:', dbErr)
    }
  }

  private readonly serviceMap: Record<string, string> = {
    '/v1/auth': 'AuthServiceV1',
    '/v2/auth': 'AuthServiceV2',
    '/seller': 'SellerService',
    '/brand': 'BrandService',
    '/categories': 'CategoryService',
    '/options': 'OptionsService',
    '/product': 'ProductService',
    '/address': 'AddressService',
    '/cart': 'CartService',
    '/orders': 'OrderService',
    '/delivery': 'DeliveryService',
    '/dashboard': 'DashboardService',
    '/balance': 'BalanceService',
    '/sales': 'SalesService',
    '/wishlist': 'WishlistService',
    '/upload': 'UploadService',
    '/home': 'HomeService',
  }

  private detectService(req: AuthRequest): string {
    const path = req.originalUrl

    for (const prefix in this.serviceMap) {
      if (path.startsWith(`/api${prefix}`)) {
        return this.serviceMap[prefix]
      }
    }

    return 'UnknownService'
  }
}
