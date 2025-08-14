import dotenv from 'dotenv'

dotenv.config({ override: true })

import { createProductIndex } from '../src/services/elasticsearch/productIndex'
import { syncProductsToES } from '../src/services/elasticsearch/productSync'
import { checkESConnection } from '../src/services/elasticsearch'

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
