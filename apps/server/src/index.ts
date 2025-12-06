import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import routes from './routes'
import { ErrorHandler } from './middlewares/error.middleware'
import loggerMiddleware from './middlewares/logger.middleware'

import { checkESConnection } from './modules/search'

const app: Express = express()

const prodOrigins = [
  'https://canto-store.com',
  'https://www.canto-store.com',
  'https://dashboard.canto-store.com',
]

const stagingOrigins = [
  'https://staging.canto-store.com',
  'https://dashboard-staging.canto-store.com',
]

const devOrigins = [
  'http://localhost:5000',
  'http://localhost:5173',
  'https://localhost:3000',
]

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? prodOrigins
        : process.env.NODE_ENV === 'test'
          ? stagingOrigins
          : devOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
  })
)

app.use(loggerMiddleware)
app.use(express.json())
app.use(cookieParser())

app.use('/api', routes)

app.get('/', (_req, res) => {
  res.send('<h1>Server Running</h1>')
})
const errorMiddleware = new ErrorHandler().handle

app.use(errorMiddleware)

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
// Start the server
startServer()
