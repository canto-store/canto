import { Client, ClientOptions } from '@elastic/elasticsearch'

// --- Configuration from Environment Variables ---
const ELASTICSEARCH_NODE = process.env.ELASTICSEARCH_NODE
const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD

// --- Check if Elasticsearch is configured ---
const isElasticsearchConfigured = (): boolean => {
  return !!ELASTICSEARCH_NODE
}

// --- Client Configuration Object ---
let esClient: Client | null = null

if (isElasticsearchConfigured()) {
  const clientConfig: ClientOptions = {
    node: ELASTICSEARCH_NODE,
    tls: {
      rejectUnauthorized: false,
    },
  }

  if (ELASTICSEARCH_USERNAME && ELASTICSEARCH_PASSWORD) {
    clientConfig.auth = {
      username: ELASTICSEARCH_USERNAME,
      password: ELASTICSEARCH_PASSWORD,
    }
  }

  esClient = new Client(clientConfig)
}

async function checkESConnection(): Promise<boolean> {
  if (!esClient) {
    console.log(
      '⚠️  Elasticsearch not configured (ELASTICSEARCH_NODE not set). Search features will be disabled.'
    )
    return false
  }

  try {
    await esClient.cluster.health()
    return true
  } catch {
    console.log(
      '⚠️  Elasticsearch connection failed. Search features will use database fallback.'
    )
    return false
  }
}

// --- Export Client and Connection Check ---
export { esClient, checkESConnection, isElasticsearchConfigured }
