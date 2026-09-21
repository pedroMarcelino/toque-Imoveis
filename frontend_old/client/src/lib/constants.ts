export const CONTACT = {
  phone: "+55 11 3000-0000",
  email: "contato@toqueimoveis.com.br",
  address: "Av. Paulista, 1000",
  city: "01310-100 São Paulo, SP",
  whatsapp: "551130000000",
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  },
};

export const fallbackImages = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
];

export function formatBRL(value: string | number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

const LABELS: Record<string, string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  terreno: "Terreno",
  comercial: "Comercial",
  chacara: "Chácara",
  sobrado: "Sobrado",
  venda: "Venda",
  aluguel: "Aluguel",
  disponivel: "Disponível",
  vendido: "Vendido",
  alugado: "Alugado",
  indisponivel: "Indisponível",
};

export function label(value?: string): string {
  return (value && LABELS[value]) || value || "";
}

export function stableIndex(value: string, length: number): number {
  return (
    Array.from(value).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % length
  );
}