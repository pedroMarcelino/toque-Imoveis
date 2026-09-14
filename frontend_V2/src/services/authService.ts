import { api, setToken, clearToken } from '../api/http'
import type { AuthUser, RegisterInput, LoginInput } from '../types/auth'
import { authResponseSchema } from '../types/auth'
import { STORAGE_KEYS } from '../config'

function persistUser(user: AuthUser): AuthUser {
  try {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
  } catch {
    /* storage indisponível */
  }
  return user
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const data = await api.post<unknown>('/user/login', input)
  const parsed = authResponseSchema.parse(data)
  setToken(parsed.token)
  return persistUser(parsed.user)
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  const data = await api.post<unknown>('/user', input)
  const parsed = authResponseSchema.parse(data)
  setToken(parsed.token)
  return persistUser(parsed.user)
}

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function logout(): void {
  clearToken()
  try {
    localStorage.removeItem(STORAGE_KEYS.user)
  } catch {
    /* storage indisponível */
  }
}