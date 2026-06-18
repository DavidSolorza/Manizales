import { useEffect, useRef } from 'react'
import * as L from 'leaflet'
import type { ListingDTO } from '@proyecto/api-client'

interface Props {
  listings: ListingDTO[]
  onClick?: (e: { latlng: { lat: number; lng: number } }) => void
  selectedPosition?: [number, number]
}

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function MapView({ listings, onClick, selectedPosition }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markerLayer = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: [4.711, -74.072],
      zoom: 13,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    if (onClick) {
      map.on('click', onClick)
    }

    const layer = L.layerGroup().addTo(map)
    markerLayer.current = layer
    mapInstance.current = map

    setTimeout(() => map.invalidateSize(), 200)

    return () => {
      map.remove()
      mapInstance.current = null
      markerLayer.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const layer = markerLayer.current
    if (!layer) return
    layer.clearLayers()

    listings.forEach((listing) => {
      const marker = L.marker([listing.lat, listing.lng], { icon: defaultIcon })
        .bindPopup(`
          <b>${listing.title}</b><br/>
          $${listing.price.toLocaleString('es-CO')}/mes
        `)
      layer.addLayer(marker)
    })
  }, [listings])

  useEffect(() => {
    const map = mapInstance.current
    const layer = markerLayer.current
    if (!map || !layer) return

    if (selectedPosition) {
      layer.clearLayers()
      L.marker(selectedPosition, { icon: defaultIcon }).addTo(layer)
      map.setView(selectedPosition, 15)
    }
  }, [selectedPosition])

  return <div ref={mapRef} className="w-full h-full min-h-[300px] rounded-lg" />
}
