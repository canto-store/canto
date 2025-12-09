import { S3Client } from 'bun'

const s3Client = new S3Client({
  endpoint: `https://${Bun.env.SPACES_REGION || 'fra1'}.digitaloceanspaces.com`,
  region: Bun.env.SPACES_REGION || 'fra1',
  accessKeyId: Bun.env.SPACES_KEY || '',
  secretAccessKey: Bun.env.SPACES_SECRET || '',
  bucket: Bun.env.SPACES_BUCKET || 'canto-storage',
})

export { s3Client }
