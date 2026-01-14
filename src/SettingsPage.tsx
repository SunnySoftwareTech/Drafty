import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useAuth } from './useAuth'
import { themes, applyTheme, getThemeNames } from './themes'
import { SettingsIcon, LogoutIcon } from './icons'
import { GistService } from './gistService'
import type { GistData } from './gistService'
import './SettingsPage.css'

const DEFAULT_TEXT_COLOR = '#cdd6f4'
const DEFAULT_FONT_SIZE = '16'
const DEFAULT_FONT_FAMILY = '"Trebuchet MS", "Segoe UI", Tahoma, Arial, sans-serif'

type DataKind = 'books' | 'projects' | 'flashcards'

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
  const [uiFontFamily, setUiFontFamily] = useState(DEFAULT_FONT_FAMILY)
  const [editorFontFamily, setEditorFontFamily] = useState(DEFAULT_FONT_FAMILY)

  const [gistToken, setGistToken] = useState('')
  const [syncStatus, setSyncStatus] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)

  const storageKeys = useMemo(() => {
    const uid = user?.uid
    return {
      books: uid ? `drafty-books-${uid}` : null,
      projects: uid ? `drafty-projects-${uid}` : null,
      flashcards: uid ? `drafty-flashcards-${uid}` : null,
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
    const savedUiFont = localStorage.getItem('drafty-ui-font-family') || DEFAULT_FONT_FAMILY
    const savedEditorFont = localStorage.getItem('drafty-editor-font-family') || DEFAULT_FONT_FAMILY
    setTextColor(savedTextColor)
    setFontSize(savedFontSize)
    setUiFontFamily(savedUiFont)
    setEditorFontFamily(savedEditorFont)

    // Load Gist token
    const savedToken = localStorage.getItem(`drafty-gist-token-${user?.uid}`) || ''
    setGistToken(savedToken)
  }, [user])

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

  const handleUiFontChange = (family: string) => {
    setUiFontFamily(family)
    localStorage.setItem('drafty-ui-font-family', family)
    document.documentElement.style.setProperty('--ui-font-family', family)
  }

  const handleEditorFontChange = (family: string) => {
    setEditorFontFamily(family)
    localStorage.setItem('drafty-editor-font-family', family)
    document.documentElement.style.setProperty('--editor-font-family', family)
  }

  const exportData = (kind: DataKind) => {
    const key = storageKeys[kind]
    if (!key) return
    const raw = localStorage.getItem(key)
    const parsed = raw ? tryParseJson(raw) : []
    downloadJson(`drafty-${kind}.json`, parsed)
  }

  const clearData = (kind: DataKind) => {
    const confirmMsg = `Are you sure you want to delete ALL ${kind}? This action cannot be undone!`
    if (!confirm(confirmMsg)) return
    
    const key = storageKeys[kind]
    if (!key) return
    localStorage.removeItem(key)
    if (kind === 'books' && storageKeys.legacyNotes) {
      // also clear legacy notes if user wants to fully reset
      localStorage.removeItem(storageKeys.legacyNotes)
    }
    alert(`${kind} cleared successfully. Refresh the page to see changes.`)
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

  const handleSaveGistToken = async () => {
    if (!gistToken.trim()) {
      setSyncStatus('Please enter a token')
      return
    }

    const isValid = await GistService.testToken(gistToken)
    if (!isValid) {
      setSyncStatus('Invalid token - please check your token')
      return
    }

    localStorage.setItem(`drafty-gist-token-${user?.uid}`, gistToken)
    setSyncStatus('Token saved successfully!')
    setTimeout(() => setSyncStatus(''), 3000)
  }

  const handleSyncToGist = async () => {
    if (!user || !gistToken.trim()) {
      setSyncStatus('Please save a valid token first')
      return
    }

    setIsSyncing(true)
    setSyncStatus('Syncing to Gist...')

    try {
      const gistService = new GistService(gistToken)
      
      const data: GistData = {
        books: JSON.parse(localStorage.getItem(storageKeys.books!) || '[]'),
        projects: JSON.parse(localStorage.getItem(storageKeys.projects!) || '[]'),
        flashcards: JSON.parse(localStorage.getItem(storageKeys.flashcards!) || '[]'),
        flashcardFolders: JSON.parse(localStorage.getItem(`drafty-flashcard-folders-${user.uid}`) || '[]'),
        lastSync: new Date().toISOString(),
      }

      await gistService.save(data)
      setSyncStatus('Successfully synced to Gist!')
      setTimeout(() => setSyncStatus(''), 3000)
    } catch (error) {
      console.error('Sync error:', error)
      setSyncStatus(`Sync failed: ${error}`)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleLoadFromGist = async () => {
    if (!user || !gistToken.trim()) {
      setSyncStatus('Please save a valid token first')
      return
    }

    setIsSyncing(true)
    setSyncStatus('Loading from Gist...')

    try {
      const gistService = new GistService(gistToken)
      const data = await gistService.load()

      if (!data) {
        setSyncStatus('No data found in Gist')
        setIsSyncing(false)
        return
      }

      localStorage.setItem(storageKeys.books!, JSON.stringify(data.books || []))
      localStorage.setItem(storageKeys.projects!, JSON.stringify(data.projects || []))
      localStorage.setItem(storageKeys.flashcards!, JSON.stringify(data.flashcards || []))
      localStorage.setItem(`drafty-flashcard-folders-${user.uid}`, JSON.stringify(data.flashcardFolders || []))

      setSyncStatus('Successfully loaded from Gist! Refresh the page to see changes.')
    } catch (error) {
      console.error('Load error:', error)
      setSyncStatus(`Load failed: ${error}`)
    } finally {
      setIsSyncing(false)
    }
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
          <h3>🔄 GitHub Gist Sync</h3>
          <p className="settingspage-muted">
            <strong>How to sync:</strong><br/>
            1. <a href="https://github.com/settings/tokens/new?description=Drafty&scopes=gist" target="_blank" rel="noopener noreferrer">Create a GitHub token</a> with 'gist' scope<br/>
            2. Paste your token (starts with ghp_) below<br/>
            3. Click "Save Token" then use sync buttons to backup/restore your data
          </p>
          
          <div className="settingspage-row">
            <label style={{ width: '100%' }}>
              <strong>GitHub Personal Access Token</strong>
              <input
                type="password"
                value={gistToken}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setGistToken(e.target.value)}
                placeholder="Paste your token here (ghp_xxxxxxxxxxxxx)"
                style={{ width: '100%', marginTop: '8px', padding: '8px' }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <button onClick={handleSaveGistToken} disabled={isSyncing}>Save Token</button>
            <button onClick={handleSyncToGist} disabled={isSyncing || !gistToken.trim()}>Sync to Gist</button>
            <button onClick={handleLoadFromGist} disabled={isSyncing || !gistToken.trim()}>Load from Gist</button>
          </div>

          {syncStatus && (
            <p style={{ marginTop: '12px', color: syncStatus.includes('failed') || syncStatus.includes('Invalid') ? '#f38ba8' : '#a6e3a1' }}>
              {syncStatus}
            </p>
          )}
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
              UI Font
              <select value={uiFontFamily} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleUiFontChange(e.target.value)}>
                <option value={DEFAULT_FONT_FAMILY}>Trebuchet MS</option>
                <option value={'Georgia, "Times New Roman", serif'}>Serif</option>
                <option value={'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}>System</option>
              </select>
            </label>

            <label>
              Editor Font
              <select value={editorFontFamily} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleEditorFontChange(e.target.value)}>
                <option value={DEFAULT_FONT_FAMILY}>Trebuchet MS</option>
                <option value={'Georgia, "Times New Roman", serif'}>Serif</option>
                <option value={'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'}>Mono</option>
                <option value={'-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'}>System</option>
              </select>
            </label>
          </div>
        </div>

        <div className="settingspage-section">
          <h3>Data Management</h3>
          <p className="settingspage-muted">Export, import, or clear your Drafty data. Use Gist sync above for backup before clearing!</p>

          <div className="files-grid">
            {(['books', 'projects', 'flashcards'] as DataKind[]).map((kind) => (
              <div key={kind} className="file-card">
                <div className="file-card-title">{kind.charAt(0).toUpperCase() + kind.slice(1)}</div>
                <div className="file-card-actions">
                  <button onClick={() => exportData(kind)}>Export JSON</button>

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
                    Delete All
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
