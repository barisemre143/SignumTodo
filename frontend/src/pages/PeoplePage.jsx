import { useMemo } from 'react'
import { TASK_COLUMNS, TASK_STATUS } from '../constants/taskStatuses'
import { useLanguage } from '../contexts/LanguageContext'
import { useTasks } from '../contexts/TaskContext'
import { formatDate } from '../utils/date'
import { translateError } from '../utils/errors'

function getStatusTitle(status, t) {
  const column = TASK_COLUMNS.find((currentColumn) => currentColumn.key === status)

  return column ? t(column.titleKey) : status
}

export function PeoplePage() {
  const { tasks, isLoading, error } = useTasks()
  const { language, t } = useLanguage()

  const people = useMemo(() => {
    const groupedTasks = new Map()

    for (const task of tasks) {
      const person = task.assignedTo?.trim() || t('unassigned')
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
  }, [tasks, t])

  return (
    <main className="page">
      <div className="people-heading">
        <div>
          <h2 className="page-title">{t('peopleTitle')}</h2>
          <p className="page-subtitle">{t('peopleSubtitle')}</p>
        </div>
        <div className="people-summary">
          <span>{people.length} {t('peopleCount')}</span>
          <span>{tasks.length} {t('taskCount')}</span>
        </div>
      </div>

      <div className={`state-line${error ? ' state-line--error' : ''}`}>
        {translateError(error, language) || (isLoading ? t('loadingPeople') : '')}
      </div>

      {people.length === 0 ? (
        <div className="empty-panel">{t('emptyPeople')}</div>
      ) : (
        <div className="people-grid">
          {people.map((person) => (
            <section className="person-panel" key={person.person}>
              <div className="person-panel__header">
                <div>
                  <h3 className="person-panel__name">{person.person}</h3>
                  <span className="person-panel__meta">
                    {t('totalTasksPrefix')} {person.total} {t('totalTasksSuffix')}
                  </span>
                </div>
                <div className="person-stats" aria-label={`${person.person} ${t('taskCountsLabel')}`}>
                  <span className="person-stat">{person.todo} {t('todoShort')}</span>
                  <span className="person-stat">{person.inProgress} {t('activeShort')}</span>
                  <span className="person-stat">{person.completed} {t('doneShort')}</span>
                </div>
              </div>
              <div className="person-panel__tasks">
                {person.tasks.map((task) => (
                  <div className="person-task" key={task.id}>
                    <div>
                      <strong>{task.taskDescription}</strong>
                      <span>{t('plannedPrefix')}: {formatDate(task.plannedDate)}</span>
                    </div>
                    <div className="person-task__badges">
                      {task.isOverdue ? <span className="overdue-badge">{t('overdue')}</span> : null}
                      <span className={`status-pill status-pill--${task.status}`}>{getStatusTitle(task.status, t)}</span>
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
