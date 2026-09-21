import { Link } from 'wouter'

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="container text-center">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">Erro 404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900">
          Página não encontrada
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          O endereço que você tentou acessar não existe.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-7 text-sm font-semibold text-white"
        >
          Voltar ao início
        </Link>
      </div>
    </section>
  )
}