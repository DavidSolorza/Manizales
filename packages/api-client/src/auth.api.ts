import { apiRequest } from './http-client'

export interface UserDTO {
  id: string
  name: string
  email: string
  picture: string
  role: 'ARRIENDADOR' | 'ESTUDIANTE' | null
}

export interface LoginResponse {
  token: string
  user: UserDTO
}

export async function loginWithGoogle(idToken: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/google', {
    method: 'POST',
    body: { idToken },
  })
}

export async function getProfile(): Promise<UserDTO> {
  return apiRequest<UserDTO>('/auth/profile')
}

export async function setUserRole(role: string): Promise<UserDTO> {
  return apiRequest<UserDTO>('/auth/role', {
    method: 'PATCH',
    body: { role },
  })
}
