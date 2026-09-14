import { useEffect, useState } from 'react'
import { toDateInputValue } from '../../utils/date'

const initialFormState = {
  taskDescription: '',
  assignedTo: '',
  plannedDate: '',
}

export function TaskForm({ task, error, isSubmitting, onCancel, onSubmit }) {
  const [form, setForm] = useState(initialFormState)

  useEffect(() => {
    if (!task) {
      setForm(initialFormState)
      return
    }

    setForm({
      taskDescription: task.taskDescription,
      assignedTo: task.assignedTo,
      plannedDate: toDateInputValue(task.plannedDate),
    })
  }, [task])

  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal__body">
        {error ? <div className="form-error">{error}</div> : null}
        <div className="field field--wide">
          <label htmlFor="taskDescription">Task description</label>
          <textarea
            id="taskDescription"
            className="textarea"
            value={form.taskDescription}
            onChange={(event) => updateField('taskDescription', event.target.value)}
            required
          />
        </div>
        <div className="field field--wide">
          <label htmlFor="assignedTo">Assigned to</label>
          <input
            id="assignedTo"
            className="input"
            value={form.assignedTo}
            onChange={(event) => updateField('assignedTo', event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="plannedDate">Planned date</label>
          <input
            id="plannedDate"
            className="input"
            type="date"
            value={form.plannedDate}
            onChange={(event) => updateField('plannedDate', event.target.value)}
            required
          />
        </div>
      </div>
      <div className="modal__footer">
        <button type="button" className="button button--secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save task'}
        </button>
      </div>
    </form>
  )
}
