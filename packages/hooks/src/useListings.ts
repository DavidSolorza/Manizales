import { useState, useEffect, useCallback } from 'react'
import {
  searchListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getPendingListings,
  searchNearby,
} from '@proyecto/api-client'
import type { ListingDTO, CreateListingInput, SearchFilters, NearbyResult } from '@proyecto/api-client'

export function useListings(initialFilters?: SearchFilters) {
  const [listings, setListings] = useState<ListingDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters | undefined>(initialFilters)

  const fetchListings = useCallback(async (f?: SearchFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await searchListings(f)
      setListings(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchListings(filters)
  }, [filters, fetchListings])

  const refetch = useCallback(() => fetchListings(filters), [fetchListings, filters])

  return { listings, isLoading, error, filters, setFilters, refetch }
}

export function useListingDetail(id: string | undefined) {
  const [listing, setListing] = useState<ListingDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    getListingById(id)
      .then(setListing)
      .catch((err) => setError((err as Error).message))
      .finally(() => setIsLoading(false))
  }, [id])

  return { listing, isLoading, error }
}

export function useCreateListing() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = useCallback(async (data: CreateListingInput) => {
    setIsLoading(true)
    setError(null)
    try {
      const listing = await createListing(data)
      return listing
    } catch (err) {
      setError((err as Error).message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { submit, isLoading, error }
}

export function useDeleteListing() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await deleteListing(id)
    } catch (err) {
      setError((err as Error).message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { remove, isLoading, error }
}

export function usePendingListings() {
  const [listings, setListings] = useState<ListingDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getPendingListings()
      setListings(data)
    } catch { /* ignore */ } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { listings, isLoading, refetch: fetch }
}

export function useNearbyListings() {
  const [listings, setListings] = useState<NearbyResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)

  const search = useCallback(async (lat: number, lng: number, radiusKm?: number) => {
    setIsLoading(true)
    setPosition({ lat, lng })
    try {
      const data = await searchNearby(lat, lng, radiusKm)
      setListings(data)
    } catch { /* ignore */ } finally {
      setIsLoading(false)
    }
  }, [])

  const searchMyLocation = useCallback(async (radiusKm?: number) => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => search(pos.coords.latitude, pos.coords.longitude, radiusKm),
      () => {},
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [search])

  const clear = useCallback(() => {
    setListings([])
    setPosition(null)
  }, [])

  return { listings, isLoading, position, search, searchMyLocation, clear }
}
