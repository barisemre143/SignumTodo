import { TaskCard } from './TaskCard'

export function TaskColumn({ column, tasks, onEditTask, onDeleteTask, onMoveTask, onDropTask }) {
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
          {column.title}
        </h2>
        <span className="count-badge">{tasks.length}</span>
      </div>
      <div className="column__body">
        {tasks.length === 0 ? (
          <div className="empty-column">No tasks</div>
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
