import { useState } from 'react'
import { useListings, useAuth, useSearchFilters } from '@proyecto/hooks'
import { Link } from 'react-router-dom'
import ListingCard from '../features/listings/components/ListingCard'
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton'

type NavItem = 'inicio' | 'buscar' | 'favoritos' | 'mis-lugares' | 'precios'

const NAV_ITEMS: { key: NavItem; label: string; icon: string }[] = [
  { key: 'inicio', label: 'Inicio', icon: '🏠' },
  { key: 'buscar', label: 'Buscar y filtrar', icon: '🔍' },
  { key: 'favoritos', label: 'Favoritos', icon: '⭐' },
]

const OWNER_ITEMS: { key: NavItem; label: string; icon: string }[] = [
  { key: 'mis-lugares', label: 'Mis lugares', icon: '📋' },
  { key: 'precios', label: 'Precios y disponibilidad', icon: '💰' },
]

const TYPE_OPTIONS = ['habitacion', 'apartamento', 'casa']

export default function HomePage() {
  const { user, login, logout } = useAuth()
  const { filters, setQuery, setPriceRange, setType, reset } = useSearchFilters()
  const { listings, isLoading } = useListings(filters)
  const [activeNav, setActiveNav] = useState<NavItem>('inicio')
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)

  const activeListings = listings.filter((l) => l.status === 'active').length

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* ===== OVERLAY MOBILE ===== */}
      {showMobileNav && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setShowMobileNav(false)} />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-[240px] bg-sidebar border-r border-border flex flex-col
        transition-transform ${showMobileNav ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-4 py-5 border-b border-border">
          <h1 className="font-display font-bold text-base text-tinta">Arriendos U</h1>
        </div>

        <div className="px-3 pt-4 pb-2">
          <Link to="/create"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
          >
            <span>+</span> Publicar un lugar
          </Link>
        </div>

        <div className="px-3 pt-3 pb-1">
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider px-2">Explorar</p>
          {NAV_ITEMS.map((item) => (
            <button key={item.key} onClick={() => { setActiveNav(item.key); if (item.key === 'buscar') setShowFilters(!showFilters); setShowMobileNav(false) }}
              className={`w-full flex items-center gap-3 px-2 py-2 text-sm rounded-lg mt-0.5 transition-colors ${
                activeNav === item.key ? 'bg-accent-light text-accent font-medium' : 'text-sec hover:text-tinta hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        <div className="mx-3 my-2 border-t border-border" />

        <div className="px-3 pb-1">
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider px-2">Tus publicaciones</p>
          {OWNER_ITEMS.map((item) => (
            <button key={item.key} onClick={() => { setActiveNav(item.key); setShowMobileNav(false) }}
              className={`w-full flex items-center gap-3 px-2 py-2 text-sm rounded-lg mt-0.5 transition-colors ${
                activeNav === item.key ? 'bg-accent-light text-accent font-medium' : 'text-sec hover:text-tinta hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.key === 'mis-lugares' && activeListings > 0 && (
                <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{activeListings}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="border-t border-border px-3 py-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.picture && <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-tinta truncate">{user.name}</p>
                <p className="text-xs text-sec truncate">{user.email}</p>
              </div>
              <button onClick={logout} className="text-xs text-sec hover:text-red-500 transition-colors" title="Cerrar sesión">✕</button>
            </div>
          ) : (
            <GoogleLoginButton onSuccess={login} />
          )}
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => setShowMobileNav(true)} className="lg:hidden text-lg text-tinta">☰</button>
          <div className="flex-1 relative">
            <input placeholder="Buscar por título o descripción..." value={filters.query || ''}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-bg border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors ${showFilters ? 'bg-accent text-white border-accent' : 'bg-white text-sec border-border hover:border-accent'}`}>
            Filtros
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white border-b border-border px-4 py-3 shrink-0">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <label className="text-xs text-sec">Precio:</label>
                <input type="number" placeholder="Mín" value={filters.minPrice ?? ''}
                  onChange={(e) => setPriceRange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)}
                  className="w-20 px-2 py-1.5 text-sm border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent" />
                <span className="text-sec text-xs">—</span>
                <input type="number" placeholder="Máx" value={filters.maxPrice ?? ''}
                  onChange={(e) => setPriceRange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)}
                  className="w-20 px-2 py-1.5 text-sm border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent" />
              </div>
              {TYPE_OPTIONS.map((t) => (
                <button key={t} onClick={() => setType(filters.type === t ? undefined : t)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${filters.type === t ? 'bg-accent text-white border-accent' : 'bg-white text-sec border-border hover:border-accent'}`}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
              <button onClick={reset} className="text-xs text-sec hover:text-tinta underline">Limpiar</button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-tinta font-medium">No hay publicaciones con estos filtros</p>
              <button onClick={reset} className="mt-3 text-sm text-accent hover:underline">Limpiar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="lg:hidden bg-white border-t border-border flex items-center justify-around py-1 shrink-0">
        {[...NAV_ITEMS, ...OWNER_ITEMS].map((item) => (
          <button key={item.key} onClick={() => { setActiveNav(item.key); if (item.key === 'buscar') setShowFilters(!showFilters) }}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${activeNav === item.key ? 'text-accent' : 'text-muted'}`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] leading-tight">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
