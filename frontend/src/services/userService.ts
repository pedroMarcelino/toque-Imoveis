import { api } from '../api/http'
import type { AuthUser } from '../types/auth'
import { z } from 'zod'
import { authUserSchema } from '../types/auth'

const userListResponseSchema = z.object({
  users: z.array(authUserSchema),
})

const userResponseSchema = z.object({
  message: z.string(),
  user: authUserSchema,
})

export async function getUsers(): Promise<AuthUser[]> {
  const data = await api.get<unknown>('/user')
  return userListResponseSchema.parse(data).users
}

export async function approveUser(id: string): Promise<AuthUser> {
  const data = await api.patch<unknown>(`/user/${id}/approve`)
  return userResponseSchema.parse(data).user
}