export interface ListingFilters {
  query?: string
  minPrice?: number
  maxPrice?: number
  type?: string
  bedrooms?: number
  neighborhood?: string
}

export interface IListingRepository {
  create(data: any): Promise<any>
  findById(id: string): Promise<any>
  findAll(filters?: ListingFilters): Promise<any[]>
  update(id: string, data: any): Promise<any>
  delete(id: string): Promise<void>
}
