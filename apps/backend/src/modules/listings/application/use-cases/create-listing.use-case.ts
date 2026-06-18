import { Injectable } from '@nestjs/common'
import { ListingService } from '../services/listing.service'

@Injectable()
export class CreateListingUseCase {
  constructor(private listingService: ListingService) {}

  async execute(data: {
    title: string
    description: string
    price: number
    type: string
    bedrooms: number
    images: string[]
    lat: number
    lng: number
    address: string
    neighborhood: string
    userId: string
    role: string
  }) {
    if (data.price <= 0) throw new Error('Price must be greater than zero')
    if (!data.images || data.images.length === 0) throw new Error('At least one image is required')
    if (!data.title.trim()) throw new Error('Title is required')
    if (!data.description.trim()) throw new Error('Description is required')

    return this.listingService.create(data)
  }
}
