import { Controller, Post, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard'
import { CloudinaryStorageService } from '../infrastructure/cloudinary-storage.service'

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImagesController {
  constructor(private storage: CloudinaryStorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = await this.storage.upload(file)
    return { url }
  }
}
