import type { User, AuthSession } from '@/types'
import { saveSession, clearSession } from '@/lib/auth'

const BASE = '/data'

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${BASE}/users.json`)
  if (!res.ok) throw new Error('Failed to fetch users')
  // Strip password field from returned data
  const raw: (User & { password?: string })[] = await res.json()
  return raw.map(({ password: _p, ...u }) => u)
}

async function fetchUsersRaw(): Promise<(User & { password: string })[]> {
  const res = await fetch(`${BASE}/users.json`)
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<AuthSession> {
  const users = await fetchUsersRaw()
  const match = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )
  if (!match) throw new Error('Invalid email or password.')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _p, ...user } = match
  return saveSession(user as User)
}

export async function getUsers(): Promise<User[]> {
  return fetchUsers()
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await fetchUsers()
  return users.find((u) => u.id === id)
}

export function logout(): void {
  clearSession()
}
