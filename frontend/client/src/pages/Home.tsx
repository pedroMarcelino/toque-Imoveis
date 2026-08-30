import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Check, ShieldCheck, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/property/SearchBar";
import PropertyCard from "@/components/property/PropertyCard";
import { getProperties } from "@/lib/properties";
import { fallbackImages } from "@/lib/constants";

export default function Home() {
  const [, setLocation] = useLocation();

  const featured = useQuery({
    queryKey: ["featured"],
    queryFn: () => getProperties({ page: 1, pageSize: 3 }),
  });

  const properties = featured.data?.properties ?? [];

  return (
    <div>
      <section className="relative min-h-[720px] overflow-hidden bg-[#dcecf3]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(255,255,255,.8),transparent_32%),linear-gradient(110deg,#eef7f8_0%,#dcecf3_50%,#b6d4e1_100%)]" />
        <div className="absolute right-[-8%] top-24 h-[580px] w-[62%] rounded-[48%] bg-white/45 blur-3xl" />
        <div className="hero-grid absolute inset-0 opacity-40" />
        <Header />
        <div className="container relative flex min-h-[720px] items-center pt-24">
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-primary">
              <Sparkles size={15} /> Curadoria imobiliária com propósito
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.04] tracking-[-.03em] text-slate-900 sm:text-7xl">
              O seu próximo <em className="font-normal text-primary">capítulo</em>{" "}
              começa aqui.
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-600">
              Casas com personalidade, espaços que acolhem e uma equipe que
              conhece cada detalhe para tornar a sua escolha mais simples.
            </p>
            <div className="mt-10 max-w-xl">
              <SearchBar
                onSearch={(v) =>
                  setLocation(`/imoveis?search=${encodeURIComponent(v)}`)
                }
              />
            </div>
            <div className="mt-8 flex items-center gap-5 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-primary" /> Negócio seguro
              </span>
              <span className="flex items-center gap-2">
                <Check size={17} className="text-primary" /> Acompanhamento próximo
              </span>
            </div>
          </div>
          <div className="absolute bottom-[-80px] right-[-40px] hidden h-[520px] w-[520px] overflow-hidden rounded-[48%_52%_45%_55%] border-[18px] border-white/40 shadow-2xl lg:block">
            <img
              src={fallbackImages[0]}
              className="h-full w-full object-cover"
              alt="Interior elegante"
            />
          </div>
        </div>
      </section>

      <section id="imoveis" className="container py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">
              Seleção
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-slate-900">
              Imóveis em destaque
            </h2>
          </div>
          <a
            href="/imoveis"
            className="text-sm font-bold text-primary hover:text-slate-900"
          >
            Ver todos →
          </a>
        </div>
        {featured.isLoading ? (
          <div className="py-20 text-center text-slate-500">Carregando...</div>
        ) : properties.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            Nenhum imóvel disponível no momento.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section id="sobre" className="bg-white py-24">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={fallbackImages[1]}
              alt="Sala de estar"
              className="h-[420px] w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">
              Nossa essência
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold text-slate-900">
              A escolha certa para cada história.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600">
              Acreditamos que encontrar um imóvel vai muito além de metros
              quadrados. É sobre enxergar o potencial de cada espaço e unir
              sonhos aos lugares certos, com transparência e segurança em cada
              etapa.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="font-display text-3xl font-semibold text-primary">
                  100%
                </p>
                <p className="mt-1 text-sm text-slate-500">Acompanhamento dedicado</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-6">
                <p className="font-display text-3xl font-semibold text-primary">
                  Curadoria
                </p>
                <p className="mt-1 text-sm text-slate-500">Imóveis verificados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}