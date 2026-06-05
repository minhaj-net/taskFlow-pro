/**
 * Client-side auth store — persisted to localStorage.
 * Stores both the user object and the JWT token returned by the backend.
 */
import type { AuthSession, User } from '@/types'

const SESSION_KEY = 'tfp_session'

export interface StoredSession extends AuthSession {
  token?: string
}

export function getSession(): StoredSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as StoredSession) : null
  } catch {
    return null
  }
}

export function saveSession(user: User, token?: string): StoredSession {
  const session: StoredSession = {
    user,
    loggedInAt: new Date().toISOString(),
    ...(token ? { token } : {}),
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): User | null {
  return getSession()?.user ?? null
}

export function getToken(): string | null {
  return getSession()?.token ?? null
}
