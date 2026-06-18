import { Link } from 'react-router-dom'
import type { ListingDTO } from '@proyecto/api-client'

interface Props {
  listing: ListingDTO
}

export default function ListingCard({ listing }: Props) {
  return (
    <Link
      to={`/listings/${listing.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div style={{
        background: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        height: 180,
      }}>
        {listing.images.length > 0 && (
          <img
            src={listing.images[0]}
            alt={listing.title}
            style={{ width: 240, height: '100%', objectFit: 'cover' }}
          />
        )}
        <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem' }}>{listing.title}</h3>
            <p style={{ color: '#666', margin: '0 0 8px', fontSize: '0.9rem' }}>
              {listing.neighborhood} - {listing.type}
            </p>
            <p style={{ margin: 0, color: '#444', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {listing.description}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1976d2' }}>
              ${listing.price.toLocaleString('es-CO')}/mes
            </span>
            <span style={{ color: '#666', fontSize: '0.85rem' }}>
              {listing.bedrooms} hab.
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
