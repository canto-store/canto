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
  const host = req.headers.host || ''
  const hostInfo = host ? ` [host:${host}]` : ''
  const now = new Date()
  const formattedTime = now.toLocaleString('en-US')

  return [
    formattedTime,
    tokens.method(req, res),
    tokens.url(req, res),
    getColorStatus(tokens.status(req, res) ?? ''),
    'in',
    tokens['response-time'](req, res),
    'ms',
    userInfo,
    hostInfo,
  ].join(' ')
})

export default logger
