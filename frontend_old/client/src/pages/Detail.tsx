import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Bath,
  BedDouble,
  Car,
  ChevronDown,
  ChevronLeft,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
} from "lucide-react";
import Header from "@/components/layout/Header";
import EmptyState from "@/components/property/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProperty } from "@/lib/properties";
import { CONTACT, fallbackImages, formatBRL, label } from "@/lib/constants";

export default function Detail({ id }: { id: string }) {
  const [selected, setSelected] = useState(0);

  const query = useQuery({
    queryKey: ["property", id],
    queryFn: () => getProperty(id),
  });

  if (query.isLoading) {
    return (
      <div className="container py-40 text-center text-slate-500">
        Carregando imóvel...
      </div>
    );
  }

  const p = query.data;
  if (!p) {
    return (
      <div className="container py-40">
        <EmptyState text="Imóvel não encontrado." />
      </div>
    );
  }

  const images: { url: string; id: string }[] =
    p.images?.length > 0
      ? p.images.map((img) => ({ url: img.url, id: img.publicId }))
      : fallbackImages.map((url) => ({ url, id: url }));

  const whatsappLink = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${p.title}".`
  )}`;

  return (
    <div>
      <div className="bg-[#eaf4f7]">
        <Header />
        <div className="container pb-12 pt-32">
          <Link href="/imoveis">
            <a className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <ChevronLeft size={16} /> Voltar ao catálogo
            </a>
          </Link>
          <div className="grid gap-3 md:grid-cols-[1.5fr_.5fr] md:grid-rows-2">
            <div className="relative row-span-2 overflow-hidden rounded-3xl">
              <img
                src={images[selected]?.url}
                alt={p.title}
                className="h-full min-h-[400px] w-full object-cover"
              />
            </div>
            {images.slice(1, 3).map((img, i) => (
              <button
                key={img.id + i}
                onClick={() => setSelected(i + 1)}
                className="hidden overflow-hidden rounded-3xl md:block"
              >
                <img
                  src={img.url}
                  alt={p.title}
                  className="h-full w-full object-cover transition hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="container grid gap-12 py-12 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-primary px-3 py-1">
              {label(p.purpose)}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              {label(p.status)}
            </Badge>
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-slate-400">
            {label(p.type)}
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-tight text-slate-900">
            {p.title}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-slate-500">
            <MapPin size={17} className="text-primary" />
            {p.address?.street ? `${p.address.street}, ${p.address.number ?? ""} · ` : ""}
            {p.address?.neighborhood ? `${p.address.neighborhood}, ` : ""}
            {p.address?.city} - {p.address?.state}
          </p>

          {p.features?.length > 0 && (
            <>
              <h2 className="mt-10 font-display text-2xl font-semibold">
                Características
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.features.map((feature) => (
                  <Badge
                    key={feature}
                    variant="outline"
                    className="rounded-full px-4 py-1.5"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            </>
          )}

          <h2 className="mt-10 font-display text-2xl font-semibold">Descrição</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">
            {p.description}
          </p>
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="surface rounded-3xl p-7">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-slate-400">
              {p.purpose === "aluguel" ? "Aluguel" : "Valor"}
            </p>
            <p className="mt-2 font-display text-4xl font-semibold text-primary">
              {formatBRL(p.price)}
            </p>
            {p.condominiumFee > 0 && (
              <p className="mt-1 text-sm text-slate-500">
                Condomínio: {formatBRL(p.condominiumFee)}
              </p>
            )}
            {p.iptu > 0 && (
              <p className="text-sm text-slate-500">IPTU: {formatBRL(p.iptu)}</p>
            )}

            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-slate-100 py-5 text-center">
              <div>
                <Ruler size={20} className="mx-auto text-primary" />
                <p className="mt-1 text-sm font-semibold">{p.area} m²</p>
              </div>
              <div>
                <BedDouble size={20} className="mx-auto text-primary" />
                <p className="mt-1 text-sm font-semibold">
                  {p.bedrooms} {p.bedrooms === 1 ? "quarto" : "quartos"}
                </p>
              </div>
              <div>
                <Bath size={20} className="mx-auto text-primary" />
                <p className="mt-1 text-sm font-semibold">
                  {p.bathrooms} {p.bathrooms === 1 ? "banheiro" : "banheiros"}
                </p>
              </div>
              {p.suites > 0 && (
                <div>
                  <BedDouble size={20} className="mx-auto text-primary" />
                  <p className="mt-1 text-sm font-semibold">
                    {p.suites} {p.suites === 1 ? "suíte" : "suítes"}
                  </p>
                </div>
              )}
              <div>
                <Car size={20} className="mx-auto text-primary" />
                <p className="mt-1 text-sm font-semibold">
                  {p.parkingSpaces}{" "}
                  {p.parkingSpaces === 1 ? "vaga" : "vagas"}
                </p>
              </div>
            </div>

            <a href={whatsappLink} target="_blank" rel="noreferrer">
              <Button className="mt-6 h-12 w-full rounded-2xl bg-primary">
                <MessageCircle size={17} /> Falar no WhatsApp
              </Button>
            </a>
            <a href={`tel:${CONTACT.phone}`}>
              <Button
                variant="outline"
                className="mt-3 h-12 w-full rounded-2xl"
              >
                <Phone size={17} /> {CONTACT.phone}
              </Button>
            </a>
            <a href={`mailto:${CONTACT.email}`} className="mt-4 block text-center text-sm font-semibold text-primary">
              <Mail size={14} className="mr-1 inline" />
              {CONTACT.email}
            </a>
            <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
              <ChevronDown size={14} className="mr-1 inline" />
              Preços e disponibilidade sujeitos a confirmação pela nossa equipe.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}