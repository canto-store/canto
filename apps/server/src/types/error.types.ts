export type ErrorContext = {
  error: any
  service: string
  timestamp: Date
  userId: number | null
  userName: string | null
  path: string
  method: string
}
