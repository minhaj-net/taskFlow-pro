/**
 * services/project-service.ts
 * All project data now comes from the real backend API.
 * localStorage mock has been replaced with fetch calls to /api/projects.
 */

import type { Project, ProjectStatus } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ── Helper: get JWT from session stored by auth.ts ────────────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('tfp_session')
    if (!raw) return null
    const session = JSON.parse(raw)
    return session?.token ?? null
  } catch {
    return null
  }
}

// ── Helper: build headers with Authorization ──────────────────────────────────
function authHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ── Helper: handle API response ───────────────────────────────────────────────
async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`)
  }
  return json
}

// ── GET /api/projects ─────────────────────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`, {
    headers: authHeaders(),
  })
  const json = await handleResponse<{ success: boolean; data: Project[] }>(res)
  return json.data
}

// ── GET /api/projects/:id ─────────────────────────────────────────────────────
export async function getProjectById(id: string): Promise<Project | undefined> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    headers: authHeaders(),
  })
  if (res.status === 404) return undefined
  const json = await handleResponse<{ success: boolean; data: Project }>(res)
  return json.data
}

// ── GET /api/projects/member/:userId ─────────────────────────────────────────
export async function getProjectsByMember(userId: string): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects/member/${userId}`, {
    headers: authHeaders(),
  })
  const json = await handleResponse<{ success: boolean; data: Project[] }>(res)
  return json.data
}

// ── POST /api/projects ────────────────────────────────────────────────────────
export async function createProject(
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'taskCount' | 'completedTaskCount'>,
): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  const json = await handleResponse<{ success: boolean; data: Project }>(res)
  return json.data
}

// ── PUT /api/projects/:id ─────────────────────────────────────────────────────
export async function updateProject(
  id: string,
  data: Partial<Pick<Project, 'name' | 'description' | 'deadline' | 'status' | 'memberIds' | 'taskCount' | 'completedTaskCount'>>,
): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  const json = await handleResponse<{ success: boolean; data: Project }>(res)
  return json.data
}

// ── DELETE /api/projects/:id ──────────────────────────────────────────────────
export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  await handleResponse<{ success: boolean }>(res)
}
