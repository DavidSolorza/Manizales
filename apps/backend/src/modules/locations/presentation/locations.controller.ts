import { Controller, Get, Query } from '@nestjs/common'
import { GeocodingService } from '../application/services/geocoding.service'

@Controller('locations')
export class LocationsController {
  constructor(private geocoding: GeocodingService) {}

  @Get('reverse-geocode')
  async reverseGeocode(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.geocoding.reverseGeocode(parseFloat(lat), parseFloat(lng))
  }
}
