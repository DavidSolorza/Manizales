import { apiRequest } from './http-client'

export interface LoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
    picture: string
  }
}

export async function loginWithGoogle(idToken: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/google', {
    method: 'POST',
    body: { idToken },
  })
}

export async function getProfile(): Promise<LoginResponse['user']> {
  return apiRequest<LoginResponse['user']>('/auth/profile')
}
