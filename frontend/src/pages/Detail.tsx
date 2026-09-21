import { useState } from 'react'
import { Link } from 'wouter'
import {
  AlertTriangle,
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Car,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
} from 'lucide-react'
import { useProperty } from '../hooks/useProperties'
import { fallbackImages } from '../types/property'
import { label } from '../lib/labels'
import { formatBRL } from '../lib/formatBRL'
import { CONTACT } from '../config'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { cn } from '../lib/cn'

export default function Detail({ id }: { id: string }) {
  const [selected, setSelected] = useState(0)
  const query = useProperty(id)

  if (query.isLoading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={28} />
      </section>
    )
  }

  if (query.isError) {
    return (
      <section className="py-20">
        <div className="container max-w-xl">
          <Card className="p-10 text-center">
            <AlertTriangle className="mx-auto text-red-500" size={28} />
            <p className="mt-3 text-sm text-slate-600">Não foi possível carregar o imóvel.</p>
            <Button onClick={() => query.refetch()} className="mt-4">
              Tentar novamente
            </Button>
          </Card>
        </div>
      </section>
    )
  }

  const p = query.data

  if (!p) {
    return (
      <section className="py-20">
        <div className="container max-w-xl">
          <Card className="p-10 text-center">
            <Building2 className="mx-auto text-muted-foreground" size={36} />
            <h1 className="mt-4 font-display text-2xl font-semibold text-slate-900">Imóvel não encontrado</h1>
            <p className="mt-2 text-sm text-slate-500">
              O imóvel pode ter sido removido ou o endereço está incorreto.
            </p>
          </Card>
        </div>
      </section>
    )
  }

  const images =
    p.images.length > 0
      ? p.images.map((img) => ({ url: img.url, key: img.publicId }))
      : fallbackImages.map((url) => ({ url, key: url }))
  const active = Math.min(selected, images.length - 1)

  const whatsappLink = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    `Olá! Tenho interesse no imóvel "${p.title}".`,
  )}`

  const specs = [
    { icon: Ruler, value: `${p.area} m²`, sub: 'Área' },
    { icon: BedDouble, value: String(p.bedrooms), sub: p.bedrooms === 1 ? 'Quarto' : 'Quartos' },
    ...(p.suites > 0
      ? [{ icon: BedDouble, value: String(p.suites), sub: p.suites === 1 ? 'Suíte' : 'Suítes' }]
      : []),
    { icon: Bath, value: String(p.bathrooms), sub: p.bathrooms === 1 ? 'Banheiro' : 'Banheiros' },
    { icon: Car, value: String(p.parkingSpaces), sub: p.parkingSpaces === 1 ? 'Vaga' : 'Vagas' },
  ]

  return (
    <section className="py-10 sm:py-16">
      <div className="container max-w-6xl">
        <Link href="/#imoveis" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft size={16} /> Voltar ao catálogo
        </Link>

        <div className="mt-6 lg:mx-auto lg:max-w-[75%]">
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <img
              src={images[active].url}
              alt={p.title}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={img.key}
                  onClick={() => setSelected(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={cn(
                    'shrink-0 overflow-hidden rounded-xl border-2 transition',
                    i === active ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100',
                  )}
                >
                  <img src={img.url} alt="" className="h-16 w-24 object-cover sm:h-20 sm:w-28" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Badge>{label(p.purpose)}</Badge>
          <Badge variant="outline">{label(p.status)}</Badge>
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-muted-foreground">
          {label(p.type)}
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
          {p.title}
        </h1>
        <p className="mt-3 flex items-start gap-2 text-sm text-slate-500">
          <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
          <span>
            {[
              p.address.street && [p.address.street, p.address.number].filter(Boolean).join(', '),
              p.address.neighborhood,
              `${p.address.city} - ${p.address.state}`,
              p.address.zipCode,
            ]
              .filter(Boolean)
              .join(' · ')}
          </span>
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">
              Especificações
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {specs.map((spec) => (
                <div key={spec.sub} className="rounded-2xl border border-border bg-card p-4">
                  <spec.icon size={20} className="text-primary" />
                  <p className="mt-2 font-display text-lg font-semibold text-slate-900">
                    {spec.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{spec.sub}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-10 font-display text-xl font-semibold text-slate-900 sm:text-2xl">
              Descrição
            </h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">
              {p.description}
            </p>

            {p.features.length > 0 && (
              <>
                <h2 className="mt-10 font-display text-xl font-semibold text-slate-900 sm:text-2xl">
                  Características
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="rounded-full px-4 py-1.5">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-6 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[.2em] text-muted-foreground">
                {p.purpose === 'aluguel' ? 'Aluguel' : 'Valor'}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold text-primary sm:text-4xl">
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

              <div className="mt-6 border-t border-border pt-5">
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="block">
                  <Button size="lg" className="w-full">
                    <MessageCircle size={17} /> Falar no WhatsApp
                  </Button>
                </a>
                <a href={`tel:${CONTACT.phone}`} className="mt-3 block">
                  <Button size="lg" variant="outline" className="w-full">
                    <Phone size={17} /> {CONTACT.phone}
                  </Button>
                </a>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary"
                >
                  <Mail size={14} /> {CONTACT.email}
                </a>
              </div>

              <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
                Preços e disponibilidade sujeitos a confirmação pela nossa equipe.
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  )
}