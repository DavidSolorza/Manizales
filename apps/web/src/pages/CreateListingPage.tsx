import { useAuth, useCreateListing } from '@proyecto/hooks'
import ListingForm from '../features/listings/components/ListingForm'
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton'
import { Link, useNavigate } from 'react-router-dom'

export default function CreateListingPage() {
  const { user, login, isLoading: authLoading } = useAuth()
  const { submit, isLoading } = useCreateListing()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-accent hover:underline mb-4 text-sm">&larr; Volver</Link>
        <h1 className="text-2xl font-display font-bold text-tinta mb-6">Publicar arriendo</h1>

        {!user && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-amber-800 font-medium">Inicia sesión con Google para poder publicar</p>
            <div className="scale-90 origin-right"><GoogleLoginButton onSuccess={login} /></div>
          </div>
        )}

        <ListingForm
          onSubmit={async (data) => { await submit(data); navigate('/') }}
          isLoading={isLoading}
          disabled={!user}
        />
      </div>
    </div>
  )
}
