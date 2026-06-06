/**
 * services/user-service.ts
 * Auth + User management — all calls go to the real backend API.
 */

import type { User, AuthSession, Role } from '@/types'
import { saveSession, clearSession, getToken } from '@/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── AUTH ──────────────────────────────────────────────────────────────────────

export async function loginWithCredentials(email: string, password: string): Promise<AuthSession> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Invalid email or password.')
  return saveSession(json.user as User, json.token)
}

export function logout(): void {
  clearSession()
}

// ── GET /api/users ────────────────────────────────────────────────────────────
export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`, { headers: authHeaders() })
  const json = await handleResponse<{ success: boolean; data: User[] }>(res)
  return json.data
}

// ── GET /api/users/:id ────────────────────────────────────────────────────────
export async function getUserById(id: string): Promise<User | undefined> {
  const res = await fetch(`${API_BASE}/users/${id}`, { headers: authHeaders() })
  if (res.status === 404) return undefined
  const json = await handleResponse<{ success: boolean; data: User }>(res)
  return json.data
}

// ── PUT /api/users/:id ────────────────────────────────────────────────────────
export async function updateUser(
  id: string,
  data: Partial<{ role: Role; isActive: boolean; department: string; name: string }>,
): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  const json = await handleResponse<{ success: boolean; data: User }>(res)
  return json.data
}

// ── DELETE /api/users/:id ─────────────────────────────────────────────────────
export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  await handleResponse<{ success: boolean }>(res)
}
