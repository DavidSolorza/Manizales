import { useState } from 'react'
import { useAuth, useCreateListing } from '@proyecto/hooks'
import ListingForm from '../features/listings/components/ListingForm'
import QuickListingForm from '../features/listings/components/QuickListingForm'
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton'
import { useToast } from '../features/ui/components/Toast'
import { Link, useNavigate } from 'react-router-dom'

type Mode = 'rapido' | 'completo'

export default function CreateListingPage() {
  const { user, login } = useAuth()
  const { submit, isLoading } = useCreateListing()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('rapido')

  const doSubmit = async (data: Parameters<typeof submit>[0]) => {
    await submit(data)
    toast('Publicado con exito!', 'success')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-accent hover:underline mb-4 text-sm">&larr; Volver</Link>
        <h1 className="text-2xl font-display font-bold text-tinta mb-4">Publicar arriendo</h1>

        {!user && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-amber-800 font-medium">Inicia sesion con Google para poder publicar</p>
            <div className="scale-90 origin-right"><GoogleLoginButton onSuccess={login} /></div>
          </div>
        )}

        {/* Mode selector */}
        <div className="flex gap-2 mb-6 bg-bg rounded-xl p-1 border border-border w-fit">
          <button onClick={() => setMode('rapido')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'rapido' ? 'bg-surface text-tinta shadow-sm' : 'text-sec hover:text-tinta'}`}>
            Rapido (solo foto)
          </button>
          <button onClick={() => setMode('completo')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'completo' ? 'bg-surface text-tinta shadow-sm' : 'text-sec hover:text-tinta'}`}>
            Completo
          </button>
        </div>

        {mode === 'rapido' ? (
          <QuickListingForm onSubmit={doSubmit} isLoading={isLoading} disabled={!user} />
        ) : (
          <ListingForm onSubmit={doSubmit} isLoading={isLoading} disabled={!user} />
        )}
      </div>
    </div>
  )
}
