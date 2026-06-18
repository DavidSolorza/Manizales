import { Link } from 'react-router-dom'
import type { ListingDTO } from '@proyecto/api-client'

interface Props {
  listing: ListingDTO
}

export default function ListingCard({ listing }: Props) {
  return (
    <Link to={`/listings/${listing.id}`} className="block group">
      <div className="bg-white rounded-xl border border-piedra/50 overflow-hidden hover:shadow-md hover:border-piedra transition-all">
        {/* Image 4:3 */}
        <div className="aspect-[4/3] overflow-hidden bg-niebla">
          {listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-piedra">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-3">
          {/* Price badge - Cereza */}
          <div className="inline-block bg-cereza text-white text-xs font-mono font-semibold px-2.5 py-1 rounded-md mb-2">
            ${listing.price.toLocaleString('es-CO')}/mes
          </div>

          {/* Title */}
          <h3 className="font-body font-medium text-sm text-tinta leading-tight line-clamp-1 group-hover:text-musgo transition-colors">
            {listing.title}
          </h3>

          {/* Pills: neighborhood + type */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-block text-[11px] text-gray-500 bg-piedra/40 px-2 py-0.5 rounded-full">
              {listing.neighborhood}
            </span>
            <span className="inline-block text-[11px] text-gray-500 bg-piedra/40 px-2 py-0.5 rounded-full">
              {listing.type}
            </span>
            <span className="inline-block text-[11px] text-gray-500 bg-piedra/40 px-2 py-0.5 rounded-full">
              {listing.bedrooms} hab
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
