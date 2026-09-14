const ERROR_MESSAGES = {
  tr: {
    'Planned date cannot be in the past.': 'Planlanan tarih geçmişte olamaz.',
    'Task description is required.': 'Görev tanımı zorunludur.',
    'Assigned person is required.': 'Atanan kişi zorunludur.',
    'Only Todo tasks can be moved to InProgress.': 'Sadece yapılacak görevler devam ediyor durumuna alınabilir.',
    'Only InProgress tasks can be completed.': 'Sadece devam eden görevler tamamlanabilir.',
    'Completed tasks cannot be changed.': 'Tamamlanan görevler tekrar değiştirilemez.',
  },
  en: {},
}

export function translateError(error, language = 'tr') {
  if (!error) {
    return ''
  }

  const message = error?.response?.data?.message ?? error.message ?? String(error)

  return ERROR_MESSAGES[language]?.[message] ?? message
}
