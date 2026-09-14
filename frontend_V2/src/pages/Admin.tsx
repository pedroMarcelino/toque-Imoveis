import { useAuth } from '../hooks/useAuth'
import AuthForm from '../components/auth/AuthForm'
import AdminDashboard from './AdminDashboard'

export default function Admin() {
  const { user, isAuthenticated, setUser, logout } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="grid min-h-[calc(100dvh-4rem)] place-items-center bg-background px-5 py-20 sm:min-h-[calc(100dvh-5rem)]">
        <AuthForm onSuccess={setUser} />
      </div>
    )
  }

  return <AdminDashboard user={user!} logout={logout} />
}