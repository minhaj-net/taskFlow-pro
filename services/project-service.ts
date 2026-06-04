import type { Project, ProjectStatus } from '@/types'

const BASE = '/data'
const STORAGE_KEY = 'tfp_projects'

function getLocalProjects(): Project[] | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

function saveLocalProjects(projects: Project[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export async function getProjects(): Promise<Project[]> {
  const local = getLocalProjects()
  if (local) return local

  const res = await fetch(`${BASE}/projects.json`)
  if (!res.ok) throw new Error('Failed to fetch projects')
  const data = await res.json()
  saveLocalProjects(data)
  return data
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects()
  return projects.find((p) => p.id === id)
}

export async function getProjectsByMember(userId: string): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter((p) => p.memberIds.includes(userId))
}

// ── Mutations (stateful using localStorage cache) ───────────────

export async function createProject(
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'taskCount' | 'completedTaskCount'>,
): Promise<Project> {
  await new Promise((r) => setTimeout(r, 400)) // simulate latency
  const projects = await getProjects()
  const newProject: Project = {
    ...data,
    id: `p-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    taskCount: 0,
    completedTaskCount: 0,
  }
  saveLocalProjects([...projects, newProject])
  return newProject
}

export async function updateProject(
  id: string,
  data: Partial<Pick<Project, 'name' | 'description' | 'deadline' | 'status' | 'memberIds' | 'taskCount' | 'completedTaskCount'>>,
): Promise<Project> {
  await new Promise((r) => setTimeout(r, 400))
  const projects = await getProjects()
  const index = projects.findIndex((p) => p.id === id)
  if (index === -1) throw new Error(`Project ${id} not found`)
  const updated = {
    ...projects[index],
    ...data,
    updatedAt: new Date().toISOString()
  }
  projects[index] = updated
  saveLocalProjects(projects)
  return updated
}

export async function deleteProject(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300))
  const projects = await getProjects()
  saveLocalProjects(projects.filter((p) => p.id !== id))
}
