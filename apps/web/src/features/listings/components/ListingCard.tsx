import { Link } from 'react-router-dom'
import { MapPin, Home, BedDouble } from 'lucide-react'
import type { ListingDTO } from '@proyecto/api-client'

interface Props {
  listing: ListingDTO
}

const typeIcon: Record<string, typeof Home> = {
  casa: Home,
  apartamento: Home,
  habitacion: Home,
}

export default function ListingCard({ listing }: Props) {
  const TypeIcon = typeIcon[listing.type] || Home
  const isAvailable = listing.status === 'active'

  return (
    <Link to={`/listings/${listing.id}`} className="block group">
      <div className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        <div className="aspect-[4/3] overflow-hidden bg-bg relative">
          {listing.images.length > 0 ? (
            <img src={listing.images[0]} alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">Sin foto</div>
          )}
          {/* Status badge */}
          <span className={`absolute top-2 left-2 text-[11px] font-medium px-2 py-0.5 rounded-full ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {isAvailable ? 'Disponible' : 'Arrendado'}
          </span>
        </div>
        <div className="p-3">
          <h3 className="font-body font-medium text-sm text-tinta leading-snug line-clamp-1 group-hover:text-accent transition-colors">
            {listing.title}
          </h3>
          <p className="font-mono font-semibold text-sm text-accent mt-1">
            ${listing.price.toLocaleString('es-CO')}/mes
          </p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-sec">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">{listing.neighborhood}</span>
            <span className="text-border mx-0.5">·</span>
            <TypeIcon size={12} className="shrink-0" />
            <span>{listing.type}</span>
            <span className="text-border mx-0.5">·</span>
            <BedDouble size={12} className="shrink-0" />
            <span>{listing.bedrooms}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
