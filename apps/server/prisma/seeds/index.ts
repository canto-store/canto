import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

interface SeedModule {
  name: string
  description?: string
  run: (prisma: PrismaClient) => Promise<void>
}

interface SeedRecord {
  name: string
  executedAt: string
  description?: string
}

const SEEDS_DIR = path.join(__dirname)
const SEED_TRACKER_FILE = path.join(__dirname, '../.seed-history.json')

/**
 * Get all executed seeds from the tracker file
 */
function getExecutedSeeds(): SeedRecord[] {
  try {
    if (!fs.existsSync(SEED_TRACKER_FILE)) {
      return []
    }

    const content = fs.readFileSync(SEED_TRACKER_FILE, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.warn('Failed to read seed tracker file:', error)
    return []
  }
}

/**
 * Save executed seeds to the tracker file
 */
function saveExecutedSeeds(seeds: SeedRecord[]): void {
  try {
    fs.writeFileSync(SEED_TRACKER_FILE, JSON.stringify(seeds, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write seed tracker file:', error)
    throw error
  }
}

/**
 * Check if a seed has already been executed
 */
function hasSeedRun(seedName: string): boolean {
  const executedSeeds = getExecutedSeeds()
  return executedSeeds.some(seed => seed.name === seedName)
}

/**
 * Mark a seed as executed
 */
function markSeedAsExecuted(seedName: string, description?: string): void {
  const executedSeeds = getExecutedSeeds()

  // Check if already marked to avoid duplicates
  if (!hasSeedRun(seedName)) {
    executedSeeds.push({
      name: seedName,
      executedAt: new Date().toISOString(),
      description,
    })

    saveExecutedSeeds(executedSeeds)
  }

  console.log(`Marked seed '${seedName}' as executed`)
}

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

    if (hasSeedRun(seedModule.name)) {
      console.log(`Seed '${seedModule.name}' already executed, skipping...`)
      continue
    }

    console.log(`Running seed '${seedModule.name}'...`)

    try {
      await seedModule.run(prisma)
      markSeedAsExecuted(seedModule.name, seedModule.description)
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
  seedNames: string[],
  force = false
): Promise<void> {
  const seedFiles = getAvailableSeedFiles()

  for (const seedFile of seedFiles) {
    const seedModule = await loadSeedModule(seedFile)

    if (!seedNames.includes(seedModule.name)) {
      continue
    }

    if (!force && hasSeedRun(seedModule.name)) {
      console.log(
        `Seed '${seedModule.name}' already executed, skipping... (use --force to override)`
      )
      continue
    }

    console.log(`Running seed '${seedModule.name}'...`)

    try {
      await seedModule.run(prisma)

      if (!hasSeedRun(seedModule.name)) {
        markSeedAsExecuted(seedModule.name, seedModule.description)
      }

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
  const executedSeeds = getExecutedSeeds()
  const executedSeedsMap = new Map(executedSeeds.map(seed => [seed.name, seed]))

  console.log('\nAvailable Seeds:')
  console.log('-----------------------------------')

  for (const seedFile of seedFiles) {
    try {
      const seedModule = await loadSeedModule(seedFile)
      const executed = executedSeedsMap.has(seedModule.name)
      const executedAt = executed
        ? executedSeedsMap.get(seedModule.name)?.executedAt
        : null

      console.log(
        `${seedModule.name} - ${executed ? '✅ Executed' : '❌ Pending'}${
          executed ? ` (${executedAt})` : ''
        }`
      )
      if (seedModule.description) {
        console.log(`  Description: ${seedModule.description}`)
      }
    } catch (error) {
      console.error(`Failed to load seed module '${seedFile}':`, error)
    }
  }

  console.log('-----------------------------------\n')
}
