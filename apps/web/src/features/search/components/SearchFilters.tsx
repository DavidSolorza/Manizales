import type { SearchFilters as Filters } from '@proyecto/api-client'

interface Props {
  filters: Filters
  onQueryChange: (q: string) => void
  onPriceChange: (min?: number, max?: number) => void
  onTypeChange: (t: string | undefined) => void
  onBedroomsChange: (b: number | undefined) => void
  onNeighborhoodChange: (n: string | undefined) => void
  onReset: () => void
}

export default function SearchFilters({ filters, onQueryChange, onPriceChange, onTypeChange, onBedroomsChange, onNeighborhoodChange, onReset }: Props) {
  return (
    <div style={{ background: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem', fontWeight: 500 }}>Buscar</label>
          <input
            placeholder="Título o descripción..."
            value={filters.query || ''}
            onChange={(e) => onQueryChange(e.target.value)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem', fontWeight: 500 }}>Precio mín</label>
          <input
            type="number"
            placeholder="0"
            value={filters.minPrice ?? ''}
            onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem', fontWeight: 500 }}>Precio máx</label>
          <input
            type="number"
            placeholder="999999"
            value={filters.maxPrice ?? ''}
            onChange={(e) => onPriceChange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem', fontWeight: 500 }}>Tipo</label>
          <select value={filters.type || ''} onChange={(e) => onTypeChange(e.target.value || undefined)} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: 4 }}>
            <option value="">Todos</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="habitacion">Habitación</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: '0.85rem', fontWeight: 500 }}>Barrio</label>
          <input
            placeholder="Barrio..."
            value={filters.neighborhood || ''}
            onChange={(e) => onNeighborhoodChange(e.target.value || undefined)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        <button onClick={onReset} style={{ padding: '8px 16px', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}>
          Limpiar
        </button>
      </div>
    </div>
  )
}
