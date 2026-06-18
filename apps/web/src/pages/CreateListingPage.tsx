import { useAuth, useCreateListing } from '@proyecto/hooks'
import ListingForm from '../features/listings/components/ListingForm'
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton'
import { Link, useNavigate } from 'react-router-dom'

export default function CreateListingPage() {
  const { user, login } = useAuth()
  const { submit, isLoading } = useCreateListing()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center bg-surface p-8 rounded-xl border border-border max-w-sm mx-4">
          <h2 className="text-xl font-display font-bold text-tinta mb-4">Inicia sesión para publicar</h2>
          <div className="flex justify-center"><GoogleLoginButton onSuccess={login} /></div>
          <Link to="/" className="text-accent hover:underline mt-6 inline-block text-sm">&larr; Volver</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-accent hover:underline mb-4 text-sm">&larr; Volver</Link>
        <h1 className="text-2xl font-display font-bold text-tinta mb-6">Publicar arriendo</h1>
        <ListingForm onSubmit={async (data) => { await submit(data); navigate('/') }} isLoading={isLoading} />
      </div>
    </div>
  )
}
