export function Header({ activePage, onNavigate }) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="brand">
          <h1 className="brand__title">SignumTodo</h1>
          <span className="brand__meta">Team task board</span>
        </div>
        <nav className="nav-tabs" aria-label="Primary navigation">
          <button
            type="button"
            className={`nav-tab${activePage === 'board' ? ' nav-tab--active' : ''}`}
            onClick={() => onNavigate('board')}
          >
            Board
          </button>
          <button
            type="button"
            className={`nav-tab${activePage === 'people' ? ' nav-tab--active' : ''}`}
            onClick={() => onNavigate('people')}
          >
            People
          </button>
        </nav>
        <div className="header-spacer" />
      </div>
    </header>
  )
}
