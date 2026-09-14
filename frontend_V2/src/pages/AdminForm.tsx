export default function AdminForm({ id }: { id?: string }) {
  return (
    <section className="py-16">
      <div className="container text-center">
        <h1 className="font-display text-3xl font-semibold text-slate-900">
          Formulário em construção
        </h1>
        <p className="mt-4 text-sm text-slate-500">
          {id ? `Editando imóvel ${id}` : 'Criar/editar imóvel será implementado.'}
        </p>
      </div>
    </section>
  )
}