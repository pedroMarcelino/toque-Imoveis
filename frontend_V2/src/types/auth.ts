import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Informe seu nome'),
    email: z.string().trim().min(1, 'Informe seu email').email('Email inválido'),
    password: z.string().min(6, 'Senha possui menos de 6 caracteres'),
    confirmPassword: z.string().min(6, 'Senha possui menos de 6 caracteres'),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'As senhas não coincidem',
      })
    }
  })

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Informe seu email').email('Email inválido'),
  password: z.string().min(1, 'Informe sua senha'),
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