import { useState } from 'react'
import { Camera, MapPin } from 'lucide-react'
import type { CreateListingInput } from '@proyecto/api-client'
import { apiUpload } from '@proyecto/api-client'
import MapView from '../../map/components/MapView'

interface Props {
  onSubmit: (data: CreateListingInput) => Promise<void>
  isLoading: boolean
  disabled?: boolean
}

type Step = 'basicos' | 'fotos' | 'ubicacion'

export default function ListingForm({ onSubmit, isLoading, disabled }: Props) {
  const [step, setStep] = useState<Step>('basicos')
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

  const removeImage = (i: number) => setImageUrls((prev) => prev.filter((_, k) => k !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ title, description, price: parseFloat(price), type, bedrooms: parseInt(bedrooms), images: imageUrls, lat, lng, address, neighborhood })
  }

  const canGoNext = () => {
    if (step === 'basicos') return title && description && price && type
    if (step === 'fotos') return imageUrls.length > 0
    return true
  }

  const steps = [
    { key: 'basicos' as Step, label: 'Datos básicos', num: 1 },
    { key: 'fotos' as Step, label: 'Fotos', num: 2 },
    { key: 'ubicacion' as Step, label: 'Ubicación', num: 3 },
  ]
  const currentStepIndex = steps.findIndex((s) => s.key === step)

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6">
      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button type="button" onClick={() => setStep(s.key)}
              className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center transition-colors ${
                s.key === step ? 'bg-accent text-white' : i < currentStepIndex ? 'bg-accent/20 text-accent' : 'bg-bg text-sec'
              }`}>
              {s.num}
            </button>
            <span className={`text-xs ${s.key === step ? 'text-tinta font-medium' : 'text-sec'}`}>{s.label}</span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic data */}
      {step === 'basicos' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tinta mb-1">Título</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full px-3 py-2.5 text-sm bg-bg border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              placeholder="Ej: Habitación cerca a la universidad" />
          </div>
          <div>
            <label className="block text-sm font-medium text-tinta mb-1">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3}
              className="w-full px-3 py-2.5 text-sm bg-bg border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none resize-none"
              placeholder="Describe el lugar..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-tinta mb-1">Precio/mes</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min={1}
                className="w-full px-3 py-2.5 text-sm bg-bg border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-tinta mb-1">Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)} required
                className="w-full px-3 py-2.5 text-sm bg-bg border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none">
                <option value="">Seleccionar</option>
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="habitacion">Habitación</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-tinta mb-1">Habitaciones</label>
              <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required min={0}
                className="w-full px-3 py-2.5 text-sm bg-bg border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Photos */}
      {step === 'fotos' && (
        <div>
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent transition-colors bg-bg">
            <div className="text-center">
              <Camera size={28} className="mx-auto text-muted mb-1" />
              <span className="text-sm text-sec">{uploading ? 'Subiendo...' : 'Click para subir fotos'}</span>
            </div>
            <input type="file" accept="image/*" multiple onChange={handleFileUpload} disabled={uploading} className="hidden" />
          </label>
          {imageUrls.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              ))}
            </div>
          )}
          {imageUrls.length === 0 && <p className="text-xs text-sec mt-2">Necesitas al menos una foto para publicar</p>}
        </div>
      )}

      {/* Step 3: Location */}
      {step === 'ubicacion' && (
        <div className="space-y-4">
          <div className="h-64 rounded-lg overflow-hidden border border-border">
            <MapView listings={[]} onClick={(e) => { setLat(e.latlng.lat); setLng(e.latlng.lng) }} selectedPosition={[lat, lng]} />
          </div>
          <p className="text-xs text-sec -mt-3">Haz click en el mapa para marcar la ubicacion</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-tinta mb-1">Dirección</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} required
                className="w-full px-3 py-2.5 text-sm bg-bg border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-tinta mb-1">Barrio</label>
              <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required
                className="w-full px-3 py-2.5 text-sm bg-bg border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        {currentStepIndex > 0 ? (
          <button type="button" onClick={() => setStep(steps[currentStepIndex - 1].key)}
            className="px-4 py-2 text-sm text-sec border border-border rounded-lg hover:bg-bg transition-colors">
            Anterior
          </button>
        ) : <div />}
        {currentStepIndex < steps.length - 1 ? (
          <button type="button" onClick={() => canGoNext() && setStep(steps[currentStepIndex + 1].key)}
            disabled={!canGoNext() || disabled}
            className="px-6 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors">
            Siguiente
          </button>
        ) : (
          <button type="submit" disabled={isLoading || uploading || disabled}
            className="px-6 py-2 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors">
            {disabled ? 'Inicia sesion para publicar' : isLoading ? 'Publicando...' : 'Publicar'}
          </button>
        )}
      </div>
    </form>
  )
}
