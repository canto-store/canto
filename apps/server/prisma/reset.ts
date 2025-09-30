import { execSync } from 'child_process'
import { PrismaClient } from '@prisma/client'
import { runAllPendingSeeds } from './seeds/index'

const prisma = new PrismaClient()

async function main() {
  console.log('🚨 Resetting database...')

  // reset migrations but don't let Prisma run its own seed
  execSync('npx prisma migrate reset --force --skip-seed', { stdio: 'inherit' })

  console.log('✅ Database reset complete.')

  // run your modular seed runner
  console.log('🌱 Seeding database...')
  await runAllPendingSeeds(prisma)
  console.log('✅ Seeding complete.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
