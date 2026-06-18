import { useState, useEffect, useCallback } from 'react'
import { loginWithGoogle, setAuthToken, getProfile, setUserRole } from '@proyecto/api-client'
import type { UserDTO } from '@proyecto/api-client'

interface AuthState {
  user: UserDTO | null
  isLoading: boolean
  error: string | null
  needsRole: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    needsRole: false,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      getProfile()
        .then((user) => setState({ user, isLoading: false, error: null, needsRole: !user.role }))
        .catch(() => {
          localStorage.removeItem('token')
          setAuthToken(null)
          setState({ user: null, isLoading: false, error: null, needsRole: false })
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
      setState({ user: res.user, isLoading: false, error: null, needsRole: !res.user.role })
    } catch (err) {
      setState({ user: null, isLoading: false, error: (err as Error).message, needsRole: false })
    }
  }, [])

  const setRole = useCallback(async (role: 'ARRIENDADOR' | 'ESTUDIANTE') => {
    const updated = await setUserRole(role)
    setState((s) => ({ ...s, user: updated, needsRole: false }))
    return updated
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setAuthToken(null)
    setState({ user: null, isLoading: false, error: null, needsRole: false })
  }, [])

  return { ...state, login, setRole, logout }
}
