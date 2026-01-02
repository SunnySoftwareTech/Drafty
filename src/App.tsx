/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from './useAuth'
import { Dashboard } from './Dashboard'
import { themes, applyTheme, getThemeNames } from './themes'
import { 
  EditIcon, 
  TrashIcon, 
  BookIcon, 
  FlashcardsIcon, 
  WhiteboardIcon, 
  StudyIcon, 
  SettingsIcon, 
  LogoutIcon,
  PencilIcon,
  DashboardIcon
} from './icons'
import './App.css'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  format?: string
}

type Mode = 'dashboard' | 'notebook' | 'flashcards' | 'whiteboard' | 'study' | 'settings'

const DEFAULT_TEXT_COLOR = '#cdd6f4'
const DEFAULT_FONT_SIZE = '16'

function App() {
  const { user, logout } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [currentMode, setCurrentMode] = useState<Mode>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('mocha')
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark')
  const [accentColor, setAccentColor] = useState<string | null>(null)
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR)
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)
  const [flashcards, setFlashcards] = useState<any[]>([])

  // Load notes from localStorage when user changes
  useEffect(() => {
    if (!user) {
      setNotes([])
      setSelectedNoteId(null)
      return
    }

    const savedNotes = localStorage.getItem(`drafty-notes-${user.uid}`)
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes)
        setNotes(parsedNotes)
        setSelectedNoteId(parsedNotes.length > 0 ? parsedNotes[0].id : null)
      } catch (e) {
        console.error('Failed to load notes:', e)
        setNotes([])
        setSelectedNoteId(null)
      }
    } else {
      setNotes([])
      setSelectedNoteId(null)
    }
  }, [user])

  // Load and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('drafty-theme') || 'mocha'
    setCurrentTheme(savedTheme)
    const savedMode = (localStorage.getItem('drafty-theme-mode') as 'dark' | 'light') || 'dark'
    const savedAccent = localStorage.getItem('drafty-accent') || null
    setThemeMode(savedMode)
    setAccentColor(savedAccent)
    applyTheme(savedTheme, savedMode, savedAccent)
    
    // Load text formatting preferences
    const savedTextColor = localStorage.getItem('drafty-text-color') || DEFAULT_TEXT_COLOR
    const savedFontSize = localStorage.getItem('drafty-font-size') || DEFAULT_FONT_SIZE
    setTextColor(savedTextColor)
    setFontSize(savedFontSize)
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
    applyTheme(currentTheme, themeMode, color)
    localStorage.setItem('drafty-accent', color)
  }

  const handleTextColorChange = (color: string) => {
    setTextColor(color)
    localStorage.setItem('drafty-text-color', color)
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    localStorage.setItem('drafty-font-size', size)
  }

  // Save notes to localStorage whenever they change (user-specific)
  useEffect(() => {
    if (user && notes.length > 0) {
      localStorage.setItem(`drafty-notes-${user.uid}`, JSON.stringify(notes))
    }
  }, [notes, user])

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      format: 'normal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes([newNote, ...notes])
    setSelectedNoteId(newNote.id)
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ))
  }

  const deleteNote = (id: string) => {
    const noteIndex = notes.findIndex(n => n.id === id)
    const newNotes = notes.filter(note => note.id !== id)
    setNotes(newNotes)
    
    if (selectedNoteId === id) {
      if (newNotes.length > 0) {
        const newSelectedIndex = Math.min(noteIndex, newNotes.length - 1)
        setSelectedNoteId(newNotes[newSelectedIndex].id)
      } else {
        setSelectedNoteId(null)
      }
    }
  }

  const selectedNote = notes.find(note => note.id === selectedNoteId)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleModeChange = (mode: Mode) => {
    // Auto-create a journal note when entering notebook if none exists
    if (mode === 'notebook' && !selectedNoteId) {
      createNewNote()
    }
    setCurrentMode(mode)
    setMenuOpen(false)
  }

  const handleSettings = () => {
    // Open settings as its own page
    handleModeChange('settings')
  }

  const handleLogout = async () => {
    setMenuOpen(false)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Still close menu even if logout fails
    }
  }

  const renderModeContent = () => {
    switch (currentMode) {
      case 'dashboard':
        return renderDashboard()
      case 'notebook':
        return renderNotebook()
      case 'flashcards':
        return renderFlashcards()
      case 'whiteboard':
        return renderWhiteboard()
      case 'study':
        return renderStudy()
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <Dashboard onModeSelect={(mode) => handleModeChange(mode as Mode)} />
  )

  const renderNotebook = () => (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Drafty</h1>
          <p>Your thoughts, organized</p>
          <button className="new-note-btn primary" onClick={createNewNote}>
            <EditIcon size={16} /> New Note
          </button>
        </div>
        <div className="notes-list">
          {notes.map(note => (
            <div
              key={note.id}
              className={`note-item ${selectedNoteId === note.id ? 'active' : ''}`}
              onClick={() => setSelectedNoteId(note.id)}
            >
              <div className="note-item-title">{note.title || 'Untitled'}</div>
              <div className="note-item-preview">
                {note.content.substring(0, 60) || 'No content'}
              </div>
              <div className="note-item-date">{formatDate(note.updatedAt)}</div>
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
      </aside>

      <main className="editor-container">
        {selectedNote ? (
          <>
            <div className="editor-header">
              <div>{formatDate(selectedNote.updatedAt)}</div>
              <div className="editor-actions">
                <div className="text-formatting-toolbar">
                  <label className="formatting-label">
                    Color:
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => handleTextColorChange(e.target.value)}
                      className="color-picker"
                    />
                  </label>
                  <label className="formatting-label">
                    Font Size:
                    <select
                      value={fontSize}
                      onChange={(e) => handleFontSizeChange(e.target.value)}
                      className="font-size-select"
                    >
                      <option value="12">12px</option>
                      <option value="14">14px</option>
                      <option value="16">16px</option>
                      <option value="18">18px</option>
                      <option value="20">20px</option>
                      <option value="24">24px</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
            <div className="editor-content">
              <input
                type="text"
                className="note-title-input"
                value={selectedNote.title}
                onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                placeholder="Note title..."
              />
              <textarea
                className="note-content-textarea"
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                placeholder="Start writing your note..."
                style={{ color: textColor, fontSize: `${fontSize}px` }}
              />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <PencilIcon size={64} />
            </div>
            <h2>No Note Selected</h2>
            <p>Create a new note or select one from the sidebar</p>
          </div>
        )}
      </main>
    </>
  )

  const renderFlashcards = () => (
    <div className="mode-container">
      <div className="mode-content">
        <div className="mode-header">
          <FlashcardsIcon size={48} />
          <h2>Flashcards</h2>
          <p>Create and study with flashcards</p>
        </div>
        <div className="mode-body">
          <FlashcardsManager flashcards={flashcards} setFlashcards={setFlashcards} user={user} />
        </div>
      </div>
    </div>
  )

  const renderWhiteboard = () => (
    <div className="mode-container">
      <div className="mode-content">
        <div className="mode-header">
          <WhiteboardIcon size={48} />
          <h2>Whiteboard</h2>
          <p>Draw and save sketches</p>
        </div>
        <div className="mode-body">
          <Whiteboard user={user} />
        </div>
      </div>
    </div>
  )

  const renderStudy = () => (
    <div className="mode-container">
      <div className="mode-content">
        <div className="mode-header">
          <StudyIcon size={48} />
          <h2>Study & Revise</h2>
          <p>Review your flashcards and revise effectively</p>
        </div>
        <div className="mode-body">
          <StudyManager flashcards={flashcards} />
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="mode-container">
      <div className="mode-content settings-page">
        <div className="mode-header">
          <SettingsIcon size={48} />
          <h2>Settings</h2>
          <p>Account and appearance</p>
        </div>
        <div className="mode-body">
          <div className="settings-section">
            <h3>Account</h3>
            <div className="setting-item">
              <label>Email</label>
              <div className="setting-value">{user?.email}</div>
            </div>
          </div>
          <div className="settings-section">
            <h3>Theme</h3>
            <p className="settings-description">Choose from Catppuccin color themes</p>
            <div className="theme-grid">
              {getThemeNames().map((themeName) => (
                <button
                  key={themeName}
                  className={`theme-option ${currentTheme === themeName ? 'active' : ''}`}
                  onClick={() => handleThemeChange(themeName)}
                  style={{
                    backgroundColor: themes[themeName].colors.base,
                    color: themes[themeName].colors.text,
                    borderColor: currentTheme === themeName ? themes[themeName].colors.accent : 'transparent'
                  }}
                >
                  {themes[themeName].name}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Mode</label>
              <select value={themeMode} onChange={(e) => handleThemeModeChange(e.target.value as 'dark'|'light')}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Accent color</label>
              <input type="color" value={accentColor || '#cba6f7'} onChange={(e) => handleAccentChange(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="app">
      {/* Burger Menu */}
      <button 
        className="burger-menu-btn" 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span className="burger-line"></span>
        <span className="burger-line"></span>
        <span className="burger-line"></span>
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
          <div className="dropdown-menu">
            <div className="menu-header">
              <h2 className="menu-logo">Drafty</h2>
              <p className="menu-tagline">Your thoughts, organized</p>
            </div>
            <div className="menu-divider" />
            <div className="menu-section">
              <div className="menu-section-title">Modes</div>
              <button 
                className={`menu-item ${currentMode === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleModeChange('dashboard')}
              >
                <span className="menu-icon"><DashboardIcon size={20} /></span>
                Dashboard
              </button>
              <button 
                className={`menu-item ${currentMode === 'notebook' ? 'active' : ''}`}
                onClick={() => handleModeChange('notebook')}
              >
                <span className="menu-icon"><BookIcon size={20} /></span>
                Notebook
              </button>
              <button 
                className={`menu-item ${currentMode === 'flashcards' ? 'active' : ''}`}
                onClick={() => handleModeChange('flashcards')}
              >
                <span className="menu-icon"><FlashcardsIcon size={20} /></span>
                Flashcards
              </button>
              <button 
                className={`menu-item ${currentMode === 'whiteboard' ? 'active' : ''}`}
                onClick={() => handleModeChange('whiteboard')}
              >
                <span className="menu-icon"><WhiteboardIcon size={20} /></span>
                Whiteboard
              </button>
              <button 
                className={`menu-item ${currentMode === 'study' ? 'active' : ''}`}
                onClick={() => handleModeChange('study')}
              >
                <span className="menu-icon"><StudyIcon size={20} /></span>
                Study and Revise
              </button>
            </div>
            {selectedNote && currentMode === 'notebook' && (
              <>
                <div className="menu-divider" />
                <div className="menu-section">
                  <button 
                    className="menu-item delete" 
                    onClick={() => {
                      deleteNote(selectedNote.id)
                      setMenuOpen(false)
                    }}
                  >
                    <span className="menu-icon"><TrashIcon size={20} /></span>
                    Delete Note
                  </button>
                </div>
              </>
            )}
            <div className="menu-divider" />
            <div className="menu-section">
              <button className="menu-item" onClick={handleSettings}>
                <span className="menu-icon"><SettingsIcon size={20} /></span>
                Settings
              </button>
              <button className="menu-item logout" onClick={handleLogout}>
                <span className="menu-icon"><LogoutIcon size={20} /></span>
                Log Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Settings handled as its own mode (page) */}
      {currentMode === 'settings' ? renderSettings() : renderModeContent()}
    </div>
  )
}

export default App

// --- Small inline components for flashcards, whiteboard, and study ---

function FlashcardsManager({ flashcards, setFlashcards, user }: any) {
  useEffect(() => {
    if (!user) return
    const saved = localStorage.getItem(`drafty-flashcards-${user.uid}`)
    if (saved) setFlashcards(JSON.parse(saved))
  }, [user])

  useEffect(() => {
    if (!user) return
    localStorage.setItem(`drafty-flashcards-${user.uid}`, JSON.stringify(flashcards))
  }, [flashcards, user])

  const [front, setFront] = useState('')
  const [back, setBack] = useState('')

  const addCard = () => {
    if (!front && !back) return
    setFlashcards([{ id: Date.now().toString(), front, back, known: false }, ...flashcards])
    setFront('')
    setBack('')
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Front" value={front} onChange={(e) => setFront(e.target.value)} />
        <input placeholder="Back" value={back} onChange={(e) => setBack(e.target.value)} />
        <button onClick={addCard}>Add</button>
      </div>
      <div>
        {flashcards.map((c: any) => (
          <div key={c.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
            <strong>{c.front}</strong>
            <div style={{ color: '#666' }}>{c.back}</div>
          </div>
        ))}
      </div>
      <StudyManager flashcards={flashcards} />
    </div>
  )
}

function StudyManager({ flashcards }: any) {
  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  if (!flashcards || flashcards.length === 0) return <div>No flashcards yet.</div>

  const card = flashcards[index % flashcards.length]

  return (
    <div>
      <div style={{ padding: 16, border: '1px solid var(--border-color)', borderRadius: 8 }}>
        <h3>{card.front}</h3>
        {showBack && <p>{card.back}</p>}
        <div style={{ marginTop: 8 }}>
          <button onClick={() => setShowBack(!showBack)}>{showBack ? 'Hide' : 'Show'} Answer</button>
          <button onClick={() => { setIndex(index + 1); setShowBack(false) }}>Next</button>
        </div>
      </div>
    </div>
  )
}

function Whiteboard({ user }: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [drawing, setDrawing] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio
    const context = canvas.getContext('2d')
    if (!context) return
    context.scale(devicePixelRatio, devicePixelRatio)
    context.lineCap = 'round'
    context.strokeStyle = '#000'
    context.lineWidth = 2
    setCtx(context)

    // Load saved
    if (user) {
      const saved = localStorage.getItem(`drafty-whiteboard-${user.uid}`)
      if (saved) {
        const img = new Image()
        img.onload = () => context.drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight)
        img.src = saved
      }
    }
  }, [user])

  const start = (e: any) => {
    setDrawing(true)
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
    ctx?.beginPath()
    ctx?.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const move = (e: any) => {
    if (!drawing) return
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
    ctx?.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx?.stroke()
  }

  const end = () => {
    setDrawing(false)
    ctx?.closePath()
  }

  const clear = () => {
    const canvas = canvasRef.current
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (user) localStorage.removeItem(`drafty-whiteboard-${user.uid}`)
  }

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const data = canvas.toDataURL()
    if (user) localStorage.setItem(`drafty-whiteboard-${user.uid}`, data)
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={save}>Save</button>
        <button onClick={clear}>Clear</button>
      </div>
      <div style={{ border: '1px solid var(--border-color)', borderRadius: 8 }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: 400 }} onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end} />
      </div>
    </div>
  )
}
