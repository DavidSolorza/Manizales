import { useState, useRef, useEffect, useCallback } from 'react'
import type { SearchFilters as Filters } from '@proyecto/api-client'

const TYPES = [
  { value: 'habitacion', label: 'Habitación' },
  { value: 'apartaestudio', label: 'Apartaestudio' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
]

const NEIGHBORHOODS = [
  'La Castellana', 'Palermo', 'El Cable', 'Los Cerezos',
  'Salamanca', 'Villa del Prado', 'Estambul', 'Los Alpes',
  'Camino Real', 'San Marcel', 'Militar', 'Paraíso',
  'Chipre', 'Cumbre', 'Alta Suiza', 'Bella Suiza',
]

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
  const [minVal, setMinVal] = useState(filters.minPrice ?? 0)
  const [maxVal, setMaxVal] = useState(filters.maxPrice ?? 2000000)
  const [neighborhoodInput, setNeighborhoodInput] = useState(filters.neighborhood || '')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeTab, setActiveTab] = useState<'filters' | 'search'>('search')
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredNeighborhoods = NEIGHBORHOODS.filter(
    (n) => n.toLowerCase().includes(neighborhoodInput.toLowerCase()) && n !== neighborhoodInput
  )

  useEffect(() => {
    onPriceChange(minVal || undefined, maxVal || undefined)
  }, [minVal, maxVal]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setNeighborhoodInput(filters.neighborhood || '')
  }, [filters.neighborhood])

  const handleBedroomClick = useCallback((val: number | undefined) => {
    onBedroomsChange(filters.bedrooms === val ? undefined : val)
  }, [filters.bedrooms, onBedroomsChange])

  const BEDROOMS = [1, 2, 3, 4]

  return (
    <div className="space-y-4">
      {/* Tabs: Buscar / Filtrar */}
      <div className="flex gap-1 bg-niebla rounded-lg p-1">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${activeTab === 'search' ? 'bg-white text-tinta shadow-sm' : 'text-gray-500 hover:text-tinta'}`}
        >
          Buscar
        </button>
        <button
          onClick={() => setActiveTab('filters')}
          className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${activeTab === 'filters' ? 'bg-white text-tinta shadow-sm' : 'text-gray-500 hover:text-tinta'}`}
        >
          Filtrar
        </button>
      </div>

      {activeTab === 'search' ? (
        <div>
          <input
            ref={inputRef}
            placeholder="Buscar por título o descripción..."
            value={filters.query || ''}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-niebla border border-piedra rounded-lg focus:ring-2 focus:ring-musgo focus:border-musgo outline-none placeholder:text-gray-400"
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Price range slider */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Precio</label>
            <div className="flex items-center gap-2 text-xs font-mono text-tinta mb-2">
              <span>${(minVal / 1000).toFixed(0)}k</span>
              <span className="flex-1 text-center">—</span>
              <span>${(maxVal / 1000).toFixed(0)}k</span>
            </div>
            <div className="relative h-2">
              <div className="absolute inset-0 bg-piedra rounded-full" />
              <div
                className="absolute h-full bg-musgo rounded-full"
                style={{ left: `${(minVal / 2000000) * 100}%`, right: `${100 - (maxVal / 2000000) * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={2000000}
                step={50000}
                value={minVal}
                onChange={(e) => { const v = Number(e.target.value); if (v < maxVal) setMinVal(v) }}
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-musgo [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <input
                type="range"
                min={0}
                max={2000000}
                step={50000}
                value={maxVal}
                onChange={(e) => { const v = Number(e.target.value); if (v > minVal) setMaxVal(v) }}
                className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-musgo [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>

          {/* Type chips */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Tipo</label>
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => onTypeChange(filters.type === t.value ? undefined : t.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                    filters.type === t.value
                      ? 'bg-musgo text-white border-musgo'
                      : 'bg-white text-tinta border-piedra hover:border-musgo'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Habitaciones</label>
            <div className="flex gap-1.5">
              {BEDROOMS.map((n) => (
                <button
                  key={n}
                  onClick={() => handleBedroomClick(n)}
                  className={`w-9 h-9 text-xs font-medium rounded-lg border transition-colors ${
                    filters.bedrooms === n
                      ? 'bg-musgo text-white border-musgo'
                      : 'bg-white text-tinta border-piedra hover:border-musgo'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Neighborhood with autocomplete */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 mb-1">Barrio</label>
            <input
              placeholder="Buscar barrio..."
              value={neighborhoodInput}
              onChange={(e) => {
                setNeighborhoodInput(e.target.value)
                setShowSuggestions(true)
                if (!e.target.value) onNeighborhoodChange(undefined)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full px-3 py-2 text-sm bg-niebla border border-piedra rounded-lg focus:ring-2 focus:ring-musgo focus:border-musgo outline-none placeholder:text-gray-400"
            />
            {showSuggestions && filteredNeighborhoods.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-piedra rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {filteredNeighborhoods.map((n) => (
                  <button
                    key={n}
                    onMouseDown={() => {
                      setNeighborhoodInput(n)
                      onNeighborhoodChange(n)
                      setShowSuggestions(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-niebla transition-colors"
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={onReset}
            className="w-full py-2 text-xs font-medium text-gray-500 bg-niebla hover:bg-piedra rounded-lg transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}
