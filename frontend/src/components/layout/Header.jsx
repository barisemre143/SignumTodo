import { LANGUAGE_OPTIONS, useLanguage } from '../../contexts/LanguageContext'

export function Header({ activePage, onNavigate }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="brand">
          <h1 className="brand__title">SignumTodo</h1>
          <span className="brand__meta">{t('appSubtitle')}</span>
        </div>
        <div className="header-controls">
          <nav className="nav-tabs" aria-label="Primary navigation">
            <button
              type="button"
              className={`nav-tab${activePage === 'board' ? ' nav-tab--active' : ''}`}
              onClick={() => onNavigate('board')}
            >
              {t('navBoard')}
            </button>
            <button
              type="button"
              className={`nav-tab${activePage === 'people' ? ' nav-tab--active' : ''}`}
              onClick={() => onNavigate('people')}
            >
              {t('navPeople')}
            </button>
          </nav>
          <div className="language-switch" aria-label="Language selection">
            {LANGUAGE_OPTIONS.map((option) => (
              <button
                key={option.code}
                type="button"
                className={`language-switch__button${
                  language === option.code ? ' language-switch__button--active' : ''
                }`}
                onClick={() => setLanguage(option.code)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
