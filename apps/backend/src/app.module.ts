import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/auth.module'
import { ListingsModule } from './modules/listings/listings.module'
import { ImagesModule } from './modules/images/images.module'
import { LocationsModule } from './modules/locations/locations.module'
import { UsersModule } from './modules/users/users.module'
import { PrismaService } from './shared/database/prisma.service'

@Module({
  imports: [AuthModule, ListingsModule, ImagesModule, LocationsModule, UsersModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
