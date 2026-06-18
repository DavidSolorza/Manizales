import { useState } from 'react'
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

      <label className={`flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${imageUrl ? 'border-accent bg-accent/5' : 'border-border bg-bg hover:border-accent'}`}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-full object-contain" />
        ) : (
          <div className="text-center">
            <Camera size={32} className="mx-auto text-muted mb-2" />
            <span className="text-sm text-sec">{uploading ? 'Subiendo...' : 'Tocar para subir foto'}</span>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading || disabled} className="hidden" />
      </label>

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
