import { PrismaClient } from './generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { runAllPendingSeeds, runSpecificSeeds, listSeeds } from './seeds/index'

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

/**
 * Main function to process command line arguments and run seeds
 */
async function main() {
  const prisma = createPrismaClient()

  try {
    const args = process.argv.slice(2)

    if (args.includes('--list')) {
      await listSeeds()
      return
    }

    if (args.includes('--help')) {
      console.log(`
Prisma Seed Manager

Commands:
  --list                   List all available seeds and their status
  --seed [seed1,seed2,...] Run specific seeds by name
  --force                  Force execution even if seed has been run before
  --help                   Show this help message

Examples:
  npx prisma db seed                       # Run all pending seeds
  npx prisma db seed -- --list            # List all seeds and their status
  npx prisma db seed -- --seed product-options,categories  # Run specific seeds
  npx prisma db seed -- --seed categories --force  # Re-run a specific seed
      `)
      return
    }

    const seedIndex = args.findIndex(arg => arg === '--seed')
    if (seedIndex >= 0 && seedIndex < args.length - 1) {
      const seedNames = args[seedIndex + 1].split(',')
      await runSpecificSeeds(prisma, seedNames)
    } else {
      await runAllPendingSeeds(prisma)
    }

    console.log('All seeds completed successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
