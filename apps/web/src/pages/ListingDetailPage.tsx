import { useParams, Link } from 'react-router-dom'
import { useListingDetail, useAuth, useDeleteListing } from '@proyecto/hooks'
import MapView from '../features/map/components/MapView'

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { listing, isLoading, error } = useListingDetail(id)
  const { user } = useAuth()
  const { remove } = useDeleteListing()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-display font-bold text-tinta">No encontrada</h2>
        <Link to="/" className="text-accent hover:underline mt-4 inline-block text-sm">&larr; Volver</Link>
      </div>
    )
  }

  const isOwner = user?.id === listing.userId

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-accent hover:underline mb-4 text-sm">&larr; Volver</Link>
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          {listing.images.length > 0 && (
            <div className="h-72 sm:h-96 overflow-hidden bg-bg">
              <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-tinta">{listing.title}</h1>
                <p className="text-lg font-bold text-accent mt-1">${listing.price.toLocaleString('es-CO')}/mes</p>
              </div>
              {isOwner && (
                <button onClick={async () => { if (confirm('¿Eliminar?')) { await remove(listing.id); window.location.href = '/' } }}
                  className="px-4 py-2 bg-red-400 text-white text-sm rounded-lg hover:bg-red-500 transition-colors self-start">Eliminar</button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 text-xs text-sec">
              <span className="bg-bg px-3 py-1 rounded-full">{listing.type}</span>
              <span className="bg-bg px-3 py-1 rounded-full">{listing.bedrooms} hab</span>
              <span className="bg-bg px-3 py-1 rounded-full">📍 {listing.neighborhood}</span>
            </div>
            <p className="mt-6 text-tinta leading-relaxed whitespace-pre-line text-sm">{listing.description}</p>
            <div className="mt-6 h-72 rounded-lg overflow-hidden border border-border">
              <MapView listings={[listing]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
