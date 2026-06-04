import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTasks, getTaskById, getTasksByProject,
  getTasksByAssignee, createTask, updateTask, deleteTask,
} from '@/services/task-service'
import type { Task } from '@/types'

export const taskKeys = {
  all:         ['tasks']                       as const,
  byId:        (id: string)                   => ['tasks', id]               as const,
  byProject:   (pid: string)                  => ['tasks', 'project', pid]   as const,
  byAssignee:  (uid: string)                  => ['tasks', 'assignee', uid]  as const,
}

export function useTasks() {
  return useQuery({ queryKey: taskKeys.all, queryFn: getTasks })
}

export function useTask(id: string) {
  return useQuery({ queryKey: taskKeys.byId(id), queryFn: () => getTaskById(id) })
}

export function useTasksByProject(projectId: string) {
  return useQuery({
    queryKey: taskKeys.byProject(projectId),
    queryFn:  () => getTasksByProject(projectId),
    enabled:  !!projectId,
  })
}

export function useTasksByAssignee(userId: string) {
  return useQuery({
    queryKey: taskKeys.byAssignee(userId),
    queryFn:  () => getTasksByAssignee(userId),
    enabled:  !!userId,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: (newTask) => {
      qc.setQueryData<Task[]>(taskKeys.all, (old = []) => [...old, newTask])
      qc.invalidateQueries({ queryKey: taskKeys.byProject(newTask.projectId) })
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateTask>[1] }) =>
      updateTask(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<Task[]>(taskKeys.all, (old = []) =>
        old.map((t) => (t.id === updated.id ? updated : t)),
      )
      qc.setQueryData(taskKeys.byId(updated.id), updated)
      qc.invalidateQueries({ queryKey: taskKeys.byProject(updated.projectId) })
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_v, id) => {
      qc.setQueryData<Task[]>(taskKeys.all, (old = []) =>
        old.filter((t) => t.id !== id),
      )
    },
  })
}
