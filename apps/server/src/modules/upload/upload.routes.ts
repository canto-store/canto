import { Router, Request, Response } from 'express'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { s3Client } from '../../utils/s3'
import AuthMiddleware from '../../middlewares/auth.middleware'
import { UserRole } from '../../utils/db'
import { catchAsync } from '../../utils/catchAsync'
import AppError from '../../utils/appError'

const router = Router()
const authMiddleware = new AuthMiddleware()

router.post(
  '/',
  authMiddleware.checkAuth.bind(authMiddleware),
  authMiddleware.checkRole(UserRole.ADMIN),
  catchAsync(async (req: Request, res: Response) => {
    const contentType = req.headers['content-type'] || ''

    if (!contentType.includes('multipart/form-data')) {
      throw new AppError('Content-Type must be multipart/form-data', 400)
    }

    // For multipart form data, we need to parse the body
    // Bun/Express doesn't parse multipart by default, so we handle it manually
    const chunks: Buffer[] = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    // Parse multipart boundary
    const boundary = contentType.split('boundary=')[1]
    if (!boundary) {
      throw new AppError('No boundary found in Content-Type', 400)
    }

    // Simple multipart parser
    const boundaryBuffer = Buffer.from(`--${boundary}`)
    const parts = []
    let start = buffer.indexOf(boundaryBuffer) + boundaryBuffer.length + 2 // skip \r\n

    while (true) {
      const end = buffer.indexOf(boundaryBuffer, start)
      if (end === -1) break

      const part = buffer.slice(start, end - 2) // -2 for \r\n before boundary
      parts.push(part)
      start = end + boundaryBuffer.length + 2
    }

    let file: { name: string; type: string; data: Buffer } | null = null

    for (const part of parts) {
      const headerEnd = part.indexOf('\r\n\r\n')
      if (headerEnd === -1) continue

      const headers = part.slice(0, headerEnd).toString()
      const data = part.slice(headerEnd + 4)

      if (headers.includes('name="file"')) {
        const filenameMatch = headers.match(/filename="([^"]+)"/)
        const contentTypeMatch = headers.match(/Content-Type: (.+)/i)

        if (filenameMatch) {
          file = {
            name: filenameMatch[1],
            type: contentTypeMatch
              ? contentTypeMatch[1].trim()
              : 'application/octet-stream',
            data,
          }
        }
      }
    }

    if (!file) {
      throw new AppError('No file provided', 400)
    }

    // Check file size (4MB limit)
    if (file.data.length > 4 * 1024 * 1024) {
      throw new AppError('File size exceeds 4MB limit', 400)
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      throw new AppError('Invalid file type. Allowed: JPG, PNG, WebP, GIF', 400)
    }

    const fileName = `category-images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const bucketName = process.env.SPACES_BUCKET || 'canto-storage'
    const region = process.env.SPACES_REGION || 'fra1'

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file.data,
      ContentType: file.type,
      ACL: 'public-read',
    })

    await s3Client.send(command)

    const fileUrl = `https://${bucketName}.${region}.digitaloceanspaces.com/${fileName}`
    res.status(200).json({ success: true, fileUrl })
  })
)

export default router
