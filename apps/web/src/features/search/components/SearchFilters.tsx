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

export default function SearchFilters({
  filters, onQueryChange, onPriceChange, onTypeChange,
  onBedroomsChange, onNeighborhoodChange, onReset,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
          <input
            placeholder="Título o descripción..."
            value={filters.query || ''}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Precio mín</label>
          <input
            type="number"
            placeholder="$0"
            value={filters.minPrice ?? ''}
            onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : undefined, filters.maxPrice)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Precio máx</label>
          <input
            type="number"
            placeholder="$999,999"
            value={filters.maxPrice ?? ''}
            onChange={(e) => onPriceChange(filters.minPrice, e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
          <select
            value={filters.type || ''}
            onChange={(e) => onTypeChange(e.target.value || undefined)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="">Todos</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="habitacion">Habitación</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Barrio</label>
          <input
            placeholder="Barrio..."
            value={filters.neighborhood || ''}
            onChange={(e) => onNeighborhoodChange(e.target.value || undefined)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  )
}
