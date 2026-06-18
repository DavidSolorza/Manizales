import { Module } from '@nestjs/common'
import { ListingsController } from './presentation/listings.controller'
import { ListingService } from './application/services/listing.service'
import { CreateListingUseCase } from './application/use-cases/create-listing.use-case'
import { PrismaListingRepository } from './infrastructure/prisma-listing.repository'
import { PrismaService } from '../../shared/database/prisma.service'

@Module({
  controllers: [ListingsController],
  providers: [ListingService, CreateListingUseCase, PrismaListingRepository, PrismaService],
})
export class ListingsModule {}
