import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  Building2,
  Home as HomeIcon,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProperty, getProperties } from "@/lib/properties";
import { formatBRL, label } from "@/lib/constants";
import type { AuthUser } from "@/lib/auth";
import type { Property } from "@/lib/types";
import AdminForm from "./AdminForm";

interface DashboardProps {
  user: AuthUser | null;
  logout: () => void;
}

function Summary({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[.18em] text-slate-400">
        {title}
      </p>
    </div>
  );
}

export default function AdminDashboard({
  user,
  logout,
}: DashboardProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);

  const summary = useQuery({
    queryKey: ["adminSummary"],
    queryFn: async () => {
      const [total, disponivel, vendido, alugado] = await Promise.all([
        getProperties({ status: "todos", page: 1, pageSize: 1 }),
        getProperties({ status: "disponivel", page: 1, pageSize: 1 }),
        getProperties({ status: "vendido", page: 1, pageSize: 1 }),
        getProperties({ status: "alugado", page: 1, pageSize: 1 }),
      ]);
      return {
        total: total.total,
        disponivel: disponivel.total,
        vendido: vendido.total,
        alugado: alugado.total,
      };
    },
  });

  const list = useQuery({
    queryKey: ["adminList", search],
    queryFn: () =>
      getProperties({ status: "todos", search, page: 1, pageSize: 50 }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteProperty(id),
    onSuccess: () => {
      toast.success("Imóvel removido com sucesso");
      list.refetch();
      summary.refetch();
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Erro ao remover"),
  });

  const invalidateAll = () => {
    list.refetch();
    summary.refetch();
    queryClient.invalidateQueries({ queryKey: ["featured"] });
    queryClient.invalidateQueries({ queryKey: ["catalog"] });
  };

  return (
    <div className="min-h-screen bg-[#f4f8fa]">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col bg-slate-950 p-7 text-white md:flex">
          <Link href="/">
            <a className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500 text-white">
                <Building2 size={19} />
              </span>
              <span>
                <span className="block font-display text-xl font-semibold leading-none text-white">
                  Toque
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[.25em] text-blue-300">
                  Imóveis
                </span>
              </span>
            </a>
          </Link>
          <div className="mt-16">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-slate-500">
              Gestão
            </p>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
              <LayoutDashboard size={17} className="text-blue-300" /> Dashboard
            </div>
          </div>
          <div className="mt-auto text-sm text-slate-400">
            <p className="mb-3 text-xs">{user?.email}</p>
            <button onClick={logout} className="flex items-center gap-2 hover:text-white">
              <LogOut size={15} /> Sair
            </button>
          </div>
        </aside>

        <main className="flex-1 p-5 md:p-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                  Toque Imóveis · Administração
                </p>
                <h1 className="mt-2 font-display text-4xl font-semibold text-slate-900">
                  Visão geral
                </h1>
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <Button variant="outline" onClick={logout} size="sm">
                  <LogOut size={15} />
                </Button>
              </div>
              <Button
                onClick={() => {
                  setEditing(null);
                  setShowForm(!showForm);
                }}
                className="rounded-2xl bg-primary"
              >
                {showForm ? "Fechar" : "Novo imóvel"} <Plus size={17} />
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Summary
                title="Total de imóveis"
                value={summary.data?.total ?? "—"}
                icon={<HomeIcon size={19} />}
              />
              <Summary
                title="Disponíveis"
                value={summary.data?.disponivel ?? "—"}
                icon={<Tag size={19} />}
              />
              <Summary
                title="Vendidos"
                value={summary.data?.vendido ?? "—"}
                icon={<Building2 size={19} />}
              />
              <Summary
                title="Alugados"
                value={summary.data?.alugado ?? "—"}
                icon={<Tag size={19} />}
              />
            </div>

            {showForm && (
              <AdminForm
                editing={editing}
                onDone={() => {
                  setShowForm(false);
                  setEditing(null);
                  invalidateAll();
                }}
              />
            )}

            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">
                  Todos os imóveis
                </h2>
                <Input
                  placeholder="Buscar por título ou cidade"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-xs"
                />
              </div>

              <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                {list.isLoading ? (
                  <div className="p-10 text-center text-slate-500">
                    Carregando...
                  </div>
                ) : (list.data?.properties ?? []).length === 0 ? (
                  <div className="p-10 text-center text-slate-500">
                    Nenhum imóvel cadastrado.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Imóvel</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(list.data?.properties ?? []).map((property) => (
                        <TableRow key={property._id}>
                          <TableCell>
                            <p className="font-semibold text-slate-800">
                              {property.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {property.address?.city} - {property.address?.state}
                            </p>
                          </TableCell>
                          <TableCell>{formatBRL(property.price)}</TableCell>
                          <TableCell>
                            <Badge className="rounded-full">
                              {label(property.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditing(property);
                                  setShowForm(true);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                              >
                                <Pencil size={14} /> Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600"
                                onClick={() => remove.mutate(property._id)}
                              >
                                <Trash2 size={14} /> Remover
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}