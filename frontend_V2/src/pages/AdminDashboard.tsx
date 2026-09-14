import type { AuthUser } from '../types/auth'
import { Button } from '../components/ui/Button'

export default function AdminDashboard({ user, logout }: { user: AuthUser; logout: () => void }) {
  return (
    <section className="py-16">
      <div className="container text-center">
        <h1 className="font-display text-3xl font-semibold text-slate-900">
          Painel em construção
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          Olá, {user.name || user.email}. Gestão de imóveis será implementada.
        </p>
        <Button variant="ghost" size="md" onClick={logout} className="mt-6">
          Sair
        </Button>
      </div>
    </section>
  )
}