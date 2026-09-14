import { useMemo } from 'react'
import { TASK_COLUMNS, TASK_STATUS } from '../constants/taskStatuses'
import { useTasks } from '../contexts/TaskContext'
import { formatDate } from '../utils/date'

function getStatusTitle(status) {
  return TASK_COLUMNS.find((column) => column.key === status)?.title ?? status
}

export function PeoplePage() {
  const { tasks, isLoading, error } = useTasks()

  const people = useMemo(() => {
    const groupedTasks = new Map()

    for (const task of tasks) {
      const person = task.assignedTo?.trim() || 'Unassigned'
      const personTasks = groupedTasks.get(person) ?? []
      personTasks.push(task)
      groupedTasks.set(person, personTasks)
    }

    return [...groupedTasks.entries()]
      .map(([person, personTasks]) => {
        const sortedTasks = [...personTasks].sort((firstTask, secondTask) => {
          if (firstTask.status === secondTask.status) {
            return firstTask.plannedDate.localeCompare(secondTask.plannedDate)
          }

          return firstTask.status.localeCompare(secondTask.status)
        })

        return {
          person,
          tasks: sortedTasks,
          total: sortedTasks.length,
          todo: sortedTasks.filter((task) => task.status === TASK_STATUS.TODO).length,
          inProgress: sortedTasks.filter((task) => task.status === TASK_STATUS.IN_PROGRESS).length,
          completed: sortedTasks.filter((task) => task.status === TASK_STATUS.COMPLETED).length,
        }
      })
      .sort((firstPerson, secondPerson) => secondPerson.total - firstPerson.total)
  }, [tasks])

  return (
    <main className="page">
      <div className="people-heading">
        <div>
          <h2 className="page-title">People</h2>
          <p className="page-subtitle">Tasks grouped by assignee and status.</p>
        </div>
        <div className="people-summary">
          <span>{people.length} people</span>
          <span>{tasks.length} tasks</span>
        </div>
      </div>

      <div className={`state-line${error ? ' state-line--error' : ''}`}>
        {error || (isLoading ? 'Loading people...' : '')}
      </div>

      {people.length === 0 ? (
        <div className="empty-panel">No assigned tasks yet.</div>
      ) : (
        <div className="people-grid">
          {people.map((person) => (
            <section className="person-panel" key={person.person}>
              <div className="person-panel__header">
                <div>
                  <h3 className="person-panel__name">{person.person}</h3>
                  <span className="person-panel__meta">{person.total} total tasks</span>
                </div>
                <div className="person-stats" aria-label={`${person.person} task counts`}>
                  <span className="person-stat">{person.todo} todo</span>
                  <span className="person-stat">{person.inProgress} active</span>
                  <span className="person-stat">{person.completed} done</span>
                </div>
              </div>
              <div className="person-panel__tasks">
                {person.tasks.map((task) => (
                  <div className="person-task" key={task.id}>
                    <div>
                      <strong>{task.taskDescription}</strong>
                      <span>Planned {formatDate(task.plannedDate)}</span>
                    </div>
                    <div className="person-task__badges">
                      {task.isOverdue ? <span className="overdue-badge">Overdue</span> : null}
                      <span className={`status-pill status-pill--${task.status}`}>{getStatusTitle(task.status)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}
