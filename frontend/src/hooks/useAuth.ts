import { useCallback, useEffect, useState } from 'react'
import { getUser, logout as clearSession } from '../services/authService'
import { SESSION_EXPIRED_EVENT } from '../config'
import type { AuthUser } from '../types/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => getUser())

  useEffect(() => {
    const handleSessionExpired = () => setUser(null)
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [])

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