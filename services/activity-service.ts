import type { ActivityLog, ActivityAction, ActivityEntityType } from '@/types'

const BASE = '/data'
const STORAGE_KEY = 'tfp_activity_logs'

function getLocalLogs(): ActivityLog[] | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

function saveLocalLogs(logs: ActivityLog[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const local = getLocalLogs()
  if (local) {
    return local.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const res = await fetch(`${BASE}/activity-logs.json`)
  if (!res.ok) throw new Error('Failed to fetch activity logs')
  const logs: ActivityLog[] = await res.json()
  saveLocalLogs(logs)
  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
}

export async function getRecentActivity(limit = 10): Promise<ActivityLog[]> {
  const logs = await getActivityLogs()
  return logs.slice(0, limit)
}

export async function logActivity(
  userId: string,
  userName: string,
  action: ActivityAction,
  entityType: ActivityEntityType,
  entityName: string,
  entityId: string,
): Promise<ActivityLog> {
  const logs = await getActivityLogs()
  const newLog: ActivityLog = {
    id: `act-${Date.now()}`,
    userId,
    userName,
    action,
    entityType,
    entityName,
    entityId,
    timestamp: new Date().toISOString(),
  }
  saveLocalLogs([newLog, ...logs])
  return newLog
}
