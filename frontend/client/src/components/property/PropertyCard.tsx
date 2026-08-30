import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { Property } from "@/lib/types";
import { fallbackImages, formatBRL, label, stableIndex } from "@/lib/constants";

export default function PropertyCard({ property }: { property: Property }) {
  const image = useMemo(() => {
    return (
      property.images?.[0]?.url ??
      fallbackImages[stableIndex(property._id, fallbackImages.length)]
    );
  }, [property]);

  return (
    <Link href={`/imoveis/${property._id}`}>
      <a className="group block overflow-hidden rounded-3xl bg-white shadow-[0_14px_45px_rgba(28,58,90,.08)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={property.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <Badge className="rounded-full border-0 bg-white/90 px-3 py-1 text-[11px] font-semibold text-primary backdrop-blur">
              {label(property.purpose)}
            </Badge>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toast.success("Salvo na sua lista");
            }}
            className="absolute right-4 top-4 rounded-full bg-white/85 p-2 text-slate-500 backdrop-blur hover:text-primary"
            aria-label="Salvar imóvel"
          >
            <Heart size={17} />
          </button>
        </div>
        <div className="p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-slate-400">
            {label(property.type)}
          </p>
          <h3 className="font-display text-xl font-semibold text-slate-900 group-hover:text-primary">
            {property.title}
          </h3>
          <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
            <MapPin size={14} className="text-primary" />
            {property.address?.neighborhood ? `${property.address.neighborhood}, ` : ""}
            {property.address?.city}
          </p>
          <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
            <span className="font-display text-xl font-semibold text-primary">
              {formatBRL(property.price)}
            </span>
            <span className="text-xs text-slate-500">
              {property.area} m² · {property.bedrooms} quartos
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}