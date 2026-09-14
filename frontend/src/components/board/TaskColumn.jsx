import { TaskCard } from './TaskCard'
import { useLanguage } from '../../contexts/LanguageContext'

export function TaskColumn({ column, tasks, onEditTask, onDeleteTask, onMoveTask, onDropTask }) {
  const { t } = useLanguage()

  function handleDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(event) {
    event.preventDefault()
    const taskId = Number(event.dataTransfer.getData('text/plain'))

    if (!Number.isNaN(taskId)) {
      onDropTask(taskId, column.key)
    }
  }

  return (
    <section
      className="column"
      style={{ '--status-color': column.color }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="column__header">
        <h2 className="column__title">
          <span className="status-dot" />
          {t(column.titleKey)}
        </h2>
        <span className="count-badge">{tasks.length}</span>
      </div>
      <div className="column__body">
        {tasks.length === 0 ? (
          <div className="empty-column">{t('emptyColumn')}</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onMoveTask={onMoveTask}
            />
          ))
        )}
      </div>
    </section>
  )
}
