import morgan from 'morgan'
import { Request, Response } from 'express'
import { getColorStatus } from '../utils/helper'
import { AuthRequest } from './auth.middleware'

/**
 * HTTP request logger middleware
 *
 * Format: :method :url :status in :response-time ms [user:id]
 * Example: GET /api/users 200 in 5.123 ms [user:123]
 */
const logger = morgan((tokens, req: Request, res: Response) => {
  const authReq = req as AuthRequest
  const userId = authReq.user?.id
  const userInfo = userId ? ` [userId:${userId}]` : ''

  return [
    tokens.method(req, res),
    tokens.url(req, res),
    getColorStatus(tokens.status(req, res) ?? ''),
    'in',
    tokens['response-time'](req, res),
    'ms',
    userInfo,
  ].join(' ')
})

export default logger
