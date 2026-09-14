import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

const columns = [
  { id: 'todo', label: 'Todo', hint: 'Başlamayı bekleyen işler' },
  { id: 'inProgress', label: 'In progress', hint: 'Üzerinde çalışılanlar' },
  { id: 'completed', label: 'Completed', hint: 'Tamamlanan işler' },
]

const statusLabels = Object.fromEntries(columns.map((column) => [column.id, column.label]))
const nextStatus = { todo: 'inProgress', inProgress: 'completed' }
const previousStatus = { inProgress: 'todo', completed: 'inProgress' }

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || error?.title || 'İşlem tamamlanamadı.')
  }

  return response.status === 204 ? null : response.json()
}

function App() {
  const [page, setPage] = useState('board')
  const [todos, setTodos] = useState([])
  const [editor, setEditor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTodos = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setTodos(await apiRequest('/api/todos'))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // API verisini ilk ekranda yüklemek bu effect'in dış sistem senkronizasyonudur.
    // oxlint-disable-next-line react/set-state-in-effect
    loadTodos()
  }, [loadTodos])

  async function saveTodo(values) {
    const editingTodo = editor?.todo
    const saved = await apiRequest(editingTodo ? `/api/todos/${editingTodo.id}` : '/api/todos', {
      method: editingTodo ? 'PUT' : 'POST',
      body: JSON.stringify(editingTodo ? { ...values, status: editingTodo.status } : values),
    })

    setTodos((current) => editingTodo
      ? current.map((todo) => (todo.id === saved.id ? saved : todo))
      : [...current, saved])
    setEditor(null)
  }

  async function updateStatus(todo, status) {
    if (!isAllowedTransition(todo.status, status)) {
      setError('Todo aşamasından doğrudan Completed aşamasına geçilemez. Önce In Progress’e taşı.')
      return
    }

    if (todo.status === status) return

    try {
      setError('')
      const updated = await apiRequest(`/api/todos/${todo.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: todo.title,
          description: todo.description,
          assignee: todo.assignee,
          dueDate: todo.dueDate,
          status,
        }),
      })
      setTodos((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function deleteTodo(todo) {
    if (!window.confirm(`“${todo.title}” silinsin mi?`)) return

    try {
      await apiRequest(`/api/todos/${todo.id}`, { method: 'DELETE' })
      setTodos((current) => current.filter((item) => item.id !== todo.id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => setPage('board')}>
          <span className="brand-mark">S</span>
          <span>Signum Todo</span>
        </button>

        <nav className="main-nav" aria-label="Ana menü">
          <button className={page === 'board' ? 'active' : ''} type="button" onClick={() => setPage('board')}>Pano</button>
          <button className={page === 'people' ? 'active' : ''} type="button" onClick={() => setPage('people')}>Kişiler</button>
        </nav>

        <button className="top-add-button" type="button" onClick={() => setEditor({ mode: 'create' })}>
          <span>＋</span> Yeni görev
        </button>
      </header>

      {error && (
        <div className="global-error" role="alert">
          <span>{error}</span>
          <button type="button" aria-label="Uyarıyı kapat" onClick={() => setError('')}>×</button>
        </div>
      )}

      {page === 'board' ? (
        <BoardPage
          todos={todos}
          loading={loading}
          onCreate={() => setEditor({ mode: 'create' })}
          onEdit={(todo) => setEditor({ mode: 'edit', todo })}
          onDelete={deleteTodo}
          onMove={updateStatus}
        />
      ) : (
        <PeoplePage todos={todos} loading={loading} onEdit={(todo) => setEditor({ mode: 'edit', todo })} />
      )}

      {editor && (
        <TodoEditor
          todo={editor.todo}
          onClose={() => setEditor(null)}
          onSave={saveTodo}
        />
      )}
    </main>
  )
}

function BoardPage({ todos, loading, onCreate, onEdit, onDelete, onMove }) {
  const [draggedId, setDraggedId] = useState(null)
  const [dragTarget, setDragTarget] = useState(null)
  const draggedTodo = todos.find((todo) => todo.id === draggedId)
  const activeCount = todos.filter((todo) => todo.status !== 'completed').length
  const lateCount = todos.filter(isOverdue).length

  function handleDrop(status) {
    if (draggedTodo) onMove(draggedTodo, status)
    setDraggedId(null)
    setDragTarget(null)
  }

  return (
    <section className="page board-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">İŞ AKIŞI</p>
          <h1>Görev panosu</h1>
          <p className="subtitle">Kartları aşamalar arasında sürükleyerek ilerlet.</p>
        </div>
        <div className="summary-row">
          <span><strong>{activeCount}</strong> aktif iş</span>
          <span className={lateCount ? 'late' : ''}><strong>{lateCount}</strong> geciken</span>
        </div>
      </div>

      {loading ? (
        <div className="page-loader"><span className="loader" />Görevler yükleniyor…</div>
      ) : (
        <div className="kanban-board">
          {columns.map((column) => {
            const columnTodos = todos.filter((todo) => todo.status === column.id)
            const invalidTarget = draggedTodo && !isAllowedTransition(draggedTodo.status, column.id)

            return (
              <section
                className={`kanban-column ${dragTarget === column.id ? 'drag-over' : ''} ${invalidTarget ? 'invalid-target' : ''}`}
                key={column.id}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragTarget(column.id)
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setDragTarget(null)
                }}
                onDrop={() => handleDrop(column.id)}
              >
                <div className="column-heading">
                  <div>
                    <span className={`status-dot ${column.id}`} />
                    <h2>{column.label}</h2>
                    <span className="column-count">{columnTodos.length}</span>
                  </div>
                  <p>{column.hint}</p>
                </div>

                <div className="column-body">
                  {columnTodos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onDragStart={() => setDraggedId(todo.id)}
                      onDragEnd={() => { setDraggedId(null); setDragTarget(null) }}
                      onEdit={() => onEdit(todo)}
                      onDelete={() => onDelete(todo)}
                      onMove={(status) => onMove(todo, status)}
                    />
                  ))}
                  {columnTodos.length === 0 && (
                    <div className="column-empty">
                      <span>＋</span>
                      <p>{column.id === 'todo' ? 'Yeni bir görev ekle' : 'Kartı buraya sürükle'}</p>
                      {column.id === 'todo' && <button type="button" onClick={onCreate}>Görev oluştur</button>}
                    </div>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </section>
  )
}

function TodoCard({ todo, onDragStart, onDragEnd, onEdit, onDelete, onMove }) {
  const overdue = isOverdue(todo)
  return (
    <article className="todo-card" draggable onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="card-topline">
        <span className={`status-badge ${todo.status}`}>{statusLabels[todo.status]}</span>
        <span className="drag-handle" title="Sürükle" aria-hidden="true">⠿</span>
      </div>
      <button className="card-content" type="button" onClick={onEdit}>
        <h3>{todo.title}</h3>
        {todo.description && <p>{todo.description}</p>}
      </button>
      <div className="card-meta">
        <span className="person-chip"><i>{initials(todo.assignee)}</i>{todo.assignee}</span>
        <span className={overdue ? 'due-date overdue' : 'due-date'}>
          {overdue ? 'Gecikti · ' : ''}{formatDueDate(todo.dueDate)}
        </span>
      </div>
      <div className="card-actions">
        <div>
          {previousStatus[todo.status] && (
            <button type="button" title="Önceki aşama" onClick={() => onMove(previousStatus[todo.status])}>←</button>
          )}
          {nextStatus[todo.status] && (
            <button className="advance-button" type="button" onClick={() => onMove(nextStatus[todo.status])}>
              {todo.status === 'todo' ? 'Başlat' : 'Tamamla'} →
            </button>
          )}
        </div>
        <div>
          <button type="button" onClick={onEdit}>Düzenle</button>
          <button className="delete-button" type="button" onClick={onDelete}>Sil</button>
        </div>
      </div>
    </article>
  )
}

function PeoplePage({ todos, loading, onEdit }) {
  const people = useMemo(() => {
    const grouped = new Map()
    for (const todo of todos) {
      const items = grouped.get(todo.assignee) || []
      items.push(todo)
      grouped.set(todo.assignee, items)
    }
    return [...grouped.entries()]
      .map(([name, items]) => ({ name, items: items.sort((a, b) => a.dueDate.localeCompare(b.dueDate)) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
  }, [todos])

  return (
    <section className="page people-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">EKİP GÖRÜNÜMÜ</p>
          <h1>Kimin üstünde ne var?</h1>
          <p className="subtitle">İş yükünü, aşamaları ve geciken görevleri kişi bazında gör.</p>
        </div>
      </div>

      {loading ? (
        <div className="page-loader"><span className="loader" />İş yükü hazırlanıyor…</div>
      ) : people.length === 0 ? (
        <div className="people-empty">Henüz atanmış bir görev yok.</div>
      ) : (
        <div className="people-grid">
          {people.map((person) => {
            const active = person.items.filter((todo) => todo.status !== 'completed').length
            const late = person.items.filter(isOverdue).length
            return (
              <article className="person-panel" key={person.name}>
                <header>
                  <span className="person-avatar">{initials(person.name)}</span>
                  <div><h2>{person.name}</h2><p>{active} aktif iş · {late} geciken</p></div>
                  <strong>{person.items.length}</strong>
                </header>
                <ul>
                  {person.items.map((todo) => (
                    <li key={todo.id}>
                      <button type="button" onClick={() => onEdit(todo)}>
                        <span className="work-title">{todo.title}</span>
                        <span className={`status-badge ${todo.status}`}>{statusLabels[todo.status]}</span>
                        {isOverdue(todo) && <span className="late-badge">Gecikti</span>}
                        <span className="work-date">{formatDueDate(todo.dueDate)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

function TodoEditor({ todo, onClose, onSave }) {
  const [form, setForm] = useState({
    title: todo?.title || '',
    description: todo?.description || '',
    assignee: todo?.assignee === 'Atanmamış' ? '' : todo?.assignee || '',
    dueDate: todo?.dueDate || dateAfterDays(7),
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.assignee.trim() || !form.dueDate) {
      setError('Görev tanımı, atanan kişi ve son tarih zorunludur.')
      return
    }

    setSaving(true)
    setError('')
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        assignee: form.assignee.trim(),
        description: form.description.trim() || null,
      })
    } catch (requestError) {
      setError(requestError.message)
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <header>
          <div>
            <p className="eyebrow">{todo ? 'GÖREVİ DÜZENLE' : 'YENİ GÖREV'}</p>
            <h2 id="editor-title">{todo ? todo.title : 'Panoya görev ekle'}</h2>
          </div>
          <button className="modal-close" type="button" aria-label="Kapat" onClick={onClose}>×</button>
        </header>

        <form onSubmit={handleSubmit}>
          {error && <div className="form-error" role="alert">{error}</div>}
          <label>
            <span>Görev tanımı</span>
            <input autoFocus maxLength="200" placeholder="Örn. Teklif dokümanını hazırla" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </label>
          <div className="form-row">
            <label>
              <span>Atanan kişi</span>
              <input maxLength="100" placeholder="Örn. Ahmet" value={form.assignee} onChange={(event) => setForm({ ...form, assignee: event.target.value })} />
            </label>
            <label>
              <span>Son tarih</span>
              <input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
            </label>
          </div>
          <label>
            <span>Açıklama <em>isteğe bağlı</em></span>
            <textarea maxLength="1000" rows="4" placeholder="Görevle ilgili kısa not…" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          {todo && <p className="editor-status">Mevcut aşama: <span className={`status-badge ${todo.status}`}>{statusLabels[todo.status]}</span></p>}
          <div className="form-actions">
            <button className="ghost-button" type="button" onClick={onClose}>Vazgeç</button>
            <button className="primary-button" type="submit" disabled={saving}>{saving ? 'Kaydediliyor…' : todo ? 'Kaydet' : 'Görev oluştur'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

function isAllowedTransition(current, next) {
  return current === next ||
    (current === 'todo' && next === 'inProgress') ||
    (current === 'inProgress' && (next === 'todo' || next === 'completed')) ||
    (current === 'completed' && next === 'inProgress')
}

function isOverdue(todo) {
  return todo.status !== 'completed' && todo.dueDate < localDateKey(new Date())
}

function dateAfterDays(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return localDateKey(date)
}

function localDateKey(date) {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

function formatDueDate(value) {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${value}T12:00:00`))
}

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toLocaleUpperCase('tr')
}

export default App
