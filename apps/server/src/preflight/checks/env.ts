import { z } from 'zod'
import { PreflightCheck } from '../preflight'

const envSchema = z.object({
  JWT_SECRET: z.string(),
})

type EnvConfig = z.infer<typeof envSchema>

export class Env {
  static instance: EnvConfig
  static validate() {
    const parsed = envSchema.safeParse(process.env)
    if (parsed.error) {
      console.error('❌ Environment variable validation failed')
      process.exit(1)
    }
    console.log('✅ Environment variables validated successfully')
    this.instance = parsed.data
  }
  static getJWTSecret(): string {
    return this.instance.JWT_SECRET
  }
}

export const envCheck: PreflightCheck = {
  name: 'Environment Variables',
  check: () => {
    Env.validate()
  },
}
