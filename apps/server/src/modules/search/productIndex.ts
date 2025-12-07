import { esClient, isElasticsearchConfigured } from '.'

const PRODUCT_INDEX = 'products'

export const createProductIndex = async () => {
  if (!isElasticsearchConfigured() || !esClient) {
    console.log('⚠️  Elasticsearch not configured. Skipping index creation.')
    return
  }

  try {
    const indexExists = await esClient.indices.exists({ index: PRODUCT_INDEX })

    if (!indexExists) {
      await esClient.indices.create({
        index: PRODUCT_INDEX,
        settings: {
          analysis: {
            analyzer: {
              ngram_analyzer: {
                type: 'custom',
                tokenizer: 'ngram_tokenizer',
                filter: ['lowercase'],
              },
            },
            normalizer: {
              lowercase: {
                type: 'custom',
                filter: ['lowercase'],
              },
            },
            tokenizer: {
              ngram_tokenizer: {
                type: 'edge_ngram',
                min_gram: 2,
                max_gram: 10,
                token_chars: ['letter', 'digit'],
              },
            },
          },
        },
        mappings: {
          properties: {
            id: { type: 'integer' },
            name: {
              type: 'text',
              analyzer: 'standard',
              fields: {
                exact: {
                  type: 'keyword',
                  normalizer: 'lowercase',
                },
                ngram: {
                  type: 'text',
                  analyzer: 'ngram_analyzer',
                },
              },
            },
            description: {
              type: 'text',
              analyzer: 'standard',
            },
          },
        },
      })
      console.log(`Index ${PRODUCT_INDEX} created successfully`)
    }
  } catch (error) {
    console.error('Error creating product index:', error)
    throw error
  }
}

export { PRODUCT_INDEX }
