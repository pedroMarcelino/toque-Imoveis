// CENTRAL DE CONTATO — edite aqui, reflete no site inteiro.
// Estilo .env: altere apenas as variáveis abaixo, sem precisar mexer no código.
// Atenção: para o whatsapp, informe APENAS dígitos (DDI + DDD + número), ex.: 551130000000.

export const CONTACT = {
  // Telefone exibido no rodapé (formato livre)
  phone: '+55 11 3000-0000',
  // WhatsApp em dígitos, usado nos links wa.me (sem +, espaços ou traços)
  whatsapp: '551130000000',
  // E-mail de contato
  email: 'contato@toqueimoveis.com.br',
  // Endereço exibido no rodapé
  address: 'Av. Paulista, 1000',
  city: '01310-100 São Paulo, SP',
  // Redes sociais (pode deixar sem link se ainda não tiver)
  socials: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
  },
} as const