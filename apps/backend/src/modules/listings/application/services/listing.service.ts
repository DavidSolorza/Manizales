import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../../../shared/database/prisma.service'
import type { ListingFilters } from '../../domain/repositories/listing-repository.interface'

@Injectable()
export class ListingService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
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
  }) {
    const listing = await this.prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        type: data.type,
        bedrooms: data.bedrooms,
        status: 'active',
        userId: data.userId,
        lat: data.lat,
        lng: data.lng,
        address: data.address,
        neighborhood: data.neighborhood,
        images: {
          create: data.images.map((url, i) => ({ url, order: i })),
        },
      },
      include: { images: { orderBy: { order: 'asc' } } },
    })

    return this.toDTO(listing)
  }

  async findAll(filters?: ListingFilters) {
    const where: any = { status: 'active' }

    if (filters?.query) {
      where.OR = [
        { title: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
      ]
    }
    if (filters?.minPrice !== undefined) where.price = { ...where.price, gte: filters.minPrice }
    if (filters?.maxPrice !== undefined) where.price = { ...where.price, lte: filters.maxPrice }
    if (filters?.type) where.type = filters.type
    if (filters?.bedrooms !== undefined) where.bedrooms = filters.bedrooms
    if (filters?.neighborhood) where.neighborhood = { contains: filters.neighborhood, mode: 'insensitive' }

    const listings = await this.prisma.listing.findMany({
      where,
      include: { images: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })

    return listings.map((l) => this.toDTO(l))
  }

  async findById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } }, user: true },
    })
    if (!listing) throw new NotFoundException('Listing not found')
    return { ...this.toDTO(listing), userName: listing.user.name }
  }

  async update(id: string, data: any, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')
    if (listing.userId !== userId) throw new ForbiddenException('Not your listing')

    const updated = await this.prisma.listing.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        type: data.type,
        bedrooms: data.bedrooms,
        lat: data.lat,
        lng: data.lng,
        address: data.address,
        neighborhood: data.neighborhood,
      },
      include: { images: { orderBy: { order: 'asc' } } },
    })

    return this.toDTO(updated)
  }

  async delete(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')
    if (listing.userId !== userId) throw new ForbiddenException('Not your listing')
    await this.prisma.listing.delete({ where: { id } })
  }

  private toDTO(l: any) {
    return {
      id: l.id,
      title: l.title,
      description: l.description,
      price: l.price,
      type: l.type,
      bedrooms: l.bedrooms,
      status: l.status,
      userId: l.userId,
      images: l.images?.map((i: any) => i.url) || [],
      lat: l.lat,
      lng: l.lng,
      address: l.address,
      neighborhood: l.neighborhood,
      createdAt: l.createdAt,
    }
  }
}
