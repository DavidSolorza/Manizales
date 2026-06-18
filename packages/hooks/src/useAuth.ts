import { useState, useEffect, useCallback } from 'react'
import { loginWithGoogle, setAuthToken, getProfile } from '@proyecto/api-client'

interface User {
  id: string
  name: string
  email: string
  picture: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      getProfile()
        .then((user) => setState({ user, isLoading: false, error: null }))
        .catch(() => {
          localStorage.removeItem('token')
          setAuthToken(null)
          setState({ user: null, isLoading: false, error: null })
        })
    } else {
      setState((s: AuthState) => ({ ...s, isLoading: false }))
    }
  }, [])

  const login = useCallback(async (idToken: string) => {
    setState((s: AuthState) => ({ ...s, isLoading: true, error: null }))
    try {
      const res = await loginWithGoogle(idToken)
      localStorage.setItem('token', res.token)
      setAuthToken(res.token)
      setState({ user: res.user, isLoading: false, error: null })
    } catch (err) {
      setState({ user: null, isLoading: false, error: (err as Error).message })
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setAuthToken(null)
    setState({ user: null, isLoading: false, error: null })
  }, [])

  return { ...state, login, logout }
}
