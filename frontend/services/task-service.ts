/**
 * services/task-service.ts
 * All task data now comes from the real backend API.
 * localStorage mock replaced with fetch calls to /api/tasks.
 */

import type { Task } from '@/types'
import { getToken } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ── Auth headers ──────────────────────────────────────────────────────────────
function authHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ── Response handler ──────────────────────────────────────────────────────────
async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || `Request failed: ${res.status}`)
  return json
}

// ── GET /api/tasks ────────────────────────────────────────────────────────────
export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks`, { headers: authHeaders() })
  const json = await handleResponse<{ success: boolean; data: Task[] }>(res)
  return json.data
}

// ── GET /api/tasks/:id ────────────────────────────────────────────────────────
export async function getTaskById(id: string): Promise<Task | undefined> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { headers: authHeaders() })
  if (res.status === 404) return undefined
  const json = await handleResponse<{ success: boolean; data: Task }>(res)
  return json.data
}

// ── GET /api/tasks/project/:projectId ────────────────────────────────────────
export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks/project/${projectId}`, { headers: authHeaders() })
  const json = await handleResponse<{ success: boolean; data: Task[] }>(res)
  return json.data
}

// ── GET /api/tasks/assignee/:userId ──────────────────────────────────────────
export async function getTasksByAssignee(userId: string): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks/assignee/${userId}`, { headers: authHeaders() })
  const json = await handleResponse<{ success: boolean; data: Task[] }>(res)
  return json.data
}

// ── POST /api/tasks ───────────────────────────────────────────────────────────
export async function createTask(
  data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>,
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  const json = await handleResponse<{ success: boolean; data: Task }>(res)
  return json.data
}

// ── PUT /api/tasks/:id ────────────────────────────────────────────────────────
export async function updateTask(
  id: string,
  data: Partial<Pick<Task, 'title' | 'description' | 'assigneeId' | 'priority' | 'status' | 'dueDate' | 'comments'>>,
): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  const json = await handleResponse<{ success: boolean; data: Task }>(res)
  return json.data
}

// ── DELETE /api/tasks/:id ─────────────────────────────────────────────────────
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  await handleResponse<{ success: boolean }>(res)
}
