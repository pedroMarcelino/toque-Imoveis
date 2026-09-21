import { Link } from 'wouter'
import { MapPin } from 'lucide-react'
import type { Property } from '../../types/property'
import { fallbackImages } from '../../types/property'
import { label, stableIndex } from '../../lib/labels'
import { formatBRL } from '../../lib/formatBRL'
import { Badge } from '../ui/Badge'

export default function PropertyCard({ property }: { property: Property }) {
  const cover = property.images[0]?.url ?? fallbackImages[stableIndex(property._id, fallbackImages.length)]

  return (
    <Link href={`/imoveis/${property._id}`} className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md">
      <div className="flex flex-row sm:flex-col">
        {/* Foto — horizontal (mobile) / no topo (desktop) */}
        <div className="relative aspect-square w-[45%] shrink-0 overflow-hidden sm:aspect-[16/10] sm:w-full">
          <img
            src={cover}
            alt={property.title}
            className="absolute inset-0 size-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Descrições */}
        <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-5">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{label(property.purpose)}</Badge>
            <span className="text-[11px] font-semibold uppercase tracking-[.15em] text-muted-foreground">
              {label(property.type)}
            </span>
          </div>
          <h3 className="line-clamp-2 font-display text-base font-semibold text-slate-900 group-hover:text-primary sm:text-lg">
            {property.title}
          </h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin size={14} className="shrink-0 text-primary" />
            <span className="truncate">
              {property.address.neighborhood} · {property.address.city} / {property.address.state}
            </span>
          </p>
          <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-2.5 sm:pt-3">
            <span className="font-display text-lg font-semibold text-primary sm:text-xl">
              {formatBRL(property.price)}
            </span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {property.area} m² · {property.bedrooms}{' '}
              {property.bedrooms === 1 ? 'quarto' : 'quartos'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}