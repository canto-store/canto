export interface PreflightCheck {
  name: string
  check: () => void | Promise<void>
}

export class PreflightRunner {
  private checks: PreflightCheck[] = []

  register(check: PreflightCheck): void {
    this.checks.push(check)
  }

  async runAll(): Promise<void> {
    for (const check of this.checks) {
      try {
        await check.check()
      } catch (error) {
        console.error(
          `❌ ${check.name} preflight check error: ${error instanceof Error ? error.message : String(error)}`
        )
        process.exit(1)
      }
    }
  }
}
