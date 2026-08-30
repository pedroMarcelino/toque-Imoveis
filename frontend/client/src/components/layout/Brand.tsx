import { Link } from "wouter";
import { Building2 } from "lucide-react";

export default function Brand() {
  return (
    <Link href="/">
      <a className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-blue-900/20">
          <Building2 size={19} />
        </span>
        <span>
          <span className="block font-display text-xl font-semibold leading-none text-slate-900">
            Toque
          </span>
          <span className="block text-[10px] font-semibold uppercase tracking-[.25em] text-primary">
            Imóveis
          </span>
        </span>
      </a>
    </Link>
  );
}