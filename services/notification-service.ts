import type { Notification, NotificationType } from '@/types'

const BASE = '/data'
const STORAGE_KEY = 'tfp_notifications'

function getLocalNotifications(): Notification[] | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

function saveLocalNotifications(notifications: Notification[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
}

export async function getNotifications(userId?: string): Promise<Notification[]> {
  const local = getLocalNotifications()
  let all: Notification[] = []
  if (local) {
    all = local
  } else {
    const res = await fetch(`${BASE}/notifications.json`)
    if (!res.ok) throw new Error('Failed to fetch notifications')
    all = await res.json()
    saveLocalNotifications(all)
  }

  const sorted = all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
  return userId ? sorted.filter((n) => n.userId === userId) : sorted
}

export async function markAsRead(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 200))
  const notifications = getLocalNotifications()
  if (!notifications) return
  const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  saveLocalNotifications(updated)
}

export async function markAllAsRead(userId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300))
  const notifications = getLocalNotifications()
  if (!notifications) return
  const updated = notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n))
  saveLocalNotifications(updated)
}

export async function addNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link: string,
): Promise<Notification> {
  const notifications = getLocalNotifications() || []
  const newNotif: Notification = {
    id: `notif-${Date.now()}`,
    userId,
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    link,
  }
  saveLocalNotifications([newNotif, ...notifications])
  return newNotif
}
