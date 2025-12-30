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

function App() {
  const { user, logout } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

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

  return (
    <div className="app">
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
          <button className="logout-btn" onClick={logout}>
            🚪 Sign Out
          </button>
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
    </div>
  )
}

export default App
