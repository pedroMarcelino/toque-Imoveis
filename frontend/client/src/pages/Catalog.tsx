import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/property/SearchBar";
import PropertyCard from "@/components/property/PropertyCard";
import EmptyState from "@/components/property/EmptyState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/lib/properties";
import type { PropertyFilters, PropertyListResponse } from "@/lib/types";

export default function Catalog() {
  const [params] = useLocation();
  const initialSearch =
    new URLSearchParams(params.split("?")[1] ?? "").get("search") ?? "";

  const [filters, setFilters] = useState<PropertyFilters>({
    search: initialSearch,
    tipo: "",
    finalidade: "",
    cidade: "",
    minPreco: undefined,
    maxPreco: undefined,
    quartos: undefined,
    status: "disponivel",
    page: 1,
    pageSize: 9,
  });

  const query = useQuery({
    queryKey: ["catalog", JSON.stringify(filters)],
    queryFn: () => getProperties(filters),
    placeholderData: keepPreviousData,
  });

  const data = query.data ?? ({} as PropertyListResponse);
  const { properties = [], total = 0, page = 1, pageSize = 9 } = data;
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);

  const set = (key: keyof PropertyFilters, value: unknown) =>
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  const goPage = (p: number) =>
    setFilters((f) => ({ ...f, page: Math.min(Math.max(p, 1), totalPages) }));

  return (
    <div>
      <div className="bg-[#eaf4f7] pb-10">
        <Header />
        <div className="container pt-36">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">
            Catálogo
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-slate-900">
            Encontre o seu espaço.
          </h1>
          <p className="mt-4 max-w-xl text-slate-600">
            Explore uma seleção de imóveis escolhidos para diferentes formas de
            viver.
          </p>
          <div className="mt-8">
            <SearchBar
              onSearch={(v) => set("search", v)}
            />
          </div>
        </div>
      </div>

      <main className="container py-12">
        <div className="mb-8 grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-5">
          <div className="flex items-center gap-2 md:col-span-5">
            <SlidersHorizontal size={16} className="text-primary" />
            <span className="text-sm font-bold text-slate-600">Filtros</span>
          </div>
          <select
            value={filters.finalidade}
            onChange={(e) => set("finalidade", e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="">Finalidade</option>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
          <select
            value={filters.tipo}
            onChange={(e) => set("tipo", e.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          >
            <option value="">Tipo de imóvel</option>
            <option value="apartamento">Apartamento</option>
            <option value="casa">Casa</option>
            <option value="terreno">Terreno</option>
            <option value="comercial">Comercial</option>
            <option value="chacara">Chácara</option>
            <option value="sobrado">Sobrado</option>
          </select>
          <Input
            placeholder="Cidade"
            value={filters.cidade ?? ""}
            onChange={(e) => set("cidade", e.target.value)}
          />
          <Input
            placeholder="Preço mínimo"
            type="number"
            value={filters.minPreco ?? ""}
            onChange={(e) =>
              set("minPreco", e.target.value ? Number(e.target.value) : undefined)
            }
          />
          <Input
            placeholder="Preço máximo"
            type="number"
            value={filters.maxPreco ?? ""}
            onChange={(e) =>
              set("maxPreco", e.target.value ? Number(e.target.value) : undefined)
            }
          />
        </div>

        {query.isLoading ? (
          <div className="py-24 text-center text-slate-500">
            Carregando imóveis...
          </div>
        ) : properties.length === 0 ? (
          <EmptyState text="Nenhum imóvel encontrado com esses filtros." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => goPage(page - 1)}
              disabled={page <= 1}
              className="rounded-2xl"
            >
              <ChevronLeft size={16} /> Anterior
            </Button>
            <span className="text-sm font-semibold text-slate-600">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => goPage(page + 1)}
              disabled={page >= totalPages}
              className="rounded-2xl"
            >
              Próxima <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}