import { axiosClient } from '../../../shared/api/axiosClient'

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  name: string
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>('/auth/login', payload)
  return response.data
}

export const register = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>('/auth/register', payload)
  return response.data
}
