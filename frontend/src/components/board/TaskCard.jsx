import { NEXT_STATUS, TASK_STATUS } from '../../constants/taskStatuses'
import { useLanguage } from '../../contexts/LanguageContext'
import { formatDate } from '../../utils/date'

function getMoveLabel(status, t) {
  if (status === TASK_STATUS.TODO) {
    return t('start')
  }

  if (status === TASK_STATUS.IN_PROGRESS) {
    return t('complete')
  }

  return ''
}

export function TaskCard({ task, onEditTask, onDeleteTask, onMoveTask }) {
  const canMove = Boolean(NEXT_STATUS[task.status])
  const { t } = useLanguage()

  function handleDragStart(event) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(task.id))
  }

  return (
    <article
      className={`task-card${task.isOverdue ? ' task-card--overdue' : ''}`}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-card__top">
        <div>
          <h3 className="task-card__title">{task.taskDescription}</h3>
          {task.isOverdue ? <span className="overdue-badge">{t('overdue')}</span> : null}
        </div>
        <div className="task-card__actions">
          <button
            type="button"
            className="icon-button"
            aria-label={t('editTaskAction')}
            title={t('editTaskAction')}
            onClick={() => onEditTask(task)}
          >
            E
          </button>
          <button
            type="button"
            className="icon-button icon-button--danger"
            aria-label={t('deleteTaskAction')}
            title={t('deleteTaskAction')}
            onClick={() => onDeleteTask(task)}
          >
            X
          </button>
        </div>
      </div>
      <div className="task-card__meta">
        <span>{t('assignedPrefix')}: {task.assignedTo}</span>
        <span>{t('plannedPrefix')}: {formatDate(task.plannedDate)}</span>
      </div>
      <div className="task-card__footer">
        {canMove ? (
          <button type="button" className="button button--secondary" onClick={() => onMoveTask(task)}>
            {getMoveLabel(task.status, t)}
          </button>
        ) : null}
      </div>
    </article>
  )
}
