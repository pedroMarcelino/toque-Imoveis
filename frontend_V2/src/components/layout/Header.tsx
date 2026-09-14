import { Link } from 'wouter'
import Brand from './Brand'
import MobileMenu from './MobileMenu'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Brand />
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/" className="hover:text-primary">
            Início
          </Link>
          <Link href="/imoveis" className="hover:text-primary">
            Imóveis
          </Link>
          <a href="/#sobre" className="hover:text-primary">
            Nossa essência
          </a>
          <a href="/#contato" className="hover:text-primary">
            Contato
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="hidden rounded-full border border-white/60 bg-card px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm md:block"
          >
            Área profissional
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}