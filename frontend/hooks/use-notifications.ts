import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications, markAsRead, markAllAsRead,
} from '@/services/notification-service'
import type { Notification } from '@/types'

export const notificationKeys = {
  all:     ['notifications']            as const,
  byUser:  (uid: string)               => ['notifications', 'user', uid] as const,
}

export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: userId ? notificationKeys.byUser(userId) : notificationKeys.all,
    queryFn:  () => getNotifications(userId),
  })
}

export function useMarkAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (_v, id) => {
      // Optimistically update all notification caches
      qc.setQueriesData<Notification[]>(
        { queryKey: notificationKeys.all },
        (old = []) => old.map((n) => (n.id === id ? { ...n, read: true } : n)),
      )
    },
  })
}

export function useMarkAllAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      qc.setQueriesData<Notification[]>(
        { queryKey: notificationKeys.all },
        (old = []) => old.map((n) => ({ ...n, read: true })),
      )
    },
  })
}
