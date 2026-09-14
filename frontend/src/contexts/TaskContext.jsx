import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { NEXT_STATUS } from '../constants/taskStatuses'
import { taskService } from '../services/tasks/taskService'

const TaskContext = createContext(null)

function getErrorMessage(error) {
  return error?.response?.data?.message ?? error?.message ?? 'Unexpected error'
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState({ assignedTo: '', plannedDate: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadTasks = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const params = {
        assignedTo: filters.assignedTo || undefined,
        plannedDate: filters.plannedDate || undefined,
      }
      const data = await taskService.getTasks(params)
      setTasks(data)
    } catch (loadError) {
      setError(getErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }, [filters.assignedTo, filters.plannedDate])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const createTask = useCallback(async (payload) => {
    setError('')
    const task = await taskService.createTask(payload)
    setTasks((currentTasks) => [...currentTasks, task])

    return task
  }, [])

  const updateTask = useCallback(async (id, payload) => {
    setError('')
    const task = await taskService.updateTask(id, payload)
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) => (currentTask.id === id ? task : currentTask)),
    )

    return task
  }, [])

  const patchTask = useCallback(async (id, payload) => {
    setError('')
    const task = await taskService.patchTask(id, payload)
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) => (currentTask.id === id ? task : currentTask)),
    )

    return task
  }, [])

  const moveTaskForward = useCallback(
    async (task) => {
      const nextStatus = NEXT_STATUS[task.status]

      if (!nextStatus) {
        return task
      }

      return patchTask(task.id, { status: nextStatus })
    },
    [patchTask],
  )

  const deleteTask = useCallback(async (id) => {
    setError('')
    await taskService.deleteTask(id)
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      tasks,
      filters,
      isLoading,
      error,
      setFilters,
      loadTasks,
      createTask,
      updateTask,
      patchTask,
      moveTaskForward,
      deleteTask,
    }),
    [
      tasks,
      filters,
      isLoading,
      error,
      loadTasks,
      createTask,
      updateTask,
      patchTask,
      moveTaskForward,
      deleteTask,
    ],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)

  if (!context) {
    throw new Error('useTasks must be used inside TaskProvider')
  }

  return context
}
