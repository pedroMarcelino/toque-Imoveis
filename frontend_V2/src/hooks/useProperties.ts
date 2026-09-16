import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import * as propertyService from '../services/propertyService'
import type { PropertyFilters, PropertyListResponse } from '../types/property'

type PropertiesQueryOptions = Omit<UseQueryOptions<PropertyListResponse>, 'queryKey' | 'queryFn'>

export function useProperties(filters: PropertyFilters = {}, options?: PropertiesQueryOptions) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getProperties(filters),
    ...options,
  })
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getProperty(id),
    enabled: Boolean(id),
  })
}

export function useCreateProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: propertyService.createProperty,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  })
}

export function useUpdateProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof propertyService.updateProperty>[1] }) =>
      propertyService.updateProperty(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['properties'] })
      qc.invalidateQueries({ queryKey: ['property', vars.id] })
    },
  })
}

export function useDeleteProperty() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: propertyService.deleteProperty,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  })
}

export function useUploadPropertyImages() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) =>
      propertyService.uploadPropertyImages(id, files),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['property', vars.id] })
    },
  })
}