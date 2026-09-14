export const TASK_STATUS = {
  TODO: 'Todo',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
}

export const TASK_COLUMNS = [
  { key: TASK_STATUS.TODO, titleKey: 'todo', color: '#64748b' },
  { key: TASK_STATUS.IN_PROGRESS, titleKey: 'inProgress', color: '#2563eb' },
  { key: TASK_STATUS.COMPLETED, titleKey: 'completed', color: '#16a34a' },
]

export const NEXT_STATUS = {
  [TASK_STATUS.TODO]: TASK_STATUS.IN_PROGRESS,
  [TASK_STATUS.IN_PROGRESS]: TASK_STATUS.COMPLETED,
}
