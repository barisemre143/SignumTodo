import { useState } from 'react'
import { AppShell } from './components/layout/AppShell.jsx'
import { Header } from './components/layout/Header.jsx'
import { TaskProvider } from './contexts/TaskContext.jsx'
import { BoardPage } from './pages/BoardPage.jsx'
import { PeoplePage } from './pages/PeoplePage.jsx'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('board')

  return (
    <TaskProvider>
      <AppShell>
        <Header activePage={activePage} onNavigate={setActivePage} />
        {activePage === 'board' ? <BoardPage /> : <PeoplePage />}
      </AppShell>
    </TaskProvider>
  )
}

export default App
