import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
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
    role: string
  }) {
    const user = await this.prisma.user.findUnique({ where: { id: data.userId } })
    if (!user) throw new NotFoundException('User not found')

    const isStudent = user.role === 'ESTUDIANTE'
    const status = isStudent ? 'pending' : 'active'

    // Proximity check for students
    if (isStudent) {
      const nearby = await this.prisma.listing.findFirst({
        where: {
          status: 'active',
          lat: { gte: data.lat - 0.001, lte: data.lat + 0.001 },
          lng: { gte: data.lng - 0.001, lte: data.lng + 0.001 },
        },
      })
      if (nearby) {
        return { duplicate: true, existingId: nearby.id }
      }
    }

    const listing = await this.prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        type: data.type,
        bedrooms: data.bedrooms,
        status,
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

    return { duplicate: false, listing: this.toDTO(listing) }
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

  async findNearby(lat: number, lng: number, radiusKm = 2) {
    const degrees = radiusKm / 111
    const listings = await this.prisma.listing.findMany({
      where: {
        status: 'active',
        lat: { gte: lat - degrees, lte: lat + degrees },
        lng: { gte: lng - degrees, lte: lng + degrees },
      },
      include: { images: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
    return listings.map((l) => {
      const dist = this.haversine(lat, lng, l.lat, l.lng)
      return { ...this.toDTO(l), distanceKm: Math.round(dist * 100) / 100 }
    }).sort((a, b) => a.distanceKm - b.distanceKm)
  }

  private haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  async findPending() {
    const listings = await this.prisma.listing.findMany({
      where: { status: 'pending' },
      include: { images: { orderBy: { order: 'asc' } }, user: true },
      orderBy: { createdAt: 'desc' },
    })
    return listings.map((l) => ({ ...this.toDTO(l), userName: l.user.name }))
  }

  async approve(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')
    if (listing.status !== 'pending') throw new BadRequestException('Only pending listings can be approved')
    const updated = await this.prisma.listing.update({
      where: { id },
      data: { status: 'active' },
      include: { images: { orderBy: { order: 'asc' } } },
    })
    return this.toDTO(updated)
  }

  async reject(id: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException('Listing not found')
    await this.prisma.listing.delete({ where: { id } })
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
