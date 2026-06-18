import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ForbiddenException } from '@nestjs/common'
import { ListingService } from '../application/services/listing.service'
import { CreateListingDto } from './dtos/create-listing.dto'
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard'
import { CurrentUser } from '../../../shared/decorators/current-user.decorator'
import { Public } from '../../../shared/decorators/public.decorator'
import type { ListingFilters } from '../domain/repositories/listing-repository.interface'

@Controller('listings')
export class ListingsController {
  constructor(private listingService: ListingService) {}

  @Public()
  @Get()
  async findAll(@Query() filters: ListingFilters) {
    return this.listingService.findAll(filters)
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.listingService.findById(id)
  }

  @Public()
  @Get('nearby')
  async findNearby(@Query('lat') lat: string, @Query('lng') lng: string, @Query('radius') radius?: string) {
    return this.listingService.findNearby(parseFloat(lat), parseFloat(lng), radius ? parseFloat(radius) : 2)
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/pending')
  async findPending() {
    return this.listingService.findPending()
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateListingDto, @CurrentUser() user: any) {
    return this.listingService.create({ ...dto, userId: user.id, role: user.role })
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateListingDto>, @CurrentUser('id') userId: string) {
    return this.listingService.update(id, dto, userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/approve')
  async approve(@Param('id') id: string, @CurrentUser() user: any) {
    if (user.role !== 'SUPER_ADMIN') throw new ForbiddenException('Only super admin can approve')
    return this.listingService.approve(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/reject')
  async reject(@Param('id') id: string, @CurrentUser() user: any) {
    if (user.role !== 'SUPER_ADMIN') throw new ForbiddenException('Only super admin can reject')
    await this.listingService.reject(id)
    return { message: 'Rejected' }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.listingService.delete(id, userId)
    return { message: 'Deleted' }
  }
}
