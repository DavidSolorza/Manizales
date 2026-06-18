import { Module } from '@nestjs/common'
import { LocationsController } from './presentation/locations.controller'
import { GeocodingService } from './application/services/geocoding.service'

@Module({
  controllers: [LocationsController],
  providers: [GeocodingService],
})
export class LocationsModule {}
