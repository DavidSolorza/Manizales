import { apiRequest } from './http-client'

export interface ListingDTO {
  id: string
  title: string
  description: string
  price: number
  type: string
  bedrooms: number
  status: 'active' | 'inactive' | 'rented'
  userId: string
  images: string[]
  lat: number
  lng: number
  address: string
  neighborhood: string
  createdAt: string
}

export interface CreateListingInput {
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
}

export interface SearchFilters {
  query?: string
  minPrice?: number
  maxPrice?: number
  type?: string
  bedrooms?: number
  neighborhood?: string
}

export async function createListing(data: CreateListingInput): Promise<ListingDTO> {
  return apiRequest<ListingDTO>('/listings', {
    method: 'POST',
    body: data,
  })
}

export async function searchListings(filters?: SearchFilters): Promise<ListingDTO[]> {
  const params = new URLSearchParams()
  if (filters?.query) params.set('query', filters.query)
  if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters?.type) params.set('type', filters.type)
  if (filters?.bedrooms !== undefined) params.set('bedrooms', String(filters.bedrooms))
  if (filters?.neighborhood) params.set('neighborhood', filters.neighborhood)

  const qs = params.toString()
  return apiRequest<ListingDTO[]>(`/listings${qs ? `?${qs}` : ''}`)
}

export async function getListingById(id: string): Promise<ListingDTO> {
  return apiRequest<ListingDTO>(`/listings/${id}`)
}

export async function updateListing(id: string, data: Partial<CreateListingInput>): Promise<ListingDTO> {
  return apiRequest<ListingDTO>(`/listings/${id}`, {
    method: 'PATCH',
    body: data,
  })
}

export async function deleteListing(id: string): Promise<void> {
  return apiRequest<void>(`/listings/${id}`, { method: 'DELETE' })
}

export async function getPendingListings(): Promise<ListingDTO[]> {
  return apiRequest<ListingDTO[]>('/listings/admin/pending')
}

export async function approveListing(id: string): Promise<ListingDTO> {
  return apiRequest<ListingDTO>(`/listings/${id}/approve`, { method: 'PATCH' })
}

export async function rejectListing(id: string): Promise<void> {
  return apiRequest<void>(`/listings/${id}/reject`, { method: 'PATCH' })
}

export interface NearbyResult extends ListingDTO {
  distanceKm: number
}

export async function searchNearby(lat: number, lng: number, radiusKm?: number): Promise<NearbyResult[]> {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng) })
  if (radiusKm) params.set('radius', String(radiusKm))
  return apiRequest<NearbyResult[]>(`/listings/nearby?${params}`)
}
