import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'wouter'
import { Menu, X } from 'lucide-react'
import { cn } from '../../lib/cn'

const NAV_ITEMS = [
  { label: 'Início', href: '/' },
  { label: 'Imóveis', href: '/imoveis' },
  { label: 'Nossa essência', href: '/#sobre' },
  { label: 'Contato', href: '/#contato' },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex size-11 items-center justify-center rounded-xl border border-white/70 bg-white/50 backdrop-blur md:hidden"
        aria-label="Abrir menu"
        type="button"
      >
        <Menu size={20} />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div
              className={cn(
                'absolute inset-y-0 right-0 flex w-[80%] max-w-sm flex-col gap-2 overflow-y-auto bg-white p-6 pt-24 shadow-2xl'
              )}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-5 top-5 inline-flex size-11 items-center justify-center rounded-xl bg-muted"
                aria-label="Fechar menu"
                type="button"
              >
                <X size={20} />
              </button>
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-muted hover:text-primary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-white"
              >
                Área profissional
              </Link>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}