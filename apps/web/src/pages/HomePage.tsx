import { useState } from 'react'
import { useListings, useAuth, useSearchFilters, usePendingListings, useNearbyListings } from '@proyecto/hooks'
import { Link } from 'react-router-dom'
import { House, Search, Star, ClipboardList, DollarSign, X, Menu, SlidersHorizontal, Eye, Check, Trash2, Navigation, Crosshair } from 'lucide-react'
import { approveListing, rejectListing } from '@proyecto/api-client'
import ListingCard from '../features/listings/components/ListingCard'
import SkeletonCard from '../features/listings/components/SkeletonCard'
import MapView from '../features/map/components/MapView'
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton'
import RoleSelector from '../features/auth/components/RoleSelector'
import NavItem from '../features/ui/components/NavItem'

type NavItem = 'inicio' | 'favoritos' | 'mis-lugares' | 'precios' | 'pendientes'

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

const ADMIN_ITEMS: { key: NavItem; label: string; icon: typeof House }[] = [
  { key: 'pendientes', label: 'Pendientes', icon: Eye },
]

const TYPE_OPTIONS = ['habitacion', 'apartamento', 'casa']

export default function HomePage() {
  const { user, login, logout, needsRole, setRole } = useAuth()
  const { filters, setQuery, setPriceRange, setType, reset } = useSearchFilters()
  const { listings, isLoading } = useListings(filters)
  const { listings: pending, isLoading: pendingLoading, refetch: refetchPending } = usePendingListings()
  const { listings: nearbyListings, isLoading: nearbyLoading, position: nearbyPos, search: searchNearby, searchMyLocation, clear: clearNearby } = useNearbyListings()
  const [activeNav, setActiveNav] = useState<NavItem>('inicio')
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [showMap, setShowMap] = useState(true)

  const displayListings = nearbyListings.length > 0 ? nearbyListings : listings
  const displayLoading = nearbyLoading || isLoading
  const activeListings = listings.filter((l) => l.status === 'active').length

  const handlePinClick = (id: string) => {
    const el = document.getElementById(`listing-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleApprove = async (id: string) => {
    await approveListing(id)
    refetchPending()
  }

  const handleReject = async (id: string) => {
    await rejectListing(id)
    refetchPending()
  }

  const handleMapClick = (e: { latlng: { lat: number; lng: number } }) => {
    searchNearby(e.latlng.lat, e.latlng.lng)
  }

  const isStudent = user?.role === 'ESTUDIANTE'
  const isAdmin = user?.role === 'SUPER_ADMIN'

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
        {user && (
          <div className="px-3 pt-4 pb-2">
            <Link to="/create"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
            >
              <House size={16} /> {isStudent ? 'Reportar lugar' : 'Publicar un lugar'}
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
        {isAdmin ? (
          <div className="px-3 pb-1">
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider px-2">Admin</p>
            {ADMIN_ITEMS.map((item) => (
              <NavItem key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key}
                badge={pending.length}
                onClick={() => { setActiveNav(item.key); setShowMobileNav(false) }} />
            ))}
          </div>
        ) : user?.role === 'ARRIENDADOR' ? (
          <div className="px-3 pb-1">
            <p className="text-[11px] font-medium text-muted uppercase tracking-wider px-2">Tus publicaciones</p>
            {OWNER_ITEMS.map((item) => (
              <NavItem key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key}
                badge={item.key === 'mis-lugares' ? activeListings : undefined}
                onClick={() => { setActiveNav(item.key); setShowMobileNav(false) }} />
            ))}
          </div>
        ) : isStudent && (
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
              <button onClick={logout} className="text-sec hover:text-red-500 transition-colors" title="Cerrar sesion"><X size={16} /></button>
            </div>
          ) : (
            <GoogleLoginButton onSuccess={login} />
          )}
        </div>
        {/* Dev role switcher */}
        <div className="border-t border-dashed border-border px-3 py-2 bg-bg/50">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-1.5">Modo prueba</p>
          <div className="flex gap-1 flex-wrap">
            <button onClick={() => { localStorage.setItem('mock_user', JSON.stringify({ role: 'SUPER_ADMIN', name: 'Super Admin', email: 'admin@arriendosu.com', picture: '', id: 'mock-admin' })); window.location.reload() }}
              className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${isAdmin ? 'bg-accent text-white' : 'bg-white text-sec border border-border hover:border-accent'}`}>
              Admin
            </button>
            <button onClick={() => { localStorage.setItem('mock_user', JSON.stringify({ role: 'ARRIENDADOR', name: 'Test Arrendador', email: 'test@arrendador.com', picture: '', id: 'mock-1' })); window.location.reload() }}
              className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${user?.role === 'ARRIENDADOR' ? 'bg-accent text-white' : 'bg-white text-sec border border-border hover:border-accent'}`}>
              Arrendador
            </button>
            <button onClick={() => { localStorage.setItem('mock_user', JSON.stringify({ role: 'ESTUDIANTE', name: 'Test Estudiante', email: 'test@estudiante.com', picture: '', id: 'mock-2' })); window.location.reload() }}
              className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${isStudent ? 'bg-accent text-white' : 'bg-white text-sec border border-border hover:border-accent'}`}>
              Estudiante
            </button>
            <button onClick={() => { localStorage.removeItem('mock_user'); window.location.reload() }}
              className="text-xs py-1.5 px-2 rounded-md border border-border text-sec hover:bg-white transition-colors">
              X
            </button>
          </div>
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
          {activeNav === 'inicio' && (
            <>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${showFilters ? 'bg-accent text-white border-accent' : 'bg-white text-sec border-border hover:border-accent'}`}>
                <SlidersHorizontal size={16} /> Filtros
              </button>
          <button onClick={() => { searchMyLocation(); setShowMap(true) }}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${nearbyPos ? 'bg-accent text-white border-accent' : 'bg-white text-sec border-border hover:border-accent'}`}
            title="Buscar cerca de mi ubicacion">
            <Navigation size={16} /> Cerca de mi
          </button>
          {nearbyPos && (
            <button onClick={clearNearby}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-border text-sec hover:bg-bg transition-colors">
              <X size={16} /> Limpiar
            </button>
          )}
          <button onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition-colors ${showMap ? 'bg-accent text-white border-accent' : 'bg-white text-sec border-border hover:border-accent'}`}>
            Mapa
          </button>
            </>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && activeNav === 'inicio' && (
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
                <MapView listings={displayListings} hoveredId={hoveredId} onPinClick={handlePinClick}
                  onClick={handleMapClick} selectedPosition={nearbyPos ? [nearbyPos.lat, nearbyPos.lng] : undefined} />
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1,2,3,4].map((i) => <SkeletonCard key={i} />)}
                  </div>
                ) : displayListings.length === 0 ? (
                  <div className="text-center py-20 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                      <Search size={28} className="text-accent" />
                    </div>
                    <p className="text-tinta font-medium">{nearbyPos ? 'No hay lugares cerca' : 'No hay publicaciones con estos filtros'}</p>
                    <p className="text-sm text-sec mt-1">{nearbyPos ? 'Prueba en otra ubicacion del mapa' : 'Prueba con otros filtros'}</p>
                    {nearbyPos ? (
                      <button onClick={clearNearby} className="mt-4 text-sm px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">Ver todas</button>
                    ) : (
                      <button onClick={reset} className="mt-4 text-sm px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">Limpiar filtros</button>
                    )}
                  </div>
                ) : (
                  <div>
                    {nearbyPos && (
                      <p className="text-xs text-sec mb-3 flex items-center gap-1">
                        <Crosshair size={12} /> Mostrando lugares cerca del punto seleccionado
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {displayListings.map((listing: any) => (
                        <div key={listing.id} id={`listing-${listing.id}`}
                          onMouseEnter={() => setHoveredId(listing.id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <ListingCard listing={listing} distanceKm={listing.distanceKm} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : activeNav === 'pendientes' ? (
            <div className="overflow-y-auto h-full px-4 py-4 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-bold text-tinta">Pendientes de revision</h2>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{pending.length} pendientes</span>
              </div>
              {pendingLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1,2].map((i) => <SkeletonCard key={i} />)}
                </div>
              ) : pending.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <Check size={28} className="text-green-500" />
                  </div>
                  <p className="text-tinta font-medium">No hay nada pendiente</p>
                  <p className="text-sm text-sec mt-1">Todos los lugares estan revisados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map((listing) => (
                    <div key={listing.id} className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col sm:flex-row">
                      <div className="sm:w-40 h-32 sm:h-auto bg-bg shrink-0">
                        {listing.images.length > 0 && (
                          <img src={listing.images[0]} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <p className="font-medium text-tinta text-sm">{(listing as any).userName} <span className="text-xs text-sec font-normal">dice:</span></p>
                          <p className="text-sm text-sec mt-1">{listing.title} - {listing.neighborhood}</p>
                          <p className="text-xs text-sec mt-1">{new Date(listing.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleApprove(listing.id)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">
                            <Check size={14} /> Aprobar
                          </button>
                          <button onClick={() => handleReject(listing.id)}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-white text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                            <Trash2 size={14} /> Rechazar
                          </button>
                          <Link to={`/listings/${listing.id}`}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-white text-sec border border-border rounded-lg hover:bg-bg transition-colors ml-auto">
                            Ver detalle
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeNav === 'favoritos' ? (
            <div className="flex items-center justify-center h-full text-center px-4 animate-fade-in">
              <div>
                <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                  <Star size={28} className="text-amber-400" />
                </div>
                <p className="text-tinta font-medium">Tus favoritos</p>
                <p className="text-sm text-sec mt-1 max-w-xs mx-auto">Guarda publicaciones como favoritas para encontrarlas rapido. Toca la estrella en cualquier tarjeta</p>

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
          let extraItems: { key: NavItem; label: string; icon: typeof House }[]
          if (isAdmin) extraItems = ADMIN_ITEMS
          else if (user?.role === 'ARRIENDADOR') extraItems = OWNER_ITEMS
          else extraItems = STUDENT_ITEMS
          return [...NAV_ITEMS, ...extraItems].map((item) => {
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
