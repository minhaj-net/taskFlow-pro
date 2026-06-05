// ── Roles ─────────────────────────────────────────────────────
export type Role = 'admin' | 'manager' | 'member'

// ── User ──────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar: string | null
  department: string
  joinedAt: string
  isActive: boolean
}

// ── Auth session (stored in localStorage) ────────────────────
export interface AuthSession {
  user: User
  loggedInAt: string
}

// ── Project ───────────────────────────────────────────────────
export type ProjectStatus = 'active' | 'completed' | 'on-hold'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  deadline: string
  createdAt: string
  updatedAt: string
  ownerId: string
  memberIds: string[]
  taskCount: number
  completedTaskCount: number
}

// ── Task ──────────────────────────────────────────────────────
export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus   = 'todo' | 'in-progress' | 'completed'

export interface TaskComment {
  id: string
  userId: string
  content: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  projectId: string
  assigneeId: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  createdAt: string
  updatedAt: string
  comments: TaskComment[]
}

// ── Notification ──────────────────────────────────────────────
export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'project_update'
  | 'deadline_reminder'
  | 'member_joined'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  link: string
}

// ── Activity log ──────────────────────────────────────────────
export type ActivityAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'completed'
  | 'started'
  | 'assigned'
  | 'added'

export type ActivityEntityType = 'project' | 'task' | 'member'

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: ActivityAction
  entityType: ActivityEntityType
  entityName: string
  entityId: string
  timestamp: string
}

// ── RBAC permissions ──────────────────────────────────────────
export interface RolePermissions {
  canCreateProject: boolean
  canEditProject:   boolean
  canDeleteProject: boolean
  canCreateTask:    boolean
  canEditTask:      boolean
  canDeleteTask:    boolean
  canManageUsers:   boolean
  canViewAnalytics: boolean
  canViewAllProjects: boolean
}

export const ROLE_PERMISSIONS: Record<Role, RolePermissions> = {
  admin: {
    canCreateProject:   true,
    canEditProject:     true,
    canDeleteProject:   true,
    canCreateTask:      true,
    canEditTask:        true,
    canDeleteTask:      true,
    canManageUsers:     true,
    canViewAnalytics:   true,
    canViewAllProjects: true,
  },
  manager: {
    canCreateProject:   true,
    canEditProject:     true,
    canDeleteProject:   true,
    canCreateTask:      true,
    canEditTask:        true,
    canDeleteTask:      false,
    canManageUsers:     false,
    canViewAnalytics:   true,
    canViewAllProjects: true,
  },
  member: {
    canCreateProject:   false,
    canEditProject:     false,
    canDeleteProject:   false,
    canCreateTask:      false,
    canEditTask:        true,
    canDeleteTask:      false,
    canManageUsers:     false,
    canViewAnalytics:   false,
    canViewAllProjects: false,
  },
}

// ── Dashboard redirect by role ────────────────────────────────
export const ROLE_DASHBOARD: Record<Role, string> = {
  admin:   '/dashboard/admin',
  manager: '/dashboard/manager',
  member:  '/dashboard/member',
}
