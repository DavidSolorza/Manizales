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
  const [lat, setLat] = useState(4.711)
  const [lng, setLng] = useState(-74.072)
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
    } catch (err) {
      alert('Error al subir imagen: ' + (err as Error).message)
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
      title,
      description,
      price: parseFloat(price),
      type,
      bedrooms: parseInt(bedrooms),
      images: imageUrls,
      lat,
      lng,
      address,
      neighborhood,
    })
  }

  const handleMapClick = (e: { latlng: { lat: number; lng: number } }) => {
    setLat(e.latlng.lat)
    setLng(e.latlng.lng)
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Título</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Precio/mes</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min={1} style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Tipo</label>
          <select value={type} onChange={(e) => setType(e.target.value)} required style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}>
            <option value="">Seleccionar</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="habitacion">Habitación</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Habitaciones</label>
          <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required min={0} style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Imágenes</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ marginBottom: 8 }}
        />
        {uploading && <p style={{ color: '#666' }}>Subiendo imagen...</p>}
        {imageUrls.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {imageUrls.map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={url} alt="" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }} />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{ position: 'absolute', top: -8, right: -8, background: '#d32f2f', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 14 }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Ubicación (haz clic en el mapa)</label>
        <div style={{ height: 300 }}>
          <MapView
            listings={[]}
            onClick={handleMapClick}
            selectedPosition={[lat, lng]}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Dirección</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} required style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Barrio</label>
          <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} required style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || uploading || imageUrls.length === 0}
        style={{
          width: '100%',
          padding: '12px',
          background: isLoading || uploading || imageUrls.length === 0 ? '#ccc' : '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: isLoading || uploading || imageUrls.length === 0 ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
        }}
      >
        {uploading ? 'Subiendo imágenes...' : isLoading ? 'Publicando...' : 'Publicar'}
      </button>
    </form>
  )
}
