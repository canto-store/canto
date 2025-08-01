import dotenv from 'dotenv'
dotenv.config()

import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import routes from './routes'
import errorHandler from './middlewares/errorHandler'
import loggerMiddleware from './middlewares/logger.middleware'

import { checkESConnection } from './config/elasticsearch'

import rateLimit from 'express-rate-limit'

const app: Express = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

// In production, CORS is handled by nginx
// In development, we use the cors middleware
if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://164.90.234.81:5173',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
      exposedHeaders: ['Set-Cookie'],
    })
  )
}

app.use(loggerMiddleware)
app.use(express.json())
app.use(cookieParser())

app.use('/api', routes)

app.get('/', (_req, res) => {
  res.send('<h1>Server Running</h1>')
})

app.use(errorHandler)

const PORT: number = parseInt(process.env.PORT || '8000', 10)

async function startServer() {
  try {
    const esConnected = await checkESConnection()

    app.listen(PORT, () => {
      console.log(`🔗 Elasticsearch connection: ${esConnected}`)
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start the server:', error)
    process.exit(1)
  }
}

startServer()
