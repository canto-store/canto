import { s3Client } from '../../utils/s3'

export class UploadService {
  async upload(
    file: { name: string; type: string; data: Buffer },
    folder: string = 'uploads'
  ) {
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    await s3Client.write(fileName, file.data, {
      type: file.type,
    })

    return `https://${Bun.env.SPACES_BUCKET}.${Bun.env.SPACES_REGION}.cdn.digitaloceanspaces.com/${fileName}`
  }
}
