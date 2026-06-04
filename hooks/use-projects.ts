import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProjects, getProjectById, getProjectsByMember,
  createProject, updateProject, deleteProject,
} from '@/services/project-service'
import type { Project } from '@/types'

export const projectKeys = {
  all:      ['projects']          as const,
  byId:     (id: string)         => ['projects', id]         as const,
  byMember: (uid: string)        => ['projects', 'member', uid] as const,
}

export function useProjects() {
  return useQuery({ queryKey: projectKeys.all, queryFn: getProjects })
}

export function useProject(id: string) {
  return useQuery({ queryKey: projectKeys.byId(id), queryFn: () => getProjectById(id) })
}

export function useProjectsByMember(userId: string) {
  return useQuery({
    queryKey: projectKeys.byMember(userId),
    queryFn:  () => getProjectsByMember(userId),
    enabled:  !!userId,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: (newProject) => {
      qc.setQueryData<Project[]>(projectKeys.all, (old = []) => [...old, newProject])
    },
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateProject>[1] }) =>
      updateProject(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<Project[]>(projectKeys.all, (old = []) =>
        old.map((p) => (p.id === updated.id ? updated : p)),
      )
      qc.setQueryData(projectKeys.byId(updated.id), updated)
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_v, id) => {
      qc.setQueryData<Project[]>(projectKeys.all, (old = []) =>
        old.filter((p) => p.id !== id),
      )
    },
  })
}
