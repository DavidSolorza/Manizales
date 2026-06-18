import { useEffect, useRef } from 'react'
import * as L from 'leaflet'
import type { ListingDTO } from '@proyecto/api-client'

interface Props {
  listings: ListingDTO[]
  onClick?: (e: { latlng: { lat: number; lng: number } }) => void
  selectedPosition?: [number, number]
}

export default function MapView({ listings, onClick, selectedPosition }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current).setView([4.711, -74.072], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    if (onClick) {
      map.on('click', onClick)
    }

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    listings.forEach((listing) => {
      const color = listing.userId === 'own' ? '#d32f2f' : '#1976d2'
      L.marker([listing.lat, listing.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="background:${color};color:white;padding:4px 8px;border-radius:4px;white-space:nowrap;font-size:12px">$${listing.price.toLocaleString('es-CO')}</div>`,
        }),
      })
        .addTo(map)
        .bindPopup(`<b>${listing.title}</b><br/>$${listing.price.toLocaleString('es-CO')}/mes`)
    })

    if (selectedPosition) {
      L.marker(selectedPosition, {
        icon: L.divIcon({
          className: '',
          html: '<div style="background:#d32f2f;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 4px rgba(0,0,0,0.3)"></div>',
        }),
      }).addTo(map)
    }
  }, [listings, selectedPosition])

  return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
}
