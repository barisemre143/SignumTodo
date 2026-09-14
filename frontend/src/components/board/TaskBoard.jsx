import { TASK_COLUMNS } from '../../constants/taskStatuses'
import { TaskColumn } from './TaskColumn'

export function TaskBoard({ tasks, onEditTask, onDeleteTask, onMoveTask, onDropTask }) {
  return (
    <div className="board">
      {TASK_COLUMNS.map((column) => (
        <TaskColumn
          key={column.key}
          column={column}
          tasks={tasks.filter((task) => task.status === column.key)}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onMoveTask={onMoveTask}
          onDropTask={onDropTask}
        />
      ))}
    </div>
  )
}
