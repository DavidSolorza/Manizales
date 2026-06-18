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

  return (
    <div>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Arriendos Universitarios</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Publicar
                </Link>
                <div className="flex items-center gap-2">
                  {user.picture && (
                    <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />
                  )}
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                </div>
              </>
            ) : (
              <GoogleLoginButton onSuccess={login} />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SearchFilters
          filters={filters}
          onQueryChange={setQuery}
          onPriceChange={setPriceRange}
          onTypeChange={setType}
          onBedroomsChange={setBedrooms}
          onNeighborhoodChange={setNeighborhood}
          onReset={reset}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">No se encontraron publicaciones</p>
                <p className="text-sm mt-1">Intenta con otros filtros</p>
              </div>
            ) : (
              listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            )}
          </div>
          <div className="lg:sticky lg:top-6 h-[calc(100vh-8rem)]">
            <div className="w-full h-full rounded-xl overflow-hidden shadow-md border border-gray-200">
              <MapView listings={listings} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
