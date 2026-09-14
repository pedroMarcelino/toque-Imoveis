import { api } from '../api/http'
import type { PropertyInput, PropertyListResponse, Property } from '../types/property'
import { propertyListResponseSchema, propertySchema } from '../types/property'

function toQueryString(filters: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') params.set(key, String(value))
  }
  return params.toString()
}

export async function getProperties(filters: Record<string, string | number | undefined> = {}): Promise<PropertyListResponse> {
  const qs = toQueryString(filters)
  const data = await api.get<unknown>(`/property${qs ? `?${qs}` : ''}`)
  return propertyListResponseSchema.parse(data)
}

export async function getProperty(id: string): Promise<Property> {
  const data = await api.get<unknown>(`/property/${id}`)
  return propertySchema.parse(data)
}

export async function createProperty(body: PropertyInput): Promise<Property> {
  const data = await api.post<unknown>('/property', body)
  return propertySchema.parse(data)
}

export async function updateProperty(id: string, body: Partial<PropertyInput>): Promise<Property> {
  const data = await api.patch<unknown>(`/property/${id}`, body)
  return propertySchema.parse(data)
}

export async function deleteProperty(id: string): Promise<unknown> {
  return api.delete(`/property/${id}`)
}

export async function uploadPropertyImages(id: string, files: File[]): Promise<{ message: string; images: Property['images'] }> {
  const formData = new FormData()
  files.forEach((file) => formData.append('images', file))
  return api.uploadFormData(`/property/${id}/images`, formData)
}