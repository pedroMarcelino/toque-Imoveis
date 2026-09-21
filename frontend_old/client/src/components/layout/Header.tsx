import { useState } from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import Brand from "./Brand";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="container flex h-24 items-center justify-between">
        <Brand />
        <nav
          className={`${
            open ? "absolute left-5 right-5 top-20 flex" : "hidden md:flex"
          } items-center gap-8 rounded-2xl bg-white/95 p-5 text-sm font-semibold text-slate-600 shadow-xl md:static md:bg-transparent md:p-0 md:shadow-none`}
        >
          <Link href="/">
            <a className="hover:text-primary">Início</a>
          </Link>
          <Link href="/imoveis">
            <a className="hover:text-primary">Imóveis</a>
          </Link>
          <a href="#sobre" className="hover:text-primary">
            Nossa essência
          </a>
          <a href="#contato" className="hover:text-primary">
            Contato
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <a className="hidden rounded-full border border-white/60 bg-white/30 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur md:block">
              Área profissional
            </a>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-white/70 bg-white/50 p-2 md:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}