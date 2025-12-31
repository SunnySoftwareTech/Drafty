/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import './App.css'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

type Mode = 'dashboard' | 'notebook' | 'flashcards' | 'whiteboard' | 'study'

function App() {
  const { user, logout } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [currentMode, setCurrentMode] = useState<Mode>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

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
    setCurrentMode(mode)
    setMenuOpen(false)
  }

  const handleSettings = () => {
    setSettingsOpen(true)
    setMenuOpen(false)
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
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Drafty</h1>
          <p>Your thoughts, organized</p>
          <button className="new-note-btn primary" onClick={createNewNote}>
            ✏️ New Note
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
                <button onClick={() => deleteNote(selectedNote.id)} className="delete-btn">
                  🗑️ Delete
                </button>
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
              />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h2>No Note Selected</h2>
            <p>Create a new note or select one from the sidebar</p>
          </div>
        )}
      </main>
    </>
  )

  const renderNotebook = () => (
    <div className="mode-container">
      <div className="mode-content">
        <div className="mode-header">
          <h2>📓 Notebook Mode</h2>
          <p>Organize your notes in a traditional notebook format</p>
        </div>
        <div className="mode-body">
          <p>Coming soon: Enhanced notebook view with sections and chapters</p>
        </div>
      </div>
    </div>
  )

  const renderFlashcards = () => (
    <div className="mode-container">
      <div className="mode-content">
        <div className="mode-header">
          <h2>🎴 Flashcards Mode</h2>
          <p>Create and study with flashcards</p>
        </div>
        <div className="mode-body">
          <p>Coming soon: Interactive flashcards for effective learning</p>
        </div>
      </div>
    </div>
  )

  const renderWhiteboard = () => (
    <div className="mode-container">
      <div className="mode-content">
        <div className="mode-header">
          <h2>🎨 Whiteboard Mode</h2>
          <p>Freeform canvas like Apple Freeform</p>
        </div>
        <div className="mode-body">
          <p>Coming soon: Draw, sketch, and brainstorm on an infinite canvas</p>
        </div>
      </div>
    </div>
  )

  const renderStudy = () => (
    <div className="mode-container">
      <div className="mode-content">
        <div className="mode-header">
          <h2>📚 Study and Revise</h2>
          <p>Review and test your knowledge</p>
        </div>
        <div className="mode-body">
          <p>Coming soon: Spaced repetition and active recall tools</p>
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
            <div className="menu-section">
              <div className="menu-section-title">Modes</div>
              <button 
                className={`menu-item ${currentMode === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleModeChange('dashboard')}
              >
                <span className="menu-icon">📊</span>
                Dashboard
              </button>
              <button 
                className={`menu-item ${currentMode === 'notebook' ? 'active' : ''}`}
                onClick={() => handleModeChange('notebook')}
              >
                <span className="menu-icon">📓</span>
                Notebook
              </button>
              <button 
                className={`menu-item ${currentMode === 'flashcards' ? 'active' : ''}`}
                onClick={() => handleModeChange('flashcards')}
              >
                <span className="menu-icon">🎴</span>
                Flashcards
              </button>
              <button 
                className={`menu-item ${currentMode === 'whiteboard' ? 'active' : ''}`}
                onClick={() => handleModeChange('whiteboard')}
              >
                <span className="menu-icon">🎨</span>
                Whiteboard
              </button>
              <button 
                className={`menu-item ${currentMode === 'study' ? 'active' : ''}`}
                onClick={() => handleModeChange('study')}
              >
                <span className="menu-icon">📚</span>
                Study and Revise
              </button>
            </div>
            <div className="menu-divider" />
            <div className="menu-section">
              <button className="menu-item" onClick={handleSettings}>
                <span className="menu-icon">⚙️</span>
                Settings
              </button>
              <button className="menu-item logout" onClick={handleLogout}>
                <span className="menu-icon">🚪</span>
                Log Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <>
          <div className="modal-overlay" onClick={() => setSettingsOpen(false)} />
          <div className="modal">
            <div className="modal-header">
              <h2>Settings</h2>
              <button className="modal-close" onClick={() => setSettingsOpen(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="settings-section">
                <h3>Account</h3>
                <div className="setting-item">
                  <label>Email</label>
                  <div className="setting-value">{user?.email}</div>
                </div>
              </div>
              <div className="settings-section">
                <h3>Preferences</h3>
                <p className="settings-note">More settings coming soon...</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      {renderModeContent()}
    </div>
  )
}

export default App
