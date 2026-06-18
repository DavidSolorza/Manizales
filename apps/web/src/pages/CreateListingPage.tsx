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
      <div style={{ maxWidth: 600, margin: '100px auto', textAlign: 'center' }}>
        <h2>Inicia sesión para publicar</h2>
        <GoogleLoginButton onSuccess={login} />
        <br />
        <Link to="/">Volver</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px' }}>
      <Link to="/" style={{ color: '#1976d2', marginBottom: 16, display: 'block' }}>&larr; Volver</Link>
      <h1>Publicar arriendo</h1>
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
