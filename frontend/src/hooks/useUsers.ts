import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as userService from '../services/userService'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  })
}

export function useApproveUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userService.approveUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}