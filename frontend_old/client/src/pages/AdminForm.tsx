import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImagePlus, Plus, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createProperty, updateProperty, uploadPropertyImages } from "@/lib/properties";
import type { Property } from "@/lib/types";

interface AdminFormProps {
  editing?: Property | null;
  onDone: () => void;
}

const TYPES = ["casa", "apartamento", "terreno", "comercial", "chacara", "sobrado"];
const STATUS = ["disponivel", "vendido", "alugado", "indisponivel"];

interface FormState {
  title: string;
  description: string;
  type: string;
  purpose: string;
  price: number;
  area: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpaces: number;
  condominiumFee: number;
  iptu: number;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  features: string[];
  status: string;
}

function toForm(p: Property | null | undefined): FormState {
  return {
    title: p?.title ?? "",
    description: p?.description ?? "",
    type: p?.type ?? "apartamento",
    purpose: p?.purpose ?? "venda",
    price: p?.price ?? 0,
    area: p?.area ?? 0,
    bedrooms: p?.bedrooms ?? 0,
    suites: p?.suites ?? 0,
    bathrooms: p?.bathrooms ?? 0,
    parkingSpaces: p?.parkingSpaces ?? 0,
    condominiumFee: p?.condominiumFee ?? 0,
    iptu: p?.iptu ?? 0,
    street: p?.address?.street ?? "",
    number: p?.address?.number ?? "",
    neighborhood: p?.address?.neighborhood ?? "",
    city: p?.address?.city ?? "",
    state: p?.address?.state ?? "",
    zipCode: p?.address?.zipCode ?? "",
    features: p?.features ?? [],
    status: p?.status ?? "disponivel",
  };
}

function toPayload(form: FormState): Partial<Property> {
  return {
    title: form.title,
    description: form.description,
    type: form.type as Property["type"],
    purpose: form.purpose as Property["purpose"],
    price: form.price,
    area: form.area,
    bedrooms: form.bedrooms,
    suites: form.suites,
    bathrooms: form.bathrooms,
    parkingSpaces: form.parkingSpaces,
    condominiumFee: form.condominiumFee,
    iptu: form.iptu,
    address: {
      street: form.street,
      number: form.number,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state.toUpperCase(),
      zipCode: form.zipCode,
    },
    features: form.features,
    status: form.status as Property["status"],
  };
}

export default function AdminForm({ editing, onDone }: AdminFormProps) {
  const [form, setForm] = useState<FormState>(() => toForm(editing));
  const [createdId, setCreatedId] = useState<string | null>(
    editing?._id ?? null
  );
  const [feature, setFeature] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const set = (key: keyof FormState, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = toPayload(form);
      if (createdId) {
        return updateProperty(createdId, payload);
      }
      const created = await createProperty(payload);
      setCreatedId(created._id);
      return created;
    },
    onSuccess: (result) => {
      toast.success(createdId ? "Imóvel atualizado" : "Imóvel criado com sucesso");
      if (!createdId) {
        setCreatedId(result._id);
      }
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Erro ao salvar"),
  });

  const uploadMutation = useMutation({
    mutationFn: () => uploadPropertyImages(createdId!, files),
    onSuccess: () => {
      toast.success("Imagens enviadas com sucesso");
      setFiles([]);
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : "Erro no upload"),
    onSettled: () => setUploading(false),
  });

  const addFeature = () => {
    const value = feature.trim();
    if (!value) return;
    set("features", [...form.features, value]);
    setFeature("");
  };

  return (
    <div className="mt-8 rounded-3xl border border-blue-100 bg-blue-50/60 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold">
            {createdId ? "Editar imóvel" : "Novo imóvel"}
          </h2>
          <p className="text-sm text-slate-500">
            Preencha os dados essenciais do imóvel.
          </p>
        </div>
        <button onClick={onDone} aria-label="Fechar">
          <X size={18} />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Título
          </label>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Ex: Apartamento com vista livre"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Descrição
          </label>
          <Textarea
            rows={4}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Descreva o imóvel, a vizinhança e pontos de destaque."
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Tipo
          </label>
          <select
            value={form.type}
            onChange={(e) => set("type", e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-white px-3 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Finalidade
          </label>
          <select
            value={form.purpose}
            onChange={(e) => set("purpose", e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-white px-3 text-sm"
          >
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Preço (R$)
          </label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Área (m²)
          </label>
          <Input
            type="number"
            value={form.area}
            onChange={(e) => set("area", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Quartos
          </label>
          <Input
            type="number"
            value={form.bedrooms}
            onChange={(e) => set("bedrooms", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Suítes
          </label>
          <Input
            type="number"
            value={form.suites}
            onChange={(e) => set("suites", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Banheiros
          </label>
          <Input
            type="number"
            value={form.bathrooms}
            onChange={(e) => set("bathrooms", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Vagas de garagem
          </label>
          <Input
            type="number"
            value={form.parkingSpaces}
            onChange={(e) => set("parkingSpaces", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Condomínio (R$)
          </label>
          <Input
            type="number"
            value={form.condominiumFee}
            onChange={(e) => set("condominiumFee", Number(e.target.value))}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            IPTU (R$)
          </label>
          <Input
            type="number"
            value={form.iptu}
            onChange={(e) => set("iptu", Number(e.target.value))}
          />
        </div>

        <div className="md:col-span-2">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Endereço
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="Rua"
              value={form.street}
              onChange={(e) => set("street", e.target.value)}
            />
            <Input
              placeholder="Número"
              value={form.number}
              onChange={(e) => set("number", e.target.value)}
            />
            <Input
              placeholder="Bairro"
              value={form.neighborhood}
              onChange={(e) => set("neighborhood", e.target.value)}
            />
            <Input
              placeholder="Cidade"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            />
            <Input
              placeholder="Estado (UF)"
              maxLength={2}
              value={form.state}
              onChange={(e) => set("state", e.target.value.toUpperCase())}
            />
            <Input
              placeholder="CEP"
              value={form.zipCode}
              onChange={(e) => set("zipCode", e.target.value)}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            Características
          </p>
          <div className="flex gap-2">
            <Input
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFeature()}
              placeholder="Ex: Varanda gourmet"
            />
            <Button variant="outline" onClick={addFeature}>
              <Plus size={16} /> Adicionar
            </Button>
          </div>
          {form.features.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {form.features.map((item, i) => (
                <Badge key={`${item}-${i}`} variant="outline" className="gap-2 px-3 py-1.5">
                  {item}
                  <button
                    onClick={() =>
                      set(
                        "features",
                        form.features.filter((_, idx) => idx !== i)
                      )
                    }
                    aria-label="Remover"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-white px-3 text-sm"
          >
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="rounded-2xl bg-primary"
        >
          <Save size={17} />
          {saveMutation.isPending
            ? "Salvando..."
            : createdId
              ? "Salvar alterações"
              : "Criar imóvel"}
        </Button>
        {createdId && (
          <>
            <input
              id="images-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) =>
                setFiles(Array.from(e.target.files ?? []))
              }
            />
            <label htmlFor="images-input">
              <span className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-primary">
                <ImagePlus size={17} /> Selecionar imagens
              </span>
            </label>
            {files.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setUploading(true);
                  uploadMutation.mutate();
                }}
                disabled={uploading}
                className="rounded-2xl"
              >
                <Upload size={17} />
                {uploading
                  ? "Enviando..."
                  : `Enviar ${files.length} ${files.length === 1 ? "imagem" : "imagens"}`}
              </Button>
            )}
          </>
        )}
      </div>

      {createdId && (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Imagens cadastradas:
          </p>
          {(editing?.images ?? []).length === 0 ? (
            <span className="text-sm text-slate-400">Nenhuma imagem ainda.</span>
          ) : (
            (editing?.images ?? []).map((img) => (
              <img
                key={img.publicId}
                src={img.url}
                alt="Imóvel"
                className="h-16 w-16 rounded-xl object-cover"
              />
            ))
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button variant="ghost" onClick={onDone}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}