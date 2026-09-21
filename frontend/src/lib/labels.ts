const LABELS: Record<string, string> = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  terreno: 'Terreno',
  comercial: 'Comercial',
  chacara: 'Chácara',
  sobrado: 'Sobrado',
  venda: 'Venda',
  aluguel: 'Aluguel',
  disponivel: 'Disponível',
  vendido: 'Vendido',
  alugado: 'Alugado',
  indisponivel: 'Indisponível',
}

export function label(value?: string): string {
  return (value && LABELS[value]) || value || ''
}

export function stableIndex(value: string, length: number): number {
  return Array.from(value).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % length
}