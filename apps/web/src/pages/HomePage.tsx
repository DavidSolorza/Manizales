import { useState } from 'react'
import { useListings, useAuth, useSearchFilters } from '@proyecto/hooks'
import { Link } from 'react-router-dom'
import ListingCard from '../features/listings/components/ListingCard'
import SearchFilters from '../features/search/components/SearchFilters'
import MapView from '../features/map/components/MapView'
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton'

export default function HomePage() {
  const { user, login } = useAuth()
  const { filters, setQuery, setPriceRange, setType, setBedrooms, setNeighborhood, reset } = useSearchFilters()
  const { listings, isLoading } = useListings(filters)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showMobileList, setShowMobileList] = useState(false)

  const handlePinClick = (id: string) => {
    const el = document.getElementById(`listing-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile header */}
      <header className="lg:hidden bg-white border-b border-piedra px-4 py-3 flex items-center justify-between shrink-0">
        <h1 className="font-display font-bold text-lg text-tinta">Arriendos U</h1>
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/create" className="text-sm bg-musgo text-white px-3 py-1.5 rounded-lg">+</Link>
          ) : (
            <div className="scale-75 origin-right"><GoogleLoginButton onSuccess={login} /></div>
          )}
          <button
            onClick={() => setShowMobileList(!showMobileList)}
            className="text-sm bg-musgo text-white px-3 py-1.5 rounded-lg"
          >
            Lista ({listings.length})
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        w-full lg:w-[340px] xl:w-[360px] shrink-0 bg-white border-r border-piedra
        flex flex-col h-full
        ${showMobileList ? 'fixed inset-0 z-30' : 'hidden lg:flex'}
      `}>
        {/* Wordmark & user */}
        <div className="hidden lg:flex items-center justify-between px-5 py-4 border-b border-piedra shrink-0">
          <h1 className="font-display font-bold text-xl text-tinta tracking-tight">Arriendos U</h1>
          {user ? (
            <div className="flex items-center gap-2">
              {user.picture && <img src={user.picture} alt="" className="w-7 h-7 rounded-full" />}
              <Link to="/create" className="text-sm bg-musgo text-white px-3 py-1.5 rounded-lg hover:bg-musgo/90 transition-colors font-medium">
                + Publicar
              </Link>
            </div>
          ) : (
            <GoogleLoginButton onSuccess={login} />
          )}
        </div>

        {/* Filters */}
        <div className="shrink-0 px-5 pt-4 pb-2 border-b border-piedra">
          <SearchFilters
            filters={filters}
            onQueryChange={setQuery}
            onPriceChange={setPriceRange}
            onTypeChange={setType}
            onBedroomsChange={setBedrooms}
            onNeighborhoodChange={setNeighborhood}
            onReset={reset}
          />
        </div>

        {/* Close button for mobile */}
        {showMobileList && (
          <button
            onClick={() => setShowMobileList(false)}
            className="lg:hidden text-sm text-musgo font-medium px-5 py-2 text-left"
          >
            &larr; Ver mapa
          </button>
        )}

        {/* Listing list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-musgo" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 px-4">
              <svg className="mx-auto h-12 w-12 text-piedra mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <p className="text-tinta font-medium">Nada por aquí con estos filtros</p>
              <p className="text-sm text-gray-500 mt-1">Probá ajustando los filtros</p>
              <button
                onClick={reset}
                className="mt-4 text-sm bg-musgo text-white px-4 py-2 rounded-lg hover:bg-musgo/90 transition-colors font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            listings.map((listing) => (
              <div
                key={listing.id}
                id={`listing-${listing.id}`}
                onMouseEnter={() => setHoveredId(listing.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <ListingCard listing={listing} />
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Map */}
      <main className="flex-1 relative">
        <div className="absolute inset-0">
          <MapView
            listings={listings}
            hoveredId={hoveredId}
            onPinClick={handlePinClick}
          />
        </div>
      </main>
    </div>
  )
}
