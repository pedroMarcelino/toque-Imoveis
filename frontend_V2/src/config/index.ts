export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000'

export const STORAGE_KEYS = {
  token: 'toque.token',
  user: 'toque.user',
} as const

export const SESSION_EXPIRED_EVENT = 'toque:session-expired'

export { CONTACT } from './contact'