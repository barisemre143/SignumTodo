import { TaskForm } from './TaskForm'
import { useLanguage } from '../../contexts/LanguageContext'

export function TaskModal({ task, error, isSubmitting, onClose, onSubmit }) {
  const { t } = useLanguage()

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="modal__header">
          <h2 id="task-modal-title" className="modal__title">
            {task ? t('editTask') : t('newTask')}
          </h2>
          <button type="button" className="icon-button" aria-label={t('closeModal')} onClick={onClose}>
            X
          </button>
        </div>
        <TaskForm
          task={task}
          error={error}
          isSubmitting={isSubmitting}
          onCancel={onClose}
          onSubmit={onSubmit}
        />
      </section>
    </div>
  )
}
