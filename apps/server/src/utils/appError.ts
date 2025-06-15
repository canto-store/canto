export default class AppError extends Error {
  public status: number
  public isOperational: boolean
  constructor(message: string, status: number, isOperational: boolean = true) {
    super(message)
    this.status = status
    this.isOperational = isOperational
    Error.captureStackTrace(this)
  }
}
