# Prisma Seed Manager Documentation

This document describes how to use the version-controlled seed system in our project.

## Overview

Our seed system allows us to:

- Track which seeds have been run
- Run specific seeds by name
- List all available seeds and their status
- Force re-run of specific seeds when needed

Seeds are stored in the `prisma/seeds` directory and follow a specific format.

## How It Works

Seed execution history is tracked in `.seed-history.json` in the prisma directory. This file contains information about which seeds have been run, when, and a description of what they do.

## Command Line Usage

### Running all pending seeds

```bash
npx prisma db seed
```

This will run all seeds that haven't been executed yet.

### Listing all seeds and their status

```bash
npx prisma db seed -- --list
```

This shows all available seeds and whether they have been executed.

### Running specific seeds

```bash
npx prisma db seed -- --seed seed-name
```

For multiple seeds, use a comma-separated list:

```bash
npx prisma db seed -- --seed seed1,seed2,seed3
```

### Force running seeds (even if already executed)

```bash
npx prisma db seed -- --seed seed-name --force
```

## Creating a New Seed

1. Create a new file in the `prisma/seeds` directory with the naming convention `your-seed-name.seed.ts`

2. Use the following template:

```typescript
import { PrismaClient } from '@prisma/client'

export const name = 'your-seed-name'
export const description = 'Description of what this seed does'

export async function run(prisma: PrismaClient): Promise<void> {
  // Your seeding logic here

  console.log('Your seed completed!')
}
```

The `name` must be unique as it is used to track whether the seed has been executed.

## Seed Dependencies

If your seed depends on data from another seed, you should check for that data's existence and either:

1. Inform the user to run the dependency first:

```typescript
const data = await prisma.someModel.findFirst()
if (!data) {
  console.log('Required data not found. Run the dependency-seed first.')
  return
}
```

2. Or create the dependency data inline if it makes sense for your use case.

## Best Practices

1. **Keep seeds idempotent** - They should be safe to run multiple times
2. **Use descriptive names and descriptions** - This helps track what each seed does
3. **Handle dependencies clearly** - Check for required data and give clear error messages
4. **Use transactions** - For complex seeds to ensure data integrity
5. **Commit the .seed-history.json file** - This helps track seed execution across environments

## Resetting Seeds

To reset a seed's execution history, you can:

1. Delete the entry from `.seed-history.json`
2. Run the seed again

This is useful during development if you need to modify a seed and re-run it.
