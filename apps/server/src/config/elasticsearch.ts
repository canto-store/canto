// src/config/elasticsearch.ts
import { Client, ClientOptions } from "@elastic/elasticsearch";
import { ClusterHealthResponse } from "@elastic/elasticsearch/lib/api/types"; // For specific response types

// --- Configuration from Environment Variables ---
const ELASTICSEARCH_NODE: string = "http://10.114.0.4:9200";
const ELASTICSEARCH_USERNAME = process.env.ELASTICSEARCH_USERNAME;
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

// --- Client Configuration Object ---
let clientConfig: ClientOptions = {
  node: ELASTICSEARCH_NODE,
};

if (ELASTICSEARCH_USERNAME && ELASTICSEARCH_PASSWORD) {
  clientConfig.auth = {
    username: ELASTICSEARCH_USERNAME,
    password: ELASTICSEARCH_PASSWORD,
  };
}

const esClient: Client = new Client(clientConfig);

async function checkESConnection(): Promise<boolean> {
  try {
    console.log("Checking Elasticsearch connection...");
    const health: ClusterHealthResponse = await esClient.cluster.health({});
    console.log(
      "Successfully connected to Elasticsearch cluster:",
      health.cluster_name
    );
    return true;
  } catch (error: any) {
    console.error(
      "Elasticsearch connection error. Please check configuration and ES status."
    );
    if (error.meta && error.meta.body) {
      console.error("Error details:", error.meta.body);
    } else {
      console.error("Error details:", error);
    }
    return false;
  }
}

// --- Export Client and Connection Check ---
export { esClient, checkESConnection };
