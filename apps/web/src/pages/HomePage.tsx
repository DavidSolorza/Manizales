import { useState } from 'react'
import { useListings, useAuth, useSearchFilters } from '@proyecto/hooks'
import { Link } from 'react-router-dom'
import { House, Search, Star, ClipboardList, DollarSign, X, Menu, SlidersHorizontal } from 'lucide-react'
import ListingCard from '../features/listings/components/ListingCard'
import SkeletonCard from '../features/listings/components/SkeletonCard'
import MapView from '../features/map/components/MapView'
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton'
import RoleSelector from '../features/auth/components/RoleSelector'
import NavItem from '../features/ui/components/NavItem'

type NavItem = 'inicio' | 'favoritos' | 'mis-lugares' | 'precios'

const NAV_ITEMS: { key: NavItem; label: string; icon: typeof House }[] = [
  { key: 'inicio', label: 'Inicio', icon: House },
]

const OWNER_ITEMS: { key: NavItem; label: string; icon: typeof House }[] = [
  { key: 'mis-lugares', label: 'Mis lugares', icon: ClipboardList },
  { key: 'precios', label: 'Precios y disponibilidad', icon: DollarSign },
]

const STUDENT_ITEMS: { key: NavItem; label: string; icon: typeof House }[] = [
  { key: 'favoritos', label: 'Favoritos', icon: Star },
]

const TYPE_OPTIONS = ['habitacion', 'apartamento', 'casa']

export default function HomePage() {
  const { user, login, logout, needsRole, setRole } = useAuth()
  const { filters, setQuery, setPriceRange, setType, reset } = useSearchFilters()
  const { listings, isLoading } = useListings(filters)
  const [activeNav, setActiveNav] = useState<NavItem>('inicio')
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(true)

  const activeListings = listings.filter((l) => l.status === 'active').length

  const handlePinClick = (id: string) => {
    const el = document.getElementById(`listing-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {showMobileNav && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setShowMobileNav(false)} />
      )}

      {needsRole && <RoleSelector onSelect={setRole} />}

      {/* ===== SIDEBAR ===== */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-[240px] bg-sidebar border-r border-border flex flex-col
        transition-transform ${showMobileNav ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-4 py-5 border-b border-border">
          <h1 className="font-display font-bold text-base text-tinta">Arriendos U</h1>
        </div>
        {user?.role === 'ARRIENDADOR' && (
          <div className="px-3 pt-4 pb-2">
            <Link to="/create"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              <House size={16} /> Publicar un lugar
            </Link>
          </div>
        )}
        <div className="px-3 pt-3 pb-1">
          <p className="text-[11px] font-medium text-muted uppercase tracking-wider px-2">Explorar</p>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key}
              onClick={() => { setActiveNav(item.key); setShowMobileNav(false) }} />
          ))}
        </div>
        <div className="mx-3 my-2 border-t border-border" />
        {user?.role === 'ARRIENDADOR' ? (
          <div className="px-3 pb-1">
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider px-2">Tus publicaciones</p>
            {OWNER_ITEMS.map((item) => (
              <NavItem key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key}
                badge={item.key === 'mis-lugares' ? activeListings : undefined}
                onClick={() => { setActiveNav(item.key); setShowMobileNav(false) }} />
            ))}
          </div>
        ) : (
          <div className="px-3 pb-1">
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider px-2">Guardados</p>
            {STUDENT_ITEMS.map((item) => (
              <NavItem key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key}
                onClick={() => { setActiveNav(item.key); setShowMobileNav(false) }} />
            ))}
          </div>
        )}
        <div className="flex-1" />
        <div className="border-t border-border px-3 py-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.picture && <img src={user.picture} alt="" className="w-8 h-8 rounded-full" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-tinta truncate">{user.name}</p>
                <p className="text-xs text-sec truncate">{user.email}</p>
              </div>
              <button onClick={logout} className="text-sec hover:text-red-500 transition-colors" title="Cerrar sesión"><X size={16} /></button>
            </div>
          ) : (
            <GoogleLoginButton onSuccess={login} />
          )}
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
          <button onClick={() => setShowMobileNav(true)} className="lg:hidden text-tinta"><Menu size={20} /></button>
          <div className="flex-1 relative">
            <input placeholder="Buscar por titulo o descripcion..." value={filters.query || ''}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-bg border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${showFilters ? 'bg-accent text-white border-accent' : 'bg-white text-sec border-border hover:border-accent'}`}>
            <SlidersHorizontal size={16} /> Filtros
          </button>
          <button onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${showMap ? 'bg-accent text-white border-accent' : 'bg-white text-sec border-border hover:border-accent'}`}>
            Mapa
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white border-b border-border px-4 py-3 shrink-0">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <label className="text-xs text-sec">Precio:</label>
                <input type="number" placeholder="Min" value={filters.minPrice ?? ''}
                  onChange={(e) => setPriceRange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)}
                  className="w-20 px-2 py-1.5 text-sm border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent" />
                <span className="text-sec text-xs">—</span>
                <input type="number" placeholder="Max" value={filters.maxPrice ?? ''}
                  onChange={(e) => setPriceRange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)}
                  className="w-20 px-2 py-1.5 text-sm border border-border rounded-lg outline-none focus:ring-2 focus:ring-accent" />
              </div>
              {TYPE_OPTIONS.map((t) => (
                <button key={t} onClick={() => setType(filters.type === t ? undefined : t)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${filters.type === t ? 'bg-accent text-white border-accent' : 'bg-white text-sec border-border hover:border-accent'}`}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content based on active nav */}
        <div className="flex-1 min-h-0">
          {activeNav === 'inicio' ? (
            <div className="h-full flex flex-col lg:flex-row">
              <div className={`${showMap ? 'h-64 lg:h-auto lg:w-1/2' : 'hidden'} shrink-0 border-b lg:border-b-0 lg:border-r border-border`}>
                <MapView listings={listings} hoveredId={hoveredId} onPinClick={handlePinClick} />
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1,2,3,4].map((i) => <SkeletonCard key={i} />)}
                  </div>
                ) : listings.length === 0 ? (
                  <div className="text-center py-20 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                      <Search size={28} className="text-accent" />
                    </div>
                    <p className="text-tinta font-medium">No hay publicaciones con estos filtros</p>
                    <p className="text-sm text-sec mt-1">Probá con otros filtros o limpiá la busqueda</p>
                    <button onClick={reset} className="mt-4 text-sm px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">Limpiar filtros</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listings.map((listing) => (
                      <div key={listing.id} id={`listing-${listing.id}`}
                        onMouseEnter={() => setHoveredId(listing.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <ListingCard listing={listing} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : activeNav === 'favoritos' ? (
            <div className="flex items-center justify-center h-full text-center px-4 animate-fade-in">
              <div>
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                  <Star size={28} className="text-amber-400" />
                </div>
                <p className="text-tinta font-medium">Tus favoritos</p>
                <p className="text-sm text-sec mt-1 max-w-xs mx-auto">Guarda publicaciones como favoritas para encontrarlas rapido. Tocá la estrella en cualquier tarjeta</p>
              </div>
            </div>
          ) : activeNav === 'mis-lugares' ? (
            <div className="overflow-y-auto h-full px-4 py-4 animate-fade-in">
              <h2 className="text-lg font-display font-bold text-tinta mb-4">Mis lugares</h2>
              {!user ? (
                <div className="text-center py-16">
                  <p className="text-sm text-sec">Inicia sesion para ver tus publicaciones</p>
                </div>
              ) : (
                <div>
                  {listings.filter((l) => l.userId === user.id).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {listings.filter((l) => l.userId === user.id).map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                        <ClipboardList size={28} className="text-accent" />
                      </div>
                      <p className="text-tinta font-medium">No has publicado nada aun</p>
                      <Link to="/create" className="mt-4 inline-flex items-center gap-2 text-sm px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">
                        <House size={16} /> Publica tu primer lugar
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeNav === 'precios' ? (
            <div className="flex items-center justify-center h-full text-center px-4 animate-fade-in">
              <div>
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <DollarSign size={28} className="text-green-500" />
                </div>
                <p className="text-tinta font-medium">Precios y disponibilidad</p>
                <p className="text-sm text-sec mt-1 max-w-xs mx-auto">Administra los precios de tus publicaciones y marca lugares como arrendados</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="lg:hidden bg-white border-t border-border flex items-center justify-around py-1 shrink-0">
        {(() => {
          const items = user?.role === 'ARRIENDADOR'
            ? [...NAV_ITEMS, ...OWNER_ITEMS]
            : [...NAV_ITEMS, ...STUDENT_ITEMS]
          return items.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.key} onClick={() => { setActiveNav(item.key) }}
                className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${activeNav === item.key ? 'text-accent' : 'text-muted'}`}>
                <Icon size={18} />
                <span className="text-[10px] leading-tight mt-0.5">{item.label.split(' ')[0]}</span>
              </button>
            )
          })
        })()}
      </nav>
    </div>
  )
}
