import { S3 } from '@aws-sdk/client-s3'

const s3Client = new S3({
  forcePathStyle: false,
  endpoint: `https://${process.env.SPACES_REGION || 'fra1'}.digitaloceanspaces.com`,
  region: process.env.SPACES_REGION || 'fra1',
  credentials: {
    accessKeyId: process.env.SPACES_KEY || '',
    secretAccessKey: process.env.SPACES_SECRET || '',
  },
})

export { s3Client }
