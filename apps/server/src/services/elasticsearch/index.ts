import { Client, ClientOptions } from '@elastic/elasticsearch'

// --- Configuration from Environment Variables ---
const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE
const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD

// --- Client Configuration Object ---
const clientConfig: ClientOptions = {
  node: ELASTICSEARCH_NODE,
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
}

if (ELASTICSEARCH_USERNAME && ELASTICSEARCH_PASSWORD) {
  clientConfig.auth = {
    username: ELASTICSEARCH_USERNAME,
    password: ELASTICSEARCH_PASSWORD,
  }
}

const esClient: Client = new Client(clientConfig)

async function checkESConnection(): Promise<boolean> {
  try {
    await esClient.cluster.health()
    return true
  } catch (error: any) {
    console.error(
      'Elasticsearch connection error. Please check configuration and ES status.'
    )
    if (error.meta && error.meta.body) {
      console.error('Error details:', error.meta.body)
    } else {
      console.error('Error details:', error)
    }
    return false
  }
}

// --- Export Client and Connection Check ---
export { esClient, checkESConnection }
