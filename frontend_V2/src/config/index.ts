export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000'

export const STORAGE_KEYS = {
  token: 'toque.token',
  user: 'toque.user',
} as const

export const CONTACT = {
  phone: '+55 11 3000-0000',
  email: 'contato@toqueimoveis.com.br',
  address: 'Av. Paulista, 1000',
  city: '01310-100 São Paulo, SP',
  whatsapp: '551130000000',
  socials: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
  },
} as const