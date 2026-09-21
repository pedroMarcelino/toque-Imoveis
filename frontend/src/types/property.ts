import { z } from 'zod'

export const PROPERTY_TYPES = ['casa', 'apartamento', 'terreno', 'comercial', 'chacara', 'sobrado'] as const
export const PROPERTY_PURPOSES = ['venda', 'aluguel'] as const
export const PROPERTY_STATUSES = ['disponivel', 'vendido', 'alugado', 'indisponivel'] as const

export const propertyTypeSchema = z.enum(PROPERTY_TYPES)
export const propertyPurposeSchema = z.enum(PROPERTY_PURPOSES)
export const propertyStatusSchema = z.enum(PROPERTY_STATUSES)

const addressSchema = z.object({
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string().optional(),
})

const propertyImageSchema = z.object({
  url: z.string(),
  publicId: z.string(),
  _id: z.string().optional(),
})

const nonNegativeNumber = z.coerce.number().min(0)

export const propertyInputSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  type: propertyTypeSchema,
  purpose: propertyPurposeSchema,
  price: nonNegativeNumber,
  area: nonNegativeNumber,
  bedrooms: nonNegativeNumber.default(0),
  suites: nonNegativeNumber.default(0),
  bathrooms: nonNegativeNumber.default(0),
  parkingSpaces: nonNegativeNumber.default(0),
  condominiumFee: nonNegativeNumber.default(0),
  iptu: nonNegativeNumber.default(0),
  address: addressSchema,
  features: z.array(z.string()).default([]),
  status: propertyStatusSchema.default('disponivel'),
})

export const propertySchema = propertyInputSchema.extend({
  _id: z.string(),
  images: z.array(propertyImageSchema).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const propertyFiltersSchema = z.object({
  search: z.string().optional(),
  tipo: z.string().optional(),
  finalidade: z.string().optional(),
  cidade: z.string().optional(),
  quartos: z.coerce.number().optional(),
  minPreco: z.coerce.number().optional(),
  maxPreco: z.coerce.number().optional(),
  status: z.string().optional(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().max(50).optional(),
})

export const propertyListResponseSchema = z.object({
  properties: z.array(propertySchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
})

export type PropertyType = z.infer<typeof propertyTypeSchema>
export type PropertyPurpose = z.infer<typeof propertyPurposeSchema>
export type PropertyStatus = z.infer<typeof propertyStatusSchema>
export type PropertyAddress = z.infer<typeof addressSchema>
export type PropertyImage = z.infer<typeof propertyImageSchema>
export type PropertyInput = z.infer<typeof propertyInputSchema>
export type Property = z.infer<typeof propertySchema>
export type PropertyFilters = z.infer<typeof propertyFiltersSchema>
export type PropertyListResponse = z.infer<typeof propertyListResponseSchema>

export const fallbackImages = [
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
]