import { useCallback, useState } from 'react'
import { getUser, logout as clearSession } from '../services/authService'
import type { AuthUser } from '../types/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getUser())

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return {
    user,
    isAuthenticated: Boolean(user),
    setUser,
    logout,
  }
}