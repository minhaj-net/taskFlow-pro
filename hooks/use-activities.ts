import { useQuery } from '@tanstack/react-query'
import { getActivityLogs, getRecentActivity } from '@/services/activity-service'

export const activityKeys = {
  all:    ['activities']            as const,
  recent: (limit: number)          => ['activities', 'recent', limit] as const,
}

export function useActivities() {
  return useQuery({ queryKey: activityKeys.all, queryFn: getActivityLogs })
}

export function useRecentActivities(limit = 10) {
  return useQuery({
    queryKey: activityKeys.recent(limit),
    queryFn:  () => getRecentActivity(limit),
  })
}
