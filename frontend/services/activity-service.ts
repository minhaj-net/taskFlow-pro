/**
 * services/activity-service.ts
 * All activity data now comes from the real backend API.
 */

import type { ActivityLog, ActivityAction, ActivityEntityType, Role } from '@/types'
import { getToken, getCurrentUser } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

function authHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || `Request failed: ${res.status}`)
  return json
}

// ── GET /api/activities ───────────────────────────────────────
export async function getActivityLogs(limit = 100): Promise<ActivityLog[]> {
  const res = await fetch(`${API_BASE}/activities?limit=${limit}`, { headers: authHeaders() })
  const json = await handleResponse<{ success: boolean; data: ActivityLog[] }>(res)
  return json.data
}

// ── GET /api/activities/role/:role ────────────────────────────
export async function getActivitiesByRole(role: Role, limit = 100): Promise<ActivityLog[]> {
  const res = await fetch(`${API_BASE}/activities/role/${role}?limit=${limit}`, { headers: authHeaders() })
  const json = await handleResponse<{ success: boolean; data: ActivityLog[] }>(res)
  return json.data
}

// ── GET /api/activities/user/:userId ──────────────────────────
export async function getActivitiesByUser(userId: string, limit = 50): Promise<ActivityLog[]> {
  const res = await fetch(`${API_BASE}/activities/user/${userId}?limit=${limit}`, { headers: authHeaders() })
  const json = await handleResponse<{ success: boolean; data: ActivityLog[] }>(res)
  return json.data
}

// ── GET recent (wrapper) ──────────────────────────────────────
export async function getRecentActivity(limit = 10): Promise<ActivityLog[]> {
  return getActivityLogs(limit)
}

// ── POST /api/activities — log a new activity ─────────────────
export async function logActivity(
  userId: string,
  userName: string,
  action: ActivityAction,
  entityType: ActivityEntityType,
  entityName: string,
  entityId: string,
): Promise<ActivityLog> {
  const user = getCurrentUser()
  const userRole = user?.role ?? 'member'

  const res = await fetch(`${API_BASE}/activities`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ userId, userName, userRole, action, entityType, entityName, entityId }),
  })
  const json = await handleResponse<{ success: boolean; data: ActivityLog }>(res)
  return json.data
}

// ── DELETE /api/activities/:id ────────────────────────────────
export async function deleteActivityLog(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/activities/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  await handleResponse<{ success: boolean }>(res)
}
