import Brand from "./Brand";
import { CONTACT } from "@/lib/constants";

export default function Footer() {
  return (
    <footer id="contato" className="bg-slate-950 py-14 text-white">
      <div className="container grid gap-10 rounded-none md:grid-cols-[1.4fr_1fr_1fr] md:items-start">
        <div>
          <Brand />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
            Imobiliária de confiança para escolhas que ficam.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-slate-500">
            Visite-nos
          </p>
          <p className="text-sm leading-7 text-slate-300">
            {CONTACT.address}
            <br />
            {CONTACT.city}
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-slate-500">
            Fale conosco
          </p>
          <p className="text-sm leading-7 text-slate-300">
            {CONTACT.phone}
            <br />
            {CONTACT.email}
          </p>
          <div className="mt-4 flex gap-4 text-sm font-semibold text-blue-300">
            <a href={CONTACT.socials.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={CONTACT.socials.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href={CONTACT.socials.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="container mt-12 border-t border-white/10 pt-5 text-xs text-slate-500">
        © 2026 Toque Imóveis. Todos os direitos reservados.
      </div>
    </footer>
  );
}