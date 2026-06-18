import { useEffect, useRef } from 'react'
import * as L from 'leaflet'
import type { ListingDTO } from '@proyecto/api-client'

const MANIZALES: [number, number] = [5.07, -75.52]

interface Props {
  listings: ListingDTO[]
  onClick?: (e: { latlng: { lat: number; lng: number } }) => void
  selectedPosition?: [number, number]
  hoveredId?: string | null
  onPinClick?: (id: string) => void
}

function priceToColor(price: number, minP: number, maxP: number): string {
  if (maxP === minP) return '#2F5233'
  const t = (price - minP) / (maxP - minP)
  const r = Math.round(47 + (242 - 47) * t)
  const g = Math.round(82 + (169 - 82) * t)
  const b = Math.round(51 + (59 - 51) * t)
  return `rgb(${r},${g},${b})`
}

function houseIcon(color: string, highlighted = false) {
  const size = highlighted ? 36 : 28
  return L.divIcon({
    className: '',
    html: `<svg viewBox="0 0 24 28" width="${size}" height="${size * 28 / 24}" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 10v16h8v-8h4v8h8V10L12 2z" fill="${color}" stroke="${highlighted ? '#fff' : 'rgba(0,0,0,0.2)'}" stroke-width="${highlighted ? 2 : 1}"/>
    </svg>`,
    iconSize: [size, size * 28 / 24],
    iconAnchor: [size / 2, size * 28 / 24],
  })
}

const userLocationIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative">
    <div style="width:18px;height:18px;background:#2F5233;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>
    <div style="position:absolute;top:-6px;left:-6px;width:30px;height:30px;background:rgba(47,82,51,0.2);border-radius:50%;animation:pulse 2s infinite"></div>
    <style>@keyframes pulse{0%{transform:scale(0.8);opacity:1}to{transform:scale(2);opacity:0}}</style>
  </div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

export default function MapView({ listings, onClick, selectedPosition, hoveredId, onPinClick }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markerLayer = useRef<L.LayerGroup | null>(null)
  const markerMap = useRef<Map<string, L.Marker>>(new Map())
  const userMarkerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: MANIZALES,
      zoom: 13,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(map)

    if (onClick) map.on('click', onClick)

    const layer = L.layerGroup().addTo(map)
    markerLayer.current = layer
    mapInstance.current = map

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          map.setView([latitude, longitude], 14)
          const marker = L.marker([latitude, longitude], { icon: userLocationIcon })
            .bindPopup('Tu ubicación')
            .addTo(map)
          userMarkerRef.current = marker
        },
        () => { /* fallback to Manizales default */ },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      )
    }

    setTimeout(() => map.invalidateSize(), 200)

    return () => {
      map.remove()
      mapInstance.current = null
      markerLayer.current = null
      markerMap.current.clear()
      userMarkerRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const layer = markerLayer.current
    const map = mapInstance.current
    if (!layer || !map) return

    layer.clearLayers()
    markerMap.current.clear()

    const prices = listings.map((l) => l.price)
    const minP = Math.min(...prices)
    const maxP = Math.max(...prices)

    listings.forEach((listing) => {
      const color = priceToColor(listing.price, minP, maxP)
      const marker = L.marker([listing.lat, listing.lng], { icon: houseIcon(color) })
        .bindPopup(`
          <b>${listing.title}</b><br/>
          <span style="font-family:'IBM Plex Mono',monospace;color:#E1483E;font-weight:600;">
            $${listing.price.toLocaleString('es-CO')}/mes
          </span>
        `)

      if (onPinClick) marker.on('click', () => onPinClick(listing.id))

      marker.addTo(layer)
      markerMap.current.set(listing.id, marker)
    })

    if (listings.length > 0) {
      const bounds = L.latLngBounds(listings.map((l) => [l.lat, l.lng] as [number, number]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
    }
  }, [listings]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hoveredId) return
    const marker = markerMap.current.get(hoveredId)
    if (marker) marker.setZIndexOffset(1000)
  }, [hoveredId])

  useEffect(() => {
    const layer = markerLayer.current
    if (!layer || !selectedPosition) return
    L.marker(selectedPosition, {
      icon: L.divIcon({
        className: '',
        html: '<div style="width:20px;height:20px;background:#E1483E;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    }).addTo(layer)
  }, [selectedPosition])

  return <div ref={mapRef} className="w-full h-full min-h-[400px]" />
}
