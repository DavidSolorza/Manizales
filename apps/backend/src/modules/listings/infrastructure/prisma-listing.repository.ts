import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../shared/database/prisma.service'
import type { IListingRepository, ListingFilters } from '../domain/repositories/listing-repository.interface'

@Injectable()
export class PrismaListingRepository implements IListingRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.listing.create({ data, include: { images: true } })
  }

  async findById(id: string) {
    return this.prisma.listing.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    })
  }

  async findAll(filters?: ListingFilters) {
    const where: any = {}
    if (filters?.type) where.type = filters.type
    if (filters?.neighborhood) where.neighborhood = { contains: filters.neighborhood }
    return this.prisma.listing.findMany({ where, include: { images: true } })
  }

  async update(id: string, data: any) {
    return this.prisma.listing.update({ where: { id }, data })
  }

  async delete(id: string) {
    await this.prisma.listing.delete({ where: { id } })
  }
}
