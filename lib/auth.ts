/**
 * Client-side auth store — persisted to localStorage.
 * No server sessions are used (static/mock setup).
 * Replace this module with real API calls when integrating a backend.
 */
import type { AuthSession, User } from '@/types'

const SESSION_KEY = 'tfp_session'

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    return null
  }
}

export function saveSession(user: User): AuthSession {
  const session: AuthSession = { user, loggedInAt: new Date().toISOString() }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): User | null {
  return getSession()?.user ?? null
}
