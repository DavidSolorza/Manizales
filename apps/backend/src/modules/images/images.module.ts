import { Module } from '@nestjs/common'
import { ImagesController } from './presentation/images.controller'
import { CloudinaryStorageService } from './infrastructure/cloudinary-storage.service'

@Module({
  controllers: [ImagesController],
  providers: [CloudinaryStorageService],
})
export class ImagesModule {}
