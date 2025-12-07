import { PrismaClient } from '../generated/prisma/client'
import fs from 'fs'
import path from 'path'

interface SeedModule {
  name: string
  description?: string
  run: (prisma: PrismaClient) => Promise<void>
}

const SEEDS_DIR = path.join(__dirname)

/**
 * Get all available seed files
 */
function getAvailableSeedFiles(): string[] {
  return fs
    .readdirSync(SEEDS_DIR)
    .filter(
      file =>
        (file.endsWith('.seed.ts') || file.endsWith('.seed.js')) &&
        file !== 'index.ts'
    )
}

/**
 * Load a seed module
 */
async function loadSeedModule(seedFile: string): Promise<SeedModule> {
  const fullPath = path.join(SEEDS_DIR, seedFile)
  // Remove extension for import
  const modulePath = fullPath.replace(/\.(ts|js)$/, '')
  return await import(modulePath)
}

/**
 * Run all pending seeds
 */
export async function runAllPendingSeeds(prisma: PrismaClient): Promise<void> {
  const seedFiles = getAvailableSeedFiles()

  for (const seedFile of seedFiles) {
    const seedModule = await loadSeedModule(seedFile)

    console.log(`Running seed '${seedModule.name}'...`)

    try {
      await seedModule.run(prisma)
      console.log(`Seed '${seedModule.name}' completed successfully`)
    } catch (error) {
      console.error(`Error running seed '${seedModule.name}':`, error)
      throw error // Re-throw to stop the process
    }
  }
}

/**
 * Run specific seeds by name
 */
export async function runSpecificSeeds(
  prisma: PrismaClient,
  seedNames: string[]
): Promise<void> {
  const seedFiles = getAvailableSeedFiles()

  for (const seedFile of seedFiles) {
    const seedModule = await loadSeedModule(seedFile)

    if (!seedNames.includes(seedModule.name)) {
      continue
    }

    console.log(`Running seed '${seedModule.name}'...`)

    try {
      await seedModule.run(prisma)
      console.log(`Seed '${seedModule.name}' completed successfully`)
    } catch (error) {
      console.error(`Error running seed '${seedModule.name}':`, error)
      throw error
    }
  }
}

/**
 * List all available seeds and their status
 */
export async function listSeeds(): Promise<void> {
  const seedFiles = getAvailableSeedFiles()

  console.log('\nAvailable Seeds:')
  console.log('-----------------------------------')

  for (const seedFile of seedFiles) {
    try {
      const seedModule = await loadSeedModule(seedFile)

      if (seedModule.description) {
        console.log(`  Description: ${seedModule.description}`)
      }
    } catch (error) {
      console.error(`Failed to load seed module '${seedFile}':`, error)
    }
  }

  console.log('-----------------------------------\n')
}
