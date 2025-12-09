import AppError from '../../utils/appError'

export class UploadValidator {
  validate(file: { name: string; type: string; data: Buffer } | null) {
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
  }
}
