import { useState } from 'react'
import { Link } from 'wouter'
import { Plus, Pencil, Trash2, LogOut, AlertTriangle, Building2, Users, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import type { AuthUser } from '../types/auth'
import type { Property } from '../types/property'
import { fallbackImages } from '../types/property'
import { useProperties, useDeleteProperty } from '../hooks/useProperties'
import { useUsers, useApproveUser } from '../hooks/useUsers'
import { label, stableIndex } from '../lib/labels'
import { formatBRL } from '../lib/formatBRL'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

function statusVariant(status: string): 'primary' | 'secondary' | 'outline' {
  if (status === 'disponivel') return 'primary'
  if (status === 'vendido' || status === 'alugado') return 'secondary'
  return 'outline'
}

function PropertyCard({
  property,
  onDelete,
}: {
  property: Property
  onDelete: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const cover = property.images[0]?.url ?? fallbackImages[stableIndex(property._id, fallbackImages.length)]

  const handleDelete = () => {
    if (!confirming) {
      setConfirming(true)
      window.setTimeout(() => setConfirming(false), 3500)
      return
    }
    onDelete(property._id)
    setConfirming(false)
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
        <img
          src={cover}
          alt={property.title}
          className="size-full object-cover transition duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">{property.title}</h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {property.address.neighborhood} · {property.address.city} / {property.address.state}
            </p>
          </div>
          <Badge variant={statusVariant(property.status)}>{label(property.status)}</Badge>
        </div>

        <p className="font-display text-lg font-semibold text-primary">{formatBRL(property.price)}</p>

        <div className="mt-auto flex items-center gap-2 pt-1">
          <Link
            href={`/admin/editar/${property._id}`}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary"
          >
            <Pencil size={15} /> Editar
          </Link>
          <Button
            variant={confirming ? 'secondary' : 'outline'}
            size="md"
            onClick={handleDelete}
            className={confirming ? 'flex-1 text-red-600' : 'flex-1'}
          >
            {confirming ? (
              <>
                <AlertTriangle size={15} /> Confirmar
              </>
            ) : (
              <>
                <Trash2 size={15} /> Excluir
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default function AdminDashboard({ user, logout }: { user: AuthUser; logout: () => void }) {
  const { data, isLoading, isError, refetch } = useProperties({ status: 'todos', pageSize: 50 })
  const deleteProperty = useDeleteProperty()
  const { data: users, isLoading: usersLoading } = useUsers()
  const approveUser = useApproveUser()

  const handleDelete = (id: string) => {
    deleteProperty.mutate(id, {
      onSuccess: () => toast.success('Imóvel excluído'),
      onError: (error) => toast.error(error instanceof Error ? error.message : 'Erro ao excluir'),
    })
  }

  const handleApprove = (id: string) => {
    approveUser.mutate(id, {
      onSuccess: () => toast.success('Usuário aprovado'),
      onError: (error) => toast.error(error instanceof Error ? error.message : 'Erro ao aprovar'),
    })
  }

  return (
    <section className="py-10 sm:py-16">
      <div className="container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">Área profissional</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Olá, {user.name || user.email.split('@')[0]}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isLoading
                ? 'Carregando imóveis…'
                : data
                  ? `${data.total} ${data.total === 1 ? 'imóvel cadastrado' : 'imóveis cadastrados'}`
                  : 'Gerencie seus imóveis'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="md" variant="outline" onClick={logout} className="flex-1 sm:flex-none">
              <LogOut size={15} /> Sair
            </Button>
            <Link
              href="/admin/novo"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-900/20 hover:bg-primary/90 sm:flex-none"
            >
              <Plus size={16} /> Novo imóvel
            </Link>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-slate-900">
                <Users size={20} className="text-primary" /> Usuários
              </h2>
              <Badge variant="secondary">
                {usersLoading ? '…' : `${(users ?? []).filter((u) => !u.isApproved).length} pendentes`}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Aprove os usuários que criarão imóveis na área profissional.
            </p>

            <div className="mt-4 flex flex-col gap-2">
              {usersLoading ? (
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

        <div className="mt-8 sm:mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="aspect-[16/10] bg-muted" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-2/3 rounded-full bg-muted" />
                    <div className="h-3 w-1/2 rounded-full bg-muted" />
                    <div className="h-6 w-1/3 rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <AlertTriangle className="mx-auto text-red-500" size={28} />
              <p className="mt-3 text-sm text-slate-600">Não foi possível carregar os imóveis.</p>
              <Button size="md" onClick={() => refetch()} className="mt-4">
                Tentar novamente
              </Button>
            </div>
          ) : data && data.properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.properties.map((property) => (
                <PropertyCard key={property._id} property={property} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <Building2 className="mx-auto text-muted-foreground" size={36} />
              <h2 className="mt-4 font-display text-2xl font-semibold text-slate-900">
                Nenhum imóvel cadastrado
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Comece criando o primeiro imóvel do catálogo.
              </p>
              <Link
                href="/admin/novo"
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-900/20 hover:bg-primary/90"
              >
                <Plus size={16} /> Criar imóvel
              </Link>
            </div>
          )}
        </div>

        </div>
    </section>
  )
}