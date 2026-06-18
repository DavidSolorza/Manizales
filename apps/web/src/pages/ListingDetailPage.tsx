import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useListingDetail, useAuth, useDeleteListing } from '@proyecto/hooks'
import { useToast } from '../features/ui/components/Toast'
import { ArrowLeft, MapPin, Trash2, Home, BedDouble, ChevronLeft, ChevronRight } from 'lucide-react'
import MapView from '../features/map/components/MapView'

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { listing, isLoading, error } = useListingDetail(id)
  const { user } = useAuth()
  const { remove } = useDeleteListing()
  const { toast } = useToast()
  const [currentImg, setCurrentImg] = useState(0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto px-4">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-72 bg-gray-200 rounded-xl" />
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-display font-bold text-tinta">No encontrada</h2>
        <Link to="/" className="text-accent hover:underline mt-4 inline-flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Volver
        </Link>
      </div>
    )
  }

  const isOwner = user?.id === listing.userId
  const showGallery = listing.images.length > 1

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-accent hover:underline mb-4 text-sm gap-1">
          <ArrowLeft size={16} /> Volver
        </Link>

        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          {/* Image gallery */}
          {listing.images.length > 0 && (
            <div className="relative bg-black/5">
              <div className="h-72 sm:h-96 overflow-hidden">
                <img src={listing.images[currentImg]} alt={listing.title}
                  className="w-full h-full object-cover transition-opacity duration-300" />
              </div>
              {showGallery && (
                <>
                  <button onClick={() => setCurrentImg((p) => (p === 0 ? listing.images.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => setCurrentImg((p) => (p === listing.images.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors">
                    <ChevronRight size={20} />
                  </button>
                  {/* Thumbnails */}
                  <div className="flex gap-2 justify-center py-2 px-4 overflow-x-auto">
                    {listing.images.map((url, i) => (
                      <button key={i} onClick={() => setCurrentImg(i)}
                        className={`shrink-0 w-14 h-10 rounded-md overflow-hidden border-2 transition-all ${i === currentImg ? 'border-accent opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {listing.status === 'active' ? 'Disponible' : 'Arrendado'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-tinta">{listing.title}</h1>
                <p className="text-lg font-mono font-bold text-accent mt-1">
                  ${listing.price.toLocaleString('es-CO')}/mes
                </p>
              </div>
              {isOwner && (
                <button onClick={async () => { if (confirm('Eliminar esta publicacion?')) { await remove(listing.id); toast('Publicacion eliminada', 'info'); window.location.href = '/' } }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors self-start">
                  <Trash2 size={16} /> Eliminar
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4 text-xs text-sec">
              <span className="bg-bg px-3 py-1 rounded-full inline-flex items-center gap-1">
                <Home size={12} /> {listing.type}
              </span>
              <span className="bg-bg px-3 py-1 rounded-full inline-flex items-center gap-1">
                <BedDouble size={12} /> {listing.bedrooms} hab
              </span>
              <span className="bg-bg px-3 py-1 rounded-full inline-flex items-center gap-1">
                <MapPin size={12} /> {listing.neighborhood}
              </span>
            </div>

            <p className="mt-6 text-tinta leading-relaxed whitespace-pre-line text-sm">{listing.description}</p>

            <div className="mt-6">
              <p className="text-xs text-sec font-medium mb-2">Ubicacion</p>
              <div className="h-64 rounded-lg overflow-hidden border border-border">
                <MapView listings={[listing]} />
              </div>
              <p className="text-xs text-sec mt-1">{listing.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
