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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Publicación no encontrada</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          &larr; Volver al inicio
        </Link>
      </div>
    )
  }

  const isOwner = user?.id === listing.userId

  const handleDelete = async () => {
    if (confirm('¿Eliminar esta publicación?')) {
      await remove(listing.id)
      window.location.href = '/'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium">
        &larr; Volver
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {listing.images.length > 0 && (
          <div className="h-72 sm:h-96 overflow-hidden">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{listing.title}</h1>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                ${listing.price.toLocaleString('es-CO')}/mes
              </p>
            </div>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors self-start"
              >
                Eliminar
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
            <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              {listing.type}
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              {listing.bedrooms} habitación(es)
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
              {listing.neighborhood}
            </span>
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed whitespace-pre-line">
            {listing.description}
          </p>

          <div className="mt-6 h-72 rounded-lg overflow-hidden border border-gray-200">
            <MapView listings={[listing]} />
          </div>
        </div>
      </div>
    </div>
  )
}
