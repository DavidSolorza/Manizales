import { useState, useRef } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import type { CreateListingInput } from '@proyecto/api-client'
import { apiUpload } from '@proyecto/api-client'
import MapView from '../../map/components/MapView'

interface Props {
  onSubmit: (data: CreateListingInput) => Promise<void>
  isLoading: boolean
  disabled?: boolean
  studentMode?: boolean
}

export default function QuickListingForm({ onSubmit, isLoading, disabled, studentMode }: Props) {
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [lat, setLat] = useState(5.07)
  const [lng, setLng] = useState(-75.52)
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await apiUpload('/images/upload', file)
      setImageUrl(url)
    } catch {
      alert('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handlePublish = async () => {
    if (!imageUrl) return
    await onSubmit({
      title: studentMode ? 'Reporte estudiante' : 'Habitacion en Manizales',
      description: studentMode ? 'Lugar reportado por un estudiante' : 'Publicacion rapida',
      price: 300000,
      type: 'habitacion',
      bedrooms: 1,
      images: [imageUrl],
      lat,
      lng,
      address: 'Manizales',
      neighborhood: 'Manizales',
    })
  }

  const btnLabel = studentMode ? 'Enviar para revision' : 'Publicar rapido'
  const disabledLabel = studentMode ? 'Subi una foto primero' : 'Inicia sesion primero'

  return (
    <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
      <p className="text-sm text-sec">{studentMode ? 'Subi la foto del lugar que viste y marcala en el mapa' : 'Subi una foto del lugar, marca la ubicacion en el mapa y publicamos al instante'}</p>

      {imageUrl ? (
        <div className="relative h-40 rounded-lg overflow-hidden border border-border">
          <img src={imageUrl} alt="" className="w-full h-full object-contain" />
          <button onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 text-xs">X</button>
        </div>
      ) : (
        <div className="flex gap-3">
          <button onClick={() => cameraRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg border-border bg-bg hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer">
            <Camera size={28} className="text-muted mb-1" />
            <span className="text-xs text-sec">Tomar foto</span>
          </button>
          {!studentMode && (
            <button onClick={() => galleryRef.current?.click()}
              className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg border-border bg-bg hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" className="text-muted mb-1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span className="text-xs text-sec">Subir de galeria</span>
            </button>
          )}
          <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFile} disabled={uploading || disabled} className="hidden" />
          <input ref={galleryRef} type="file" accept="image/*" onChange={handleFile} disabled={uploading || disabled} className="hidden" />
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-sec">
          <Loader2 size={16} className="animate-spin" /> Subiendo foto...
        </div>
      )}

      <div>
        <label className="block text-xs text-sec mb-1">Ubicacion (opcional)</label>
        <div className="h-48 rounded-lg overflow-hidden border border-border">
          <MapView listings={[]} onClick={(e) => { setLat(e.latlng.lat); setLng(e.latlng.lng) }} selectedPosition={[lat, lng]} />
        </div>
      </div>

      <button
        onClick={handlePublish}
        disabled={!imageUrl || isLoading || disabled}
        className="w-full py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-hover disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
        {isLoading ? 'Enviando...' : !imageUrl ? disabledLabel : btnLabel}
      </button>
    </div>
  )
}
