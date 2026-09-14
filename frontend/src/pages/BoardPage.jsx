import { useMemo, useState } from 'react'
import { TaskBoard } from '../components/board/TaskBoard'
import { TaskModal } from '../components/tasks/TaskModal'
import { useTasks } from '../contexts/TaskContext'

export function BoardPage() {
  const {
    tasks,
    filters,
    isLoading,
    error,
    setFilters,
    createTask,
    updateTask,
    patchTask,
    moveTaskForward,
    deleteTask,
  } = useTasks()
  const [modalTask, setModalTask] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const visibleError = formError || error

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((firstTask, secondTask) => {
        if (firstTask.plannedDate === secondTask.plannedDate) {
          return firstTask.id - secondTask.id
        }

        return firstTask.plannedDate.localeCompare(secondTask.plannedDate)
      }),
    [tasks],
  )

  function openCreateModal() {
    setFormError('')
    setModalTask(null)
    setIsModalOpen(true)
  }

  function openEditModal(task) {
    setFormError('')
    setModalTask(task)
    setIsModalOpen(true)
  }

  function closeModal() {
    setFormError('')
    setIsModalOpen(false)
    setModalTask(null)
  }

  async function handleSubmit(payload) {
    setIsSubmitting(true)
    setFormError('')

    try {
      if (modalTask) {
        await updateTask(modalTask.id, payload)
      } else {
        await createTask(payload)
      }

      closeModal()
    } catch (submitError) {
      setFormError(submitError?.response?.data?.message ?? submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleMoveTask(task) {
    try {
      await moveTaskForward(task)
    } catch (moveError) {
      setFormError(moveError?.response?.data?.message ?? moveError.message)
    }
  }

  async function handleDropTask(taskId, targetStatus) {
    const task = tasks.find((currentTask) => currentTask.id === taskId)

    if (!task || task.status === targetStatus) {
      return
    }

    try {
      setFormError('')
      await patchTask(task.id, { status: targetStatus })
    } catch (dropError) {
      setFormError(dropError?.response?.data?.message ?? dropError.message)
    }
  }

  async function handleDeleteTask(task) {
    const confirmed = window.confirm(`Delete "${task.taskDescription}"?`)

    if (!confirmed) {
      return
    }

    try {
      await deleteTask(task.id)
    } catch (deleteError) {
      setFormError(deleteError?.response?.data?.message ?? deleteError.message)
    }
  }

  return (
    <main className="page">
      <div className="toolbar">
        <div className="filters">
          <div className="field">
            <label htmlFor="assignedToFilter">Assigned to</label>
            <input
              id="assignedToFilter"
              className="input"
              value={filters.assignedTo}
              onChange={(event) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  assignedTo: event.target.value,
                }))
              }
              placeholder="Filter by person"
            />
          </div>
          <div className="field">
            <label htmlFor="plannedDateFilter">Planned date</label>
            <input
              id="plannedDateFilter"
              className="input"
              type="date"
              value={filters.plannedDate}
              onChange={(event) =>
                setFilters((currentFilters) => ({
                  ...currentFilters,
                  plannedDate: event.target.value,
                }))
              }
            />
          </div>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setFilters({ assignedTo: '', plannedDate: '' })}
          >
            Clear filters
          </button>
        </div>
        <button type="button" className="button button--primary" onClick={openCreateModal}>
          New task
        </button>
      </div>

      <div className={`state-line${visibleError ? ' state-line--error' : ''}`}>
        {visibleError || (isLoading ? 'Loading tasks...' : '')}
      </div>

      <TaskBoard
        tasks={sortedTasks}
        onEditTask={openEditModal}
        onDeleteTask={handleDeleteTask}
        onMoveTask={handleMoveTask}
        onDropTask={handleDropTask}
      />

      {isModalOpen ? (
        <TaskModal
          task={modalTask}
          isSubmitting={isSubmitting}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      ) : null}
    </main>
  )
}
