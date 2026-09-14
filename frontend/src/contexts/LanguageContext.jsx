import { createContext, useContext, useMemo, useState } from 'react'

const LANGUAGE_STORAGE_KEY = 'signumtodo-language'

export const LANGUAGE_OPTIONS = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
]

const translations = {
  tr: {
    appSubtitle: 'Ekip görev panosu',
    navBoard: 'Pano',
    navPeople: 'Kişiler',
    todo: 'Yapılacak',
    inProgress: 'Devam Ediyor',
    completed: 'Tamamlandı',
    assignedTo: 'Atanan kişi',
    assignedPrefix: 'Atanan',
    plannedDate: 'Planlanan tarih',
    plannedPrefix: 'Planlanan',
    filterByPerson: 'Kişiye göre filtrele',
    clearFilters: 'Filtreleri temizle',
    newTask: 'Yeni görev',
    editTask: 'Görevi düzenle',
    taskDescription: 'Görev tanımı',
    cancel: 'Vazgeç',
    saveTask: 'Görevi kaydet',
    saving: 'Kaydediliyor...',
    loadingTasks: 'Görevler yükleniyor...',
    loadingPeople: 'Kişiler yükleniyor...',
    emptyColumn: 'Görev yok',
    overdue: 'Gecikti',
    start: 'Başlat',
    complete: 'Tamamla',
    editTaskAction: 'Görevi düzenle',
    deleteTaskAction: 'Görevi sil',
    closeModal: 'Pencereyi kapat',
    deleteConfirmPrefix: '"',
    deleteConfirmSuffix: '" görevini silmek istiyor musun?',
    peopleTitle: 'Kişiler',
    peopleSubtitle: 'Görevleri kişiye ve duruma göre takip et.',
    peopleCount: 'kişi',
    taskCount: 'görev',
    emptyPeople: 'Henüz atanmış görev yok.',
    unassigned: 'Atanmamış',
    totalTasksPrefix: 'Toplam',
    totalTasksSuffix: 'görev',
    taskCountsLabel: 'görev sayıları',
    todoShort: 'yapılacak',
    activeShort: 'aktif',
    doneShort: 'tamamlandı',
  },
  en: {
    appSubtitle: 'Team task board',
    navBoard: 'Board',
    navPeople: 'People',
    todo: 'Todo',
    inProgress: 'In Progress',
    completed: 'Completed',
    assignedTo: 'Assigned to',
    assignedPrefix: 'Assigned to',
    plannedDate: 'Planned date',
    plannedPrefix: 'Planned',
    filterByPerson: 'Filter by person',
    clearFilters: 'Clear filters',
    newTask: 'New task',
    editTask: 'Edit task',
    taskDescription: 'Task description',
    cancel: 'Cancel',
    saveTask: 'Save task',
    saving: 'Saving...',
    loadingTasks: 'Loading tasks...',
    loadingPeople: 'Loading people...',
    emptyColumn: 'No tasks',
    overdue: 'Overdue',
    start: 'Start',
    complete: 'Complete',
    editTaskAction: 'Edit task',
    deleteTaskAction: 'Delete task',
    closeModal: 'Close modal',
    deleteConfirmPrefix: 'Delete "',
    deleteConfirmSuffix: '"?',
    peopleTitle: 'People',
    peopleSubtitle: 'Tasks grouped by assignee and status.',
    peopleCount: 'people',
    taskCount: 'tasks',
    emptyPeople: 'No assigned tasks yet.',
    unassigned: 'Unassigned',
    totalTasksPrefix: '',
    totalTasksSuffix: 'total tasks',
    taskCountsLabel: 'task counts',
    todoShort: 'todo',
    activeShort: 'active',
    doneShort: 'done',
  },
}

const LanguageContext = createContext(null)

function getInitialLanguage() {
  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)

  return LANGUAGE_OPTIONS.some((option) => option.code === storedLanguage) ? storedLanguage : 'tr'
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)

  function setLanguage(nextLanguage) {
    setLanguageState(nextLanguage)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key) => translations[language]?.[key] ?? translations.tr[key] ?? key,
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider')
  }

  return context
}
