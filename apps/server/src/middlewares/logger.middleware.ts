import morgan from 'morgan'
import { Request, Response } from 'express'
import { getColorStatus } from '../utils/helper'

/**
 * HTTP request logger middleware
 *
 * Format: :method :url :status in :response-time ms [user:id]
 * Example: GET /api/users 200 in 5.123 ms [user:123]
 */
const logger = morgan((tokens, req: Request, res: Response) => {
  const now = new Date()
  const formattedTime = now.toLocaleString('en-US')

  if (tokens.method(req, res) === 'HEAD') {
    return
  }

  return [
    formattedTime,
    tokens.method(req, res),
    tokens.url(req, res),
    getColorStatus(tokens.status(req, res) ?? ''),
    'in',
    tokens['response-time'](req, res),
    'ms',
  ].join(' ')
})

export default logger
