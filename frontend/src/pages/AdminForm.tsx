import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'wouter'
import { Loader2, ArrowLeft, Save, UploadCloud, X, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { Label } from '../components/ui/Label'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Textarea } from '../components/ui/Textarea'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  propertyInputSchema,
  PROPERTY_TYPES,
  PROPERTY_PURPOSES,
  PROPERTY_STATUSES,
  type Property,
  type PropertyInput,
} from '../types/property'
import {
  useProperty,
  useCreateProperty,
  useUpdateProperty,
  useUploadPropertyImages,
  useDeletePropertyImage,
} from '../hooks/useProperties'
import { label } from '../lib/labels'
import { buscarCep, formatCep, sanitizeCep } from '../lib/cep'
import { formatCurrencyInput, parseCurrencyInput } from '../lib/currency'

interface FormState {
  title: string
  description: string
  type: string
  purpose: string
  status: string
  price: string
  area: string
  bedrooms: string
  suites: string
  bathrooms: string
  parkingSpaces: string
  condominiumFee: string
  iptu: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  features: string
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  type: 'casa',
  purpose: 'venda',
  status: 'disponivel',
  price: '',
  area: '',
  bedrooms: '0',
  suites: '0',
  bathrooms: '0',
  parkingSpaces: '0',
  condominiumFee: '0',
  iptu: '0',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  features: '',
}

type FieldErrors = Partial<Record<keyof FormState, string>>

function toFormState(property: Property): FormState {
  return {
    title: property.title,
    description: property.description,
    type: property.type,
    purpose: property.purpose,
    status: property.status,
    price: formatCurrencyInput(String(Math.round(Number(property.price ?? 0) * 100))),
    area: String(property.area ?? ''),
    bedrooms: String(property.bedrooms ?? 0),
    suites: String(property.suites ?? 0),
    bathrooms: String(property.bathrooms ?? 0),
    parkingSpaces: String(property.parkingSpaces ?? 0),
    condominiumFee: String(property.condominiumFee ?? 0),
    iptu: String(property.iptu ?? 0),
    street: property.address?.street ?? '',
    number: property.address?.number ?? '',
    complement: property.address?.complement ?? '',
    neighborhood: property.address?.neighborhood ?? '',
    city: property.address?.city ?? '',
    state: property.address?.state ?? '',
    zipCode: property.address?.zipCode ?? '',
    features: (property.features ?? []).join(', '),
  }
}

function toPayload(form: FormState): PropertyInput {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    type: form.type as PropertyInput['type'],
    purpose: form.purpose as PropertyInput['purpose'],
    status: form.status as PropertyInput['status'],
    price: parseCurrencyInput(form.price),
    area: Number(form.area),
    bedrooms: Number(form.bedrooms || 0),
    suites: Number(form.suites || 0),
    bathrooms: Number(form.bathrooms || 0),
    parkingSpaces: Number(form.parkingSpaces || 0),
    condominiumFee: Number(form.condominiumFee || 0),
    iptu: Number(form.iptu || 0),
    address: {
      street: form.street.trim() || undefined,
      number: form.number.trim() || undefined,
      complement: form.complement.trim() || undefined,
      neighborhood: form.neighborhood.trim(),
      city: form.city.trim(),
      state: form.state.trim().toUpperCase(),
      zipCode: form.zipCode.trim() || undefined,
    },
    features: form.features
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean),
  }
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>
}

export default function AdminForm({ id }: { id?: string }) {
  const [, navigate] = useLocation()
  const isEdit = Boolean(id)

  const { data: property, isLoading: propertyLoading } = useProperty(id ?? '')
  const createProperty = useCreateProperty()
  const updateProperty = useUpdateProperty()
  const uploadImages = useUploadPropertyImages()
  const deleteImage = useDeletePropertyImage()

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [files, setFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<Property['images']>([])
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)
  const [cepLocked, setCepLocked] = useState(false)
  const [cepError, setCepError] = useState<string | null>(null)
  const cepTimer = useRef<number | null>(null)
  const numberRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    return () => {
      if (cepTimer.current) window.clearTimeout(cepTimer.current)
    }
  }, [])

  useEffect(() => {
    if (id && property) {
      setForm(toFormState(property))
      setExistingImages(property.images ?? [])
    }
  }, [id, property])

  const setField = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const parsed = useMemo(() => propertyInputSchema.safeParse(toPayload(form)), [form])
  const currentErrors: FieldErrors = {}
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const rawPath = issue.path.join('.')
      const field = (rawPath.startsWith('address.')
        ? rawPath.replace('address.', '')
        : rawPath) as keyof FormState
      if (field && !currentErrors[field]) currentErrors[field] = issue.message
    }
  }

  const hasErrors = Object.keys(currentErrors).length > 0
  const requiredFilled =
    form.title.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.price.trim().length > 0 &&
    form.area.trim().length > 0 &&
    form.neighborhood.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.state.trim().length > 0
  const canSubmit = requiredFilled && !hasErrors && !submitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || !parsed.success) return

    setSubmitting(true)
    try {
      const saved = isEdit
        ? await updateProperty.mutateAsync({ id: id!, body: parsed.data })
        : await createProperty.mutateAsync(parsed.data)

      if (files.length > 0) {
        setUploading(true)
        try {
          const result = await uploadImages.mutateAsync({ id: saved._id, files })
          setExistingImages(result.images)
          toast.success('Fotos enviadas com sucesso')
        } catch (error) {
          toast.error(
            error instanceof Error ? `Imóvel salvo, mas fotos falharam: ${error.message}` : 'Erro ao enviar fotos',
          )
        } finally {
          setUploading(false)
        }
      }

      toast.success(isEdit ? 'Imóvel atualizado' : 'Imóvel criado')
      navigate('/admin')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar imóvel')
    } finally {
      setSubmitting(false)
    }
  }

  const removePendingFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index))

  const handleDeleteImage = (image: Property['images'][number]) => {
    if (!id || !image._id || deleteImage.isPending) return
    setExistingImages((prev) => prev.filter((img) => img._id !== image._id))
    deleteImage.mutate(
      { id, imageId: image._id },
      {
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Erro ao remover imagem')
          setExistingImages((prev) => (property?.images?.length ? property.images : prev))
        },
      },
    )
  }

  const searchCep = async (digits: string) => {
    setCepLoading(true)
    setCepError(null)
    try {
      const result = await buscarCep(digits)
      if (!result) {
        setCepError('CEP não encontrado')
        return
      }
      setForm((prev) => ({
        ...prev,
        street: result.street,
        neighborhood: result.neighborhood,
        city: result.city,
        state: result.state,
        zipCode: result.zipCode,
      }))
      setCepLocked(true)
      requestAnimationFrame(() => numberRef.current?.focus())
    } catch {
      setCepError('Erro ao consultar o CEP, tente novamente')
    } finally {
      setCepLoading(false)
    }
  }

  const handleCepChange = (raw: string) => {
    const formatted = formatCep(raw)
    setField('zipCode')(formatted)

    const digits = sanitizeCep(raw)
    if (digits.length !== 8 || cepLocked) return

    if (cepTimer.current) window.clearTimeout(cepTimer.current)
    cepTimer.current = window.setTimeout(() => searchCep(digits), 400)
  }

  const unlockCep = () => {
    if (cepTimer.current) window.clearTimeout(cepTimer.current)
    setCepLocked(false)
    setCepError(null)
    setForm((prev) => ({
      ...prev,
      street: '',
      number: prev.number,
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    }))
  }

  if (isEdit && propertyLoading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={28} />
      </section>
    )
  }

  return (
    <section className="py-10 sm:py-16">
      <div className="container max-w-3xl">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <ArrowLeft size={16} /> Voltar ao painel
        </button>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-primary">
              {isEdit ? 'Editar imóvel' : 'Novo imóvel'}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              {isEdit ? 'Editar imóvel' : 'Cadastrar imóvel'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5" noValidate>
          {/* Informações */}
          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-slate-900">Informações</h2>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Ex.: Apartamento no Jardim Europa"
                  value={form.title}
                  onChange={(e) => setField('title')(e.target.value)}
                />
                <FieldError message={form.title.trim() && currentErrors.title ? currentErrors.title : undefined} />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o imóvel…"
                  value={form.description}
                  onChange={(e) => setField('description')(e.target.value)}
                  rows={4}
                />
                <FieldError
                  message={
                    form.description.trim() && currentErrors.description
                      ? currentErrors.description
                      : undefined
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select id="type" value={form.type} onChange={(e) => setField('type')(e.target.value)}>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {label(t)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="purpose">Finalidade</Label>
                  <Select id="purpose" value={form.purpose} onChange={(e) => setField('purpose')(e.target.value)}>
                    {PROPERTY_PURPOSES.map((p) => (
                      <option key={p} value={p}>
                        {label(p)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" value={form.status} onChange={(e) => setField('status')(e.target.value)}>
                    {PROPERTY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {label(s)}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Valores */}
          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-slate-900">Valores</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="price">Preço</Label>
                <Input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  maxLength={18}
                  value={form.price}
                  onChange={(e) => setField('price')(formatCurrencyInput(e.target.value))}
                />
                <FieldError message={form.price.trim() && currentErrors.price ? currentErrors.price : undefined} />
              </div>
              <div>
                <Label htmlFor="condominiumFee">Condomínio</Label>
                <Input
                  id="condominiumFee"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0,00"
                  value={form.condominiumFee}
                  onChange={(e) => setField('condominiumFee')(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="iptu">IPTU</Label>
                <Input
                  id="iptu"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0,00"
                  value={form.iptu}
                  onChange={(e) => setField('iptu')(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Características */}
          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-slate-900">Características</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div>
                <Label htmlFor="area">Área (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="0"
                  value={form.area}
                  onChange={(e) => setField('area')(e.target.value)}
                />
                <FieldError message={form.area.trim() && currentErrors.area ? currentErrors.area : undefined} />
              </div>
              <div>
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min={0}
                  value={form.bedrooms}
                  onChange={(e) => setField('bedrooms')(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="suites">Suítes</Label>
                <Input
                  id="suites"
                  type="number"
                  min={0}
                  value={form.suites}
                  onChange={(e) => setField('suites')(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min={0}
                  value={form.bathrooms}
                  onChange={(e) => setField('bathrooms')(e.target.value)}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="parkingSpaces">Vagas</Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  min={0}
                  value={form.parkingSpaces}
                  onChange={(e) => setField('parkingSpaces')(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="features">Destaques (separados por vírgula)</Label>
              <Input
                id="features"
                placeholder="Ex.: Piscina, Churrasqueira, Varanda"
                value={form.features}
                onChange={(e) => setField('features')(e.target.value)}
              />
            </div>
          </Card>

          {/* Endereço */}
          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-slate-900">Endereço</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  placeholder="Av. Paulista"
                  value={form.street}
                  onChange={(e) => setField('street')(e.target.value)}
                  disabled={cepLocked}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  ref={numberRef}
                  id="number"
                  placeholder="1000"
                  value={form.number}
                  onChange={(e) => setField('number')(e.target.value)}
                />
              </div>
              <div className="sm:col-span-6">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  placeholder="Apto 52, Bloco B (opcional)"
                  value={form.complement}
                  onChange={(e) => setField('complement')(e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  placeholder="Bela Vista"
                  value={form.neighborhood}
                  onChange={(e) => setField('neighborhood')(e.target.value)}
                  disabled={cepLocked}
                />
                <FieldError
                  message={
                    form.neighborhood.trim() && currentErrors.neighborhood
                      ? currentErrors.neighborhood
                      : undefined
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="São Paulo"
                  value={form.city}
                  onChange={(e) => setField('city')(e.target.value)}
                  disabled={cepLocked}
                />
                <FieldError message={form.city.trim() && currentErrors.city ? currentErrors.city : undefined} />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="state">UF</Label>
                <Input
                  id="state"
                  placeholder="SP"
                  maxLength={2}
                  value={form.state}
                  onChange={(e) => setField('state')(e.target.value.toUpperCase())}
                  disabled={cepLocked}
                />
                <FieldError message={form.state.trim() && currentErrors.state ? currentErrors.state : undefined} />
              </div>
              <div className="sm:col-span-3">
                <Label htmlFor="zipCode">CEP</Label>
                <div className="relative">
                  <Input
                    id="zipCode"
                    placeholder="00000-000"
                    inputMode="numeric"
                    value={form.zipCode}
                    onChange={(e) => handleCepChange(e.target.value)}
                    disabled={cepLocked}
                    className="pr-12"
                  />
                  {cepLoading && (
                    <Loader2 className="absolute inset-y-0 right-2 my-auto animate-spin text-primary" size={17} />
                  )}
                  {cepLocked && (
                    <button
                      type="button"
                      onClick={unlockCep}
                      className="absolute inset-y-0 right-1 flex size-11 items-center justify-center text-muted-foreground hover:text-primary"
                      aria-label="Alterar CEP"
                      title="Alterar CEP"
                    >
                      <Pencil size={15} />
                    </button>
                  )}
                </div>
                {cepError ? (
                  <p className="mt-1 text-xs font-medium text-red-600">{cepError}</p>
                ) : cepLocked ? (
                  <p className="mt-1 text-xs font-medium text-emerald-600">Endereço preenchido automaticamente.</p>
                ) : null}
              </div>
            </div>
          </Card>

          {/* Fotos */}
          <Card className="p-5 sm:p-6">
            <h2 className="font-display text-xl font-semibold text-slate-900">Fotos</h2>

            {existingImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {existingImages.map((image) => (
                <div
                  key={image.publicId}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-border"
                >
                  <img src={image.url} alt="" className="size-full object-cover" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image)}
                    disabled={deleteImage.isPending}
                    className="absolute left-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Remover imagem"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

            <label
              htmlFor="images"
              className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <UploadCloud size={24} />
              <span className="font-semibold">Toque para selecionar fotos</span>
              <span className="text-xs">JPG/PNG · até 10 fotos por imóvel</span>
            </label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              disabled={uploading}
            />

            {files.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="relative aspect-square overflow-hidden rounded-2xl border border-border">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePendingFile(index)}
                      className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-red-600"
                      aria-label="Remover imagem"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/admin')}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" size="lg" disabled={!canSubmit || uploading} className="w-full sm:w-auto">
              {(submitting || uploading) ? (
                <Loader2 className="animate-spin" size={17} />
              ) : (
                <Save size={17} />
              )}
              {submitting || uploading
                ? 'Salvando…'
                : isEdit
                  ? 'Salvar alterações'
                  : 'Criar imóvel'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}