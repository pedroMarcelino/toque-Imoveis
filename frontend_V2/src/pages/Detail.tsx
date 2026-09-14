export default function Detail({ id }: { id: string }) {
  return (
    <section className="py-16">
      <div className="container">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">Imóvel</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-slate-900 sm:text-5xl">
          Detalhe em construção
        </h1>
        <p className="mt-4 text-sm text-slate-500">Imóvel ID: {id}</p>
      </div>
    </section>
  )
}