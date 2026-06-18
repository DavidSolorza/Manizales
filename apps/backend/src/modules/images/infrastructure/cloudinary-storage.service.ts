import { Injectable } from '@nestjs/common'
import { v2 as cloudinary } from 'cloudinary'
import type { IImageStorageService } from '../domain/repositories/image-storage.interface'

@Injectable()
export class CloudinaryStorageService implements IImageStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  }

  async upload(file: { buffer: Buffer; originalname: string }): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'arriendos' },
        (err, result) => {
          if (err) reject(err)
          else resolve(result!.secure_url)
        },
      )
      stream.end(file.buffer)
    })
  }

  async delete(url: string): Promise<void> {
    const parts = url.split('/')
    const filename = parts[parts.length - 1]
    const publicId = `arriendos/${filename.split('.')[0]}`
    await cloudinary.uploader.destroy(publicId)
  }
}
