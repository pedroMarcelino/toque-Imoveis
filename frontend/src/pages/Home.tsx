import { useState } from 'react'
import { keepPreviousData } from '@tanstack/react-query'
import {
  AlertTriangle,
  Building2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { useProperties } from '../hooks/useProperties'
import type { PropertyFilters } from '../types/property'
import PropertyCard from '../components/property/PropertyCard'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { cn } from '../lib/cn'

const PAGE_SIZE = 9

export default function Home() {
  const [filters, setFilters] = useState<PropertyFilters>({
    search: '',
    tipo: '',
    finalidade: '',
    cidade: '',
    minPreco: undefined,
    maxPreco: undefined,
    status: 'disponivel',
    page: 1,
    pageSize: PAGE_SIZE,
  })
  const [filtersOpen, setFiltersOpen] = useState(false)

  const query = useProperties(filters, { placeholderData: keepPreviousData })

  const data = query.data
  const properties = data?.properties ?? []
  const total = data?.total ?? 0
  const page = data?.page ?? filters.page ?? 1
  const pageSize = data?.pageSize ?? PAGE_SIZE
  const totalPages = Math.max(Math.ceil(total / pageSize), 1)

  const update = (patch: Partial<PropertyFilters>) =>
    setFilters((f) => ({ ...f, ...patch, page: 1 }))

  const activeFilters = [
    filters.search,
    filters.tipo,
    filters.finalidade,
    filters.cidade,
    filters.minPreco,
    filters.maxPreco,
  ].filter((v) => v !== undefined && v !== '').length

  const goPage = (p: number) =>
    setFilters((f) => ({ ...f, page: Math.min(Math.max(p, 1), totalPages) }))

  return (
    <div>
      <section className="relative min-h-[520px] overflow-hidden bg-primary text-white sm:min-h-[600px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_15%,rgba(255,255,255,.14),transparent_38%)]" />
        <div className="animate-blob absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="animate-blob-2 absolute bottom-[-80px] right-[5%] h-80 w-80 rounded-full bg-blue-300/25 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-sweep absolute -top-10 left-0 h-72 w-2/3 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent blur-2xl" />
        </div>
        <div className="hero-grid hero-grid-animated hero-grid-strong absolute inset-0 opacity-50" />
        <div className="container relative flex min-h-[520px] items-center py-16 sm:min-h-[600px]">
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-white/70">
              <Sparkles size={15} /> Curadoria imobiliária com propósito
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-[-.03em] sm:text-6xl">
              O seu próximo <em className="font-normal text-white/80">capítulo</em>{' '}
              começa aqui.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
              Casas com personalidade, espaços que acolhem e uma equipe que
              conhece cada detalhe para tornar a sua escolha mais simples.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-white" /> Negócio seguro
              </span>
              <span className="flex items-center gap-2">
                <Check size={17} className="text-white" /> Acompanhamento próximo
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="imoveis" className="py-16">
        <div className="container">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">
                Catálogo
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                Encontre o seu espaço.
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              {query.isLoading ? 'Carregando…' : `${total} ${total === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}`}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setFiltersOpen((o) => !o)}
            className="mb-4 w-full justify-between md:hidden"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-primary" />
              Filtros
              {activeFilters > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                  {activeFilters}
                </span>
              )}
            </span>
            <ChevronDown size={16} className={cn('transition-transform', filtersOpen && 'rotate-180')} />
          </Button>

          <div
            className={cn(
              'mb-8 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm md:grid-cols-5',
              filtersOpen ? 'grid' : 'hidden md:grid',
            )}
          >
            <div className="flex items-center gap-2 md:col-span-5">
              <SlidersHorizontal size={16} className="text-primary" />
              <span className="text-sm font-bold text-slate-600">Filtros</span>
            </div>
            <Input
              placeholder="Buscar por título, bairro ou cidade"
              value={filters.search ?? ''}
              onChange={(e) => update({ search: e.target.value })}
            />
            <select
              value={filters.finalidade ?? ''}
              onChange={(e) => update({ finalidade: e.target.value })}
              className="h-11 rounded-2xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Finalidade</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>
            <select
              value={filters.tipo ?? ''}
              onChange={(e) => update({ tipo: e.target.value })}
              className="h-11 rounded-2xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Tipo de imóvel</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
              <option value="chacara">Chácara</option>
              <option value="sobrado">Sobrado</option>
            </select>
            <Input
              placeholder="Cidade"
              value={filters.cidade ?? ''}
              onChange={(e) => update({ cidade: e.target.value })}
            />
            <Input
              placeholder="Preço mínimo"
              type="number"
              value={filters.minPreco ?? ''}
              onChange={(e) =>
                update({ minPreco: e.target.value ? Number(e.target.value) : undefined })
              }
            />
            <Input
              placeholder="Preço máximo"
              type="number"
              value={filters.maxPreco ?? ''}
              onChange={(e) =>
                update({ maxPreco: e.target.value ? Number(e.target.value) : undefined })
              }
            />
          </div>

          {query.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          ) : query.isError ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <AlertTriangle className="mx-auto text-red-500" size={28} />
              <p className="mt-3 text-sm text-slate-600">
                Não foi possível carregar os imóveis.
              </p>
              <Button onClick={() => query.refetch()} className="mt-4">
                Tentar novamente
              </Button>
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <Building2 className="mx-auto size-9 text-muted-foreground" />
              <h3 className="mt-4 font-display text-xl font-semibold text-slate-900">
                Nenhum imóvel encontrado
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Ajuste os filtros ou cadastre imóveis na área profissional para
                montar o catálogo.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => goPage(page - 1)} disabled={page <= 1}>
                <ChevronLeft size={16} /> Anterior
              </Button>
              <span className="text-sm font-semibold text-slate-600">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => goPage(page + 1)}
                disabled={page >= totalPages}
              >
                Próxima <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      </section>

      <section id="sobre" className="border-t border-border bg-white py-16">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">
              Nossa essência
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              A escolha certa para cada história.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              Acreditamos que encontrar um imóvel vai muito além de metros
              quadrados. É sobre enxergar o potencial de cada espaço e unir
              sonhos aos lugares certos, com transparência e segurança em cada
              etapa.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="font-display text-3xl font-semibold text-primary">100%</p>
              <p className="mt-1 text-sm text-slate-500">Acompanhamento dedicado</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="font-display text-3xl font-semibold text-primary">Curadoria</p>
              <p className="mt-1 text-sm text-slate-500">Imóveis verificados</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}