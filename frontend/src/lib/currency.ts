export function formatCurrencyInput(value: string, maxDigits = 14): string {
  const digits = value.replace(/\D/g, '').slice(0, maxDigits)
  if (!digits) return ''
  const reais = Number(digits) / 100
  return reais.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, '')
  if (!digits) return 0
  return Number(digits) / 100
}