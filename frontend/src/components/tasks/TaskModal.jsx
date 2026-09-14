import { TaskForm } from './TaskForm'

export function TaskModal({ task, isSubmitting, onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="modal__header">
          <h2 id="task-modal-title" className="modal__title">
            {task ? 'Edit task' : 'New task'}
          </h2>
          <button type="button" className="icon-button" aria-label="Close modal" onClick={onClose}>
            X
          </button>
        </div>
        <TaskForm task={task} isSubmitting={isSubmitting} onCancel={onClose} onSubmit={onSubmit} />
      </section>
    </div>
  )
}
