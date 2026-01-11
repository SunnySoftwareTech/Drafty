import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useAuth } from './useAuth'
import { themes, applyTheme, getThemeNames } from './themes'
import { SettingsIcon, LogoutIcon, DashboardIcon } from './icons'
import './SettingsPage.css'

const DEFAULT_TEXT_COLOR = '#cdd6f4'
const DEFAULT_FONT_SIZE = '16'
const DEFAULT_FONT_FAMILY = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

type DataKind = 'books' | 'projects' | 'flashcards' | 'whiteboard'

function safeJsonParse(text: string): unknown {
  return JSON.parse(text) as unknown
}

function tryParseJson(text: string): unknown | null {
  try {
    return safeJsonParse(text)
  } catch {
    return null
  }
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function readJsonFile(file: File): Promise<any> {
  const text = await file.text()
  const parsed = tryParseJson(text)
  if (parsed === null) {
    throw new Error('Invalid JSON')
  }
  return parsed
}

export function SettingsPage() {
  const { user, logout } = useAuth()

  const [currentTheme, setCurrentTheme] = useState('mocha')
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark')
  const [accentColor, setAccentColor] = useState<string | null>(null)
  const [blackAndWhite, setBlackAndWhite] = useState(false)

  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR)
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)
  const [fontFamily, setFontFamily] = useState(DEFAULT_FONT_FAMILY)

  const storageKeys = useMemo(() => {
    const uid = user?.uid
    return {
      books: uid ? `drafty-books-${uid}` : null,
      projects: uid ? `drafty-projects-${uid}` : null,
      flashcards: uid ? `drafty-flashcards-${uid}` : null,
      whiteboard: uid ? `drafty-whiteboard-${uid}` : null,
      legacyNotes: uid ? `drafty-notes-${uid}` : null,
    }
  }, [user?.uid])

  // Load settings + apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('drafty-theme') || 'mocha'
    const savedMode = (localStorage.getItem('drafty-theme-mode') as 'dark' | 'light') || 'dark'
    const savedAccent = localStorage.getItem('drafty-accent') || null
    const savedBW = localStorage.getItem('drafty-bw-mode') === '1'
    setCurrentTheme(savedTheme)
    setThemeMode(savedMode)
    setAccentColor(savedAccent)
    setBlackAndWhite(savedBW)
    applyTheme(savedTheme, savedMode, savedAccent, savedBW)

    const savedTextColor = localStorage.getItem('drafty-text-color') || DEFAULT_TEXT_COLOR
    const savedFontSize = localStorage.getItem('drafty-font-size') || DEFAULT_FONT_SIZE
    const savedFontFamily = localStorage.getItem('drafty-font-family') || DEFAULT_FONT_FAMILY
    setTextColor(savedTextColor)
    setFontSize(savedFontSize)
    setFontFamily(savedFontFamily)
  }, [])

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme)
    applyTheme(theme, themeMode, accentColor)
    localStorage.setItem('drafty-theme', theme)
  }

  const handleThemeModeChange = (mode: 'dark' | 'light') => {
    setThemeMode(mode)
    applyTheme(currentTheme, mode, accentColor)
    localStorage.setItem('drafty-theme-mode', mode)
  }

  const handleAccentChange = (color: string) => {
    setAccentColor(color)
    applyTheme(currentTheme, themeMode, color, blackAndWhite)
    localStorage.setItem('drafty-accent', color)
  }

  const handleBWChange = (on: boolean) => {
    setBlackAndWhite(on)
    applyTheme(currentTheme, themeMode, accentColor, on)
    localStorage.setItem('drafty-bw-mode', on ? '1' : '0')
  }

  const handleTextColorChange = (color: string) => {
    setTextColor(color)
    localStorage.setItem('drafty-text-color', color)
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    localStorage.setItem('drafty-font-size', size)
  }

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family)
    localStorage.setItem('drafty-font-family', family)
  }

  const exportData = (kind: DataKind) => {
    if (!user) return
    const key = storageKeys[kind]
    if (!key) return
    const raw = localStorage.getItem(key)
    const parsed = raw ? tryParseJson(raw) : []
    downloadJson(`drafty-${kind}-${user.uid}.json`, parsed)
  }

  const clearData = (kind: DataKind) => {
    const key = storageKeys[kind]
    if (!key) return
    localStorage.removeItem(key)
    if (kind === 'books' && storageKeys.legacyNotes) {
      // also clear legacy notes if user wants to fully reset
      localStorage.removeItem(storageKeys.legacyNotes)
    }
    // quick feedback: bounce hash to refresh App state when returning
    alert(`${kind} cleared.`)
  }

  const importData = async (kind: DataKind, file: File) => {
    const key = storageKeys[kind]
    if (!key) return
    try {
      const parsed = await readJsonFile(file)
      localStorage.setItem(key, JSON.stringify(parsed))
      alert(`${kind} imported.`)
    } catch (e) {
      console.error(e)
      alert('Import failed: invalid JSON file.')
    }
  }

  const goBack = () => {
    window.location.hash = '#app'
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      window.location.hash = ''
    }
  }

  if (!user) {
    // Shouldn’t happen because RootApp only shows this when logged in.
    return (
      <div className="settingspage-container">
        <div className="settingspage-card">
          <h2>Settings</h2>
          <p>Please sign in first.</p>
          <button onClick={() => (window.location.hash = '#app')}>Go to sign in</button>
        </div>
      </div>
    )
  }

  return (
    <div className="settingspage-container">
      <div className="settingspage-card">
        <div className="settingspage-header">
          <div className="settingspage-title">
            <SettingsIcon size={40} />
            <div>
              <h2>Settings</h2>
              <p>Account, appearance, and files</p>
            </div>
          </div>
          <div className="settingspage-actions">
            <button onClick={goBack}>
              <DashboardIcon size={18} /> Back
            </button>
            <button className="logout" onClick={handleLogout}>
              <LogoutIcon size={18} /> Log Out
            </button>
          </div>
        </div>

        <div className="settingspage-section">
          <h3>Account</h3>
          <div className="settingspage-row">
            <span className="label">Email</span>
            <span className="value">{user.email}</span>
          </div>
        </div>

        <div className="settingspage-section">
          <h3>Theme</h3>
          <p className="settingspage-muted">Choose a Catppuccin theme and accent</p>
          <div className="theme-grid">
            {getThemeNames().map((themeName) => (
              <button
                key={themeName}
                className={`theme-option ${currentTheme === themeName ? 'active' : ''}`}
                onClick={() => handleThemeChange(themeName)}
                style={{
                  backgroundColor: themes[themeName].colors.base,
                  color: themes[themeName].colors.text,
                  borderColor: currentTheme === themeName ? themes[themeName].colors.accent : 'transparent',
                }}
              >
                {themes[themeName].name}
              </button>
            ))}
          </div>

          <div className="settingspage-controls">
            <label>
              Mode
              <select
                value={themeMode}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleThemeModeChange(e.target.value as 'dark' | 'light')}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </label>

            <label>
              Accent
              <input
                type="color"
                value={accentColor || '#cba6f7'}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleAccentChange(e.target.value)}
              />
            </label>
            <label>
              Black & White
              <input type="checkbox" checked={blackAndWhite} onChange={(e: ChangeEvent<HTMLInputElement>) => handleBWChange(e.target.checked)} />
            </label>
          </div>
        </div>

        <div className="settingspage-section">
          <h3>Editor</h3>
          <div className="settingspage-controls">
            <label>
              Text color
              <input type="color" value={textColor} onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextColorChange(e.target.value)} />
            </label>

            <label>
              Font size
              <select value={fontSize} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFontSizeChange(e.target.value)}>
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
                <option value="20">20px</option>
                <option value="24">24px</option>
              </select>
            </label>

            <label>
              Font preset
              <select value={fontFamily} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFontFamilyChange(e.target.value)}>
                <option value={DEFAULT_FONT_FAMILY}>System</option>
                <option value={'Georgia, "Times New Roman", serif'}>Serif</option>
                <option value={'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'}>Mono</option>
                <option value={'"Trebuchet MS", "Segoe UI", sans-serif'}>Rounded</option>
              </select>
            </label>
          </div>
        </div>

        <div className="settingspage-section">
          <h3>Files</h3>
          <p className="settingspage-muted">Manage and move your Drafty documents (import/export/clear).</p>

          <div className="files-grid">
            {(['books', 'projects', 'flashcards', 'whiteboard'] as DataKind[]).map((kind) => (
              <div key={kind} className="file-card">
                <div className="file-card-title">{kind}</div>
                <div className="file-card-actions">
                  <button onClick={() => exportData(kind)}>Export</button>

                  <label className="file-import">
                    Import
                    <input
                      type="file"
                      accept="application/json"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const f = e.target.files?.[0]
                        if (f) void importData(kind, f)
                        e.currentTarget.value = ''
                      }}
                    />
                  </label>

                  <button className="danger" onClick={() => clearData(kind)}>
                    Clear
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
