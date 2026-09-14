import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().trim().email(),
  password: z.string().min(6),
})

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export const authUserSchema = z.object({
  _id: z.string(),
  name: z.string().optional(),
  email: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const authResponseSchema = z.object({
  message: z.string(),
  user: authUserSchema,
  token: z.string(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type AuthUser = z.infer<typeof authUserSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>