import { api, setToken, clearToken, getToken } from '../api/http'
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

function isTokenExpired(token: string): boolean {
  try {
    const base64 = token
      .split('.')[1]
      ?.replace(/-/g, '+')
      .replace(/_/g, '/')
    if (!base64) return true

    const payload = JSON.parse(atob(base64)) as { exp?: number }
    return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()
  } catch {
    return true
  }
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
  const token = getToken()
  if (token && isTokenExpired(token)) {
    logout()
    return null
  }

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