import { useState } from 'react'
import { AppShell } from './components/layout/AppShell.jsx'
import { Header } from './components/layout/Header.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { TaskProvider } from './contexts/TaskContext.jsx'
import { BoardPage } from './pages/BoardPage.jsx'
import { PeoplePage } from './pages/PeoplePage.jsx'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('board')

  return (
    <LanguageProvider>
      <TaskProvider>
        <AppShell>
          <Header activePage={activePage} onNavigate={setActivePage} />
          {activePage === 'board' ? <BoardPage /> : <PeoplePage />}
        </AppShell>
      </TaskProvider>
    </LanguageProvider>
  )
}

export default App
