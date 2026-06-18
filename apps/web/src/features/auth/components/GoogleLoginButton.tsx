import { useCallback } from 'react'

interface Props {
  onSuccess: (idToken: string) => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void
          renderButton: (el: HTMLElement, options: { theme: string; size: string; text?: string }) => void
        }
      }
    }
  }
}

export default function GoogleLoginButton({ onSuccess }: Props) {
  const buttonRef = useCallback((node: HTMLDivElement | null) => {
    if (node && window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (res) => onSuccess(res.credential),
      })
      window.google.accounts.id.renderButton(node, { theme: 'outline', size: 'large', text: 'signin_with' })
    }
  }, [onSuccess])

  return <div ref={buttonRef} />
}
