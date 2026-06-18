import { useState } from 'react'
import type { CreateListingInput } from '@proyecto/api-client'
import { apiUpload } from '@proyecto/api-client'
import MapView from '../../map/components/MapView'

interface Props {
  onSubmit: (data: CreateListingInput) => Promise<void>
  isLoading: boolean
}

export default function ListingForm({ onSubmit, isLoading }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('')
  const [bedrooms, setBedrooms] = useState('1')
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [lat, setLat] = useState(5.07)
  const [lng, setLng] = useState(-75.52)
  const [address, setAddress] = useState('')
  const [neighborhood, setNeighborhood] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const { url } = await apiUpload('/images/upload', file)
        setImageUrls((prev) => [...prev, url])
      }
    } catch {
      alert('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      title, description, price: parseFloat(price), type,
      bedrooms: parseInt(bedrooms), images: imageUrls,
      lat, lng, address, neighborhood,
    })
  }

  const handleMapClick = (e: { latlng: { lat: number; lng: number } }) => {
    setLat(e.latlng.lat)
    setLng(e.latlng.lng)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-piedra/50 p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium text-tinta mb-1">Título</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required
          className="w-full px-3 py-2.5 text-sm bg-niebla border border-piedra rounded-lg focus:ring-2 focus:ring-musgo focus:border-musgo outline-none"
          placeholder="Ej: Habitación cerca a la universidad" />
      </div>

      <div>
        <label className="block text-sm font-medium text-tinta mb-1">Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
          className="w-full px-3 py-2.5 text-sm bg-niebla border border-piedra rounded-lg focus:ring-2 focus:ring-musgo focus:border-musgo outline-none resize-none"
          placeholder="Describe el lugar, amenities, condiciones..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-tinta mb-1">Precio/mes</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min={1}
            className="w-full px-3 py-2.5 text-sm bg-niebla border border-piedra rounded-lg focus:ring-2 focus:ring-musgo focus:border-musgo outline-none font-mono"
            placeholder="$ 500,000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta mb-1">Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)} required
            className="w-full px-3 py-2.5 text-sm bg-niebla border border-piedra rounded-lg focus:ring-2 focus:ring-musgo focus:border-musgo outline-none">
            <option value="">Seleccionar</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="habitacion">Habitación</option>
            <option value="apartaestudio">Apartaestudio</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta mb-1">Habitaciones</label>
          <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required min={0}
            className="w-full px-3 py-2.5 text-sm bg-niebla border border-piedra rounded-lg focus:ring-2 focus:ring-musgo focus:border-musgo outline-none" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-tinta mb-1">Imágenes</label>
        <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-piedra rounded-lg cursor-pointer hover:border-musgo transition-colors bg-niebla">
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-4m0 0V8m0 4h4m-4 0H8m12 0a8 8 0 11-16 0 8 8 0 0116 0z" />
            </svg>
            <span className="text-xs text-gray-500 mt-1 block">{uploading ? 'Subiendo...' : 'Click para subir fotos'}</span>
          </div>
          <input type="file" accept="image/*" multiple onChange={handleFileUpload} disabled={uploading} className="hidden" />
        </label>
        {imageUrls.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-cereza text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">x</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tinta mb-1">Ubicación</label>
        <div className="h-64 rounded-lg overflow-hidden border border-piedra">
          <MapView listings={[]} onClick={handleMapClick} selectedPosition={[lat, lng]} />
        </div>
        <p className="text-xs text-gray-400 mt-1">Haz clic en el mapa para marcar la ubicación</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-tinta mb-1">Dirección</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} required
            className="w-full px-3 py-2.5 text-sm bg-niebla border border-piedra rounded-lg focus:ring-2 focus:ring-musgo focus:border-musgo outline-none"
            placeholder="Calle 123 # 45-67" />
        </div>
        <div>
          <label className="block text-sm font-medium text-tinta mb-1">Barrio</label>
          <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required
            className="w-full px-3 py-2.5 text-sm bg-niebla border border-piedra rounded-lg focus:ring-2 focus:ring-musgo focus:border-musgo outline-none"
            placeholder="Ej: La Castellana" />
        </div>
      </div>

      <button type="submit" disabled={isLoading || uploading || imageUrls.length === 0}
        className="w-full py-3 bg-musgo text-white font-medium rounded-lg hover:bg-musgo/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-body">
        {uploading ? 'Subiendo imágenes...' : isLoading ? 'Publicando...' : 'Publicar arriendo'}
      </button>
    </form>
  )
}
