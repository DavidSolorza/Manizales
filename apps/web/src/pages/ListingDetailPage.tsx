import { useParams, Link } from 'react-router-dom'
import { useListingDetail, useAuth, useDeleteListing } from '@proyecto/hooks'
import MapView from '../features/map/components/MapView'

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { listing, isLoading, error } = useListingDetail(id)
  const { user } = useAuth()
  const { remove } = useDeleteListing()

  if (isLoading) return <div style={{ padding: 24 }}>Cargando...</div>
  if (error || !listing) return <div style={{ padding: 24 }}>Publicación no encontrada</div>

  const isOwner = user?.id === listing.userId

  const handleDelete = async () => {
    if (confirm('¿Eliminar esta publicación?')) {
      await remove(listing.id)
      window.location.href = '/'
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
      <Link to="/" style={{ color: '#1976d2', marginBottom: 16, display: 'block' }}>&larr; Volver</Link>

      <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        {listing.images.length > 0 && (
          <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: 400, objectFit: 'cover' }} />
        )}

        <div style={{ padding: 24 }}>
          <h1 style={{ margin: '0 0 8px' }}>{listing.title}</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2', margin: '0 0 16px' }}>
            ${listing.price.toLocaleString('es-CO')}/mes
          </p>

          <div style={{ display: 'flex', gap: 16, marginBottom: 16, color: '#666' }}>
            <span>{listing.type}</span>
            <span>{listing.bedrooms} habitación(es)</span>
            <span>{listing.neighborhood}</span>
          </div>

          <p style={{ lineHeight: 1.6, marginBottom: 24 }}>{listing.description}</p>

          <div style={{ height: 300, marginBottom: 24 }}>
            <MapView listings={[listing]} />
          </div>

          {isOwner && (
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={handleDelete} style={{ padding: '8px 16px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
