import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, getUserById, updateUser, deleteUser } from '@/services/user-service'
import type { User } from '@/types'

export const userKeys = {
  all:  ['users']         as const,
  byId: (id: string) => ['users', id] as const,
}

export function useUsers() {
  return useQuery({ queryKey: userKeys.all, queryFn: getUsers })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.byId(id),
    queryFn:  () => getUserById(id),
    enabled:  !!id,
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateUser>[1] }) =>
      updateUser(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<User[]>(userKeys.all, (old = []) =>
        old.map((u) => (u.id === updated.id ? updated : u)),
      )
      qc.setQueryData(userKeys.byId(updated.id), updated)
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_v, id) => {
      qc.setQueryData<User[]>(userKeys.all, (old = []) =>
        old.filter((u) => u.id !== id),
      )
    },
  })
}
