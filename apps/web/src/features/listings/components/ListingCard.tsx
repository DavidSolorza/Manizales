import { Link } from 'react-router-dom'
import type { ListingDTO } from '@proyecto/api-client'

interface Props {
  listing: ListingDTO
}

export default function ListingCard({ listing }: Props) {
  return (
    <Link to={`/listings/${listing.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
        {listing.images.length > 0 && (
          <div className="sm:w-60 h-48 sm:h-44 shrink-0 overflow-hidden">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
              {listing.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {listing.neighborhood} &middot; {listing.type}
            </p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {listing.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <span className="text-lg font-bold text-blue-600">
              ${listing.price.toLocaleString('es-CO')}/mes
            </span>
            <span className="text-sm text-gray-500">
              {listing.bedrooms} {listing.bedrooms === 1 ? 'hab' : 'hab'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
