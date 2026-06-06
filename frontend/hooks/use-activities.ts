import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getActivityLogs, getActivitiesByRole,
  getActivitiesByUser, getRecentActivity, deleteActivityLog,
} from '@/services/activity-service'
import type { Role } from '@/types'

export const activityKeys = {
  all:      ['activities']                         as const,
  byRole:   (role: Role)      => ['activities', 'role', role]     as const,
  byUser:   (uid: string)     => ['activities', 'user', uid]      as const,
  recent:   (limit: number)   => ['activities', 'recent', limit]  as const,
}

export function useActivities(limit = 100) {
  return useQuery({ queryKey: activityKeys.all, queryFn: () => getActivityLogs(limit) })
}

export function useActivitiesByRole(role: Role, limit = 100) {
  return useQuery({
    queryKey: activityKeys.byRole(role),
    queryFn:  () => getActivitiesByRole(role, limit),
    enabled:  !!role,
  })
}

export function useActivitiesByUser(userId: string, limit = 50) {
  return useQuery({
    queryKey: activityKeys.byUser(userId),
    queryFn:  () => getActivitiesByUser(userId, limit),
    enabled:  !!userId,
  })
}

export function useRecentActivities(limit = 10) {
  return useQuery({
    queryKey: activityKeys.recent(limit),
    queryFn:  () => getRecentActivity(limit),
  })
}

export function useDeleteActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteActivityLog,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: activityKeys.all })
    },
  })
}
