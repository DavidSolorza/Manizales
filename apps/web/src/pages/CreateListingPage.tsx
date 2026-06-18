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
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Inicia sesión para publicar</h2>
        <div className="flex justify-center">
          <GoogleLoginButton onSuccess={login} />
        </div>
        <Link to="/" className="text-blue-600 hover:text-blue-800 mt-6 inline-block text-sm">
          &larr; Volver
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 text-sm font-medium">
        &larr; Volver
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Publicar arriendo</h1>
      <ListingForm
        onSubmit={async (data) => {
          await submit(data)
          navigate('/')
        }}
        isLoading={isLoading}
      />
    </div>
  )
}
