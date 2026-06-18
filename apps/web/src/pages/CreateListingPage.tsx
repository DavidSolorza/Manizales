import { useState } from 'react'
import { useAuth, useCreateListing } from '@proyecto/hooks'
import ListingForm from '../features/listings/components/ListingForm'
import QuickListingForm from '../features/listings/components/QuickListingForm'
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton'
import { useToast } from '../features/ui/components/Toast'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, MapPin } from 'lucide-react'

export default function CreateListingPage() {
  const { user, login } = useAuth()
  const { submit, isLoading } = useCreateListing()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState<{ status: string; id?: string } | null>(null)

  const doSubmit = async (data: Parameters<typeof submit>[0]) => {
    const res = await submit(data) as any
    if (res.duplicate) {
      toast('Este lugar ya esta publicado!', 'info')
      navigate(`/listings/${res.existingId}`)
      return
    }
    const isStudent = user?.role === 'ESTUDIANTE'
    if (isStudent) {
      setSubmitted({ status: 'pending' })
      toast('Foto enviada para revision', 'success')
    } else {
      toast('Publicado con exito!', 'success')
      navigate('/')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center pt-20 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-accent" />
          </div>
          <h2 className="text-xl font-display font-bold text-tinta">Gracias por tu aporte!</h2>
          <p className="text-sm text-sec mt-2 max-w-sm mx-auto">
            Tu foto fue enviada para revision. Si el lugar es nuevo, el administrador lo va a publicar pronto.
          </p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-accent hover:underline mb-4 text-sm">&larr; Volver</Link>

        {!user ? (
          <>
            <h1 className="text-2xl font-display font-bold text-tinta mb-4">Publicar arriendo</h1>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-amber-800 font-medium">Inicia sesion con Google</p>
              <div className="scale-90 origin-right"><GoogleLoginButton onSuccess={login} /></div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-display font-bold text-tinta mb-1">
              {user.role === 'ESTUDIANTE' ? 'Reportar un lugar' : 'Publicar arriendo'}
            </h1>
            {user.role === 'ESTUDIANTE' && (
              <p className="text-sm text-sec mb-4 flex items-center gap-1.5">
                <MapPin size={14} /> Subi una foto de un lugar que viste y nosotros lo publicamos
              </p>
            )}

            {user.role === 'ESTUDIANTE' ? (
              <QuickListingForm onSubmit={doSubmit} isLoading={isLoading} disabled={false} studentMode />
            ) : (
              <ListingForm onSubmit={doSubmit} isLoading={isLoading} disabled={false} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
