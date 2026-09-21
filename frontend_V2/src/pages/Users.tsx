import { ArrowLeft, Users, UserCheck } from 'lucide-react'
import { Link } from 'wouter'
import { toast } from 'sonner'
import { useUsers, useApproveUser } from '../hooks/useUsers'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export default function UsersPage() {
  const { data: users, isLoading } = useUsers()
  const approveUser = useApproveUser()

  const handleApprove = (id: string) => {
    approveUser.mutate(id, {
      onSuccess: () => toast.success('Usuário aprovado'),
      onError: (error) => toast.error(error instanceof Error ? error.message : 'Erro ao aprovar'),
    })
  }

  return (
    <section className="py-10 sm:py-16">
      <div className="container max-w-3xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <ArrowLeft size={16} /> Voltar ao painel
        </Link>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">Área profissional</p>
          <h1 className="mt-2 flex items-center gap-2 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
            <Users size={28} className="text-primary" /> Usuários
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {isLoading
              ? 'Carregando usuários…'
              : `${(users ?? []).filter((u) => !u.isApproved).length} ${
                  (users ?? []).filter((u) => !u.isApproved).length === 1 ? 'pendente' : 'pendentes'
                } de aprovação`}
          </p>
        </div>

        <Card className="mt-6 p-5 sm:p-6">
          <p className="mb-4 text-sm text-slate-500">
            Aprove os usuários que criarão imóveis na área profissional.
          </p>

          <div className="flex flex-col gap-2">
            {isLoading ? (
              <p className="py-2 text-sm text-slate-400">Carregando usuários…</p>
            ) : users && users.length > 0 ? (
              users.map((registered) => (
                <div
                  key={registered._id}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {(registered.name || registered.email)[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {registered.name || registered.email}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {registered.email}
                        {registered.createdAt &&
                          ` · criado em ${new Date(registered.createdAt).toLocaleDateString('pt-BR')}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                    <Badge variant={registered.isApproved ? 'secondary' : 'outline'}>
                      {registered.isApproved ? 'Aprovado' : 'Pendente'}
                    </Badge>
                    {!registered.isApproved && (
                      <Button
                        onClick={() => handleApprove(registered._id)}
                        disabled={approveUser.isPending}
                        className="h-9 px-4"
                      >
                        <UserCheck size={14} /> Aprovar
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="py-2 text-sm text-slate-400">Nenhum usuário cadastrado.</p>
            )}
          </div>
        </Card>
      </div>
    </section>
  )
}