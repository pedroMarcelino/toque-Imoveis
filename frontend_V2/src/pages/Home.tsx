export default function Home() {
  return (
    <div>
      <section id="inicio" className="hero-grid bg-primary py-20 text-white">
        <div className="container">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-white/70">
            Imobiliária de confiança
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.04] tracking-[-.03em] sm:text-6xl lg:text-7xl">
            O seu próximo capítulo começa aqui.
          </h1>
          <p className="mt-6 text-base text-white/80 sm:text-lg">Home em construção — mobile first.</p>
        </div>
      </section>

      <section id="imoveis" className="py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">
            Destaques em breve
          </h2>
          <p className="mt-3 text-sm text-slate-500">Catálogo será construído no próximo passo.</p>
        </div>
      </section>

      <section id="sobre" className="py-16">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-semibold text-slate-900">Nossa essência</h2>
          <p className="mt-3 text-sm text-slate-500">Em construção.</p>
        </div>
      </section>
    </div>
  )
}