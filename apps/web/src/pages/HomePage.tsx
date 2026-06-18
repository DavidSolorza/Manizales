import { useListings, useAuth } from '@proyecto/hooks'
import { useSearchFilters } from '@proyecto/hooks'
import type { ListingDTO } from '@proyecto/api-client'
import ListingCard from '../features/listings/components/ListingCard'
import SearchFilters from '../features/search/components/SearchFilters'
import MapView from '../features/map/components/MapView'
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const { user, login } = useAuth()
  const { filters, setQuery, setPriceRange, setType, setBedrooms, setNeighborhood, reset } = useSearchFilters()
  const { listings, isLoading } = useListings(filters)

  return (
    <div>
      <header style={{ background: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0e0e0' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Arriendos Universitarios</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/create" style={{ padding: '8px 16px', background: '#1976d2', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                Publicar
              </Link>
              <span>{user.name}</span>
            </>
          ) : (
            <GoogleLoginButton onSuccess={login} />
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <SearchFilters
          filters={filters}
          onQueryChange={setQuery}
          onPriceChange={setPriceRange}
          onTypeChange={setType}
          onBedroomsChange={setBedrooms}
          onNeighborhoodChange={setNeighborhood}
          onReset={reset}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
          <div>
            {isLoading ? (
              <p>Cargando...</p>
            ) : listings.length === 0 ? (
              <p>No se encontraron publicaciones</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {listings.map((listing: ListingDTO) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
          <div style={{ position: 'sticky', top: 24 }}>
            <MapView listings={listings} />
          </div>
        </div>
      </main>
    </div>
  )
}
