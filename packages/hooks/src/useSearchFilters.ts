import { useState, useCallback } from 'react'
import type { SearchFilters } from '@proyecto/api-client'

export function useSearchFilters(initial?: SearchFilters) {
  const [filters, setFilters] = useState<SearchFilters>(initial || {})

  const setQuery = useCallback((query: string) => {
    setFilters((prev: SearchFilters) => ({ ...prev, query: query || undefined }))
  }, [])

  const setPriceRange = useCallback((min?: number, max?: number) => {
    setFilters((prev: SearchFilters) => ({ ...prev, minPrice: min, maxPrice: max }))
  }, [])

  const setType = useCallback((type: string | undefined) => {
    setFilters((prev: SearchFilters) => ({ ...prev, type }))
  }, [])

  const setBedrooms = useCallback((bedrooms: number | undefined) => {
    setFilters((prev: SearchFilters) => ({ ...prev, bedrooms }))
  }, [])

  const setNeighborhood = useCallback((neighborhood: string | undefined) => {
    setFilters((prev: SearchFilters) => ({ ...prev, neighborhood }))
  }, [])

  const reset = useCallback(() => {
    setFilters({})
  }, [])

  return { filters, setQuery, setPriceRange, setType, setBedrooms, setNeighborhood, reset }
}
