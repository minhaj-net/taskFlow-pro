import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications, markAsRead, markAllAsRead,
  deleteNotification, clearAllNotifications,
} from '@/services/notification-service'
import { getToken } from '@/lib/auth'
import type { Notification } from '@/types'

export const notificationKeys = {
  all:    ['notifications'] as const,
  byUser: (uid: string) => ['notifications', 'user', uid] as const,
}

export function useNotifications(_userId?: string) {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn:  () => getNotifications(),
    enabled:  !!getToken(), // only fetch when logged in
    refetchInterval: 30_000,
  })
}

export function useMarkAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: (_v, id) => {
      qc.setQueriesData<Notification[]>(
        { queryKey: notificationKeys.all },
        (old = []) => old.map(n => n.id === id ? { ...n, read: true } : n),
      )
    },
  })
}

export function useMarkAllAsRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      qc.setQueriesData<Notification[]>(
        { queryKey: notificationKeys.all },
        (old = []) => old.map(n => ({ ...n, read: true })),
      )
    },
  })
}

export function useDeleteNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_v, id) => {
      qc.setQueriesData<Notification[]>(
        { queryKey: notificationKeys.all },
        (old = []) => old.filter(n => n.id !== id),
      )
    },
  })
}

export function useClearAllNotifications() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: () => {
      qc.setQueryData<Notification[]>(notificationKeys.all, [])
    },
  })
}
