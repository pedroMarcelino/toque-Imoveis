export interface CepAddress {
  street: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export function sanitizeCep(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8)
}

export function formatCep(value: string): string {
  const digits = sanitizeCep(value)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export async function buscarCep(cep: string): Promise<CepAddress | null> {
  const digits = sanitizeCep(cep)
  if (digits.length !== 8) return null

  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)

  if (!res.ok) {
    throw new Error('Erro ao consultar o CEP')
  }

  const data = (await res.json()) as {
    logradouro?: string
    bairro?: string
    localidade?: string
    uf?: string
    erro?: boolean
  }

  if (data.erro) return null

  return {
    street: data.logradouro ?? '',
    neighborhood: data.bairro ?? '',
    city: data.localidade ?? '',
    state: data.uf ?? '',
    zipCode: digits,
  }
}