import dotenv from 'dotenv'

dotenv.config({ override: true })

import { createProductIndex } from '../src/modules/search/productIndex'
import { syncProductsToES } from '../src/modules/search/productSync'
import { checkESConnection } from '../src/modules/search'

async function setup() {
  console.log('Starting setup...')
  const connected = await checkESConnection()
  if (!connected) {
    console.error('Failed to connect to Elasticsearch')
    process.exit(1)
  }

  await createProductIndex()
  await syncProductsToES()

  console.log('Setup complete!')
}

setup()
