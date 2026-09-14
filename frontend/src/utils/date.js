export function formatDate(value) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export function toDateInputValue(value) {
  if (!value) {
    return ''
  }

  return value.slice(0, 10)
}
