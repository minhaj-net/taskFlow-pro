import { useQuery } from '@tanstack/react-query'
import { getUsers, getUserById } from '@/services/user-service'

export const userKeys = {
  all:   ['users']              as const,
  byId:  (id: string)          => ['users', id] as const,
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
