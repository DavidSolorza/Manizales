import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { ListingDTO } from '@proyecto/api-client'

interface Props {
  listing: ListingDTO
}

export default function ListingCard({ listing }: Props) {
  return (
    <Link to={`/listings/${listing.id}`} className="block group">
      <div className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-sm hover:border-accent/30 transition-all">
        <div className="aspect-[4/3] overflow-hidden bg-bg">
          {listing.images.length > 0 ? (
            <img src={listing.images[0]} alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">Sin foto</div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-body font-medium text-sm text-tinta leading-snug line-clamp-1">{listing.title}</h3>
          <p className="font-body font-medium text-sm text-accent mt-1">${listing.price.toLocaleString('es-CO')}/mes</p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-sec">
            <MapPin size={12} />
            <span className="truncate">{listing.neighborhood}</span>
            <span className="text-border mx-0.5">·</span>
            <span>{listing.type}</span>
            <span className="text-border mx-0.5">·</span>
            <span>{listing.bedrooms} hab</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
