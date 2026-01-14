/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { Dashboard } from './Dashboard'
import { applyTheme } from './themes'
import { TrashIcon, BookIcon, FlashcardsIcon, SettingsIcon, LogoutIcon, DashboardIcon, NotebookIcon } from './icons'
import type { Book, Flashcard, Page, Project, FlashcardFolder } from './models'
import { DEFAULT_FONT_FAMILY } from './utils/color'
import { FlashcardsPage } from './pages/FlashcardsPage'
import { NotebookPage } from './pages/NotebookPage'
import { ProjectsPage } from './pages/ProjectsPage'
import './App.css'

interface LegacyNote {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  format?: string
}

type Mode = 'dashboard' | 'notes' | 'projects' | 'notebook' | 'flashcards'

const DEFAULT_TEXT_COLOR = '#cdd6f4'
const DEFAULT_FONT_SIZE = '16'

function App() {
  const { user, logout } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [currentMode, setCurrentMode] = useState<Mode>('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR)
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE)
  const [editorFontFamily, setEditorFontFamily] = useState(DEFAULT_FONT_FAMILY)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [flashcardFolders, setFlashcardFolders] = useState<FlashcardFolder[]>([])

  // Load documents from localStorage on mount (and migrate legacy notes -> books)
  useEffect(() => {
    if (!user) {
      setBooks([])
      setSelectedBookId(null)
      setSelectedPageId(null)
      setProjects([])
      setSelectedProjectId(null)
      setFlashcards([])
      return
    }

    const booksKey = `drafty-books-${user.uid}`
    const legacyNotesKey = `drafty-notes-${user.uid}`
    const projectsKey = `drafty-projects-${user.uid}`
    const flashcardsKey = `drafty-flashcards-${user.uid}`
    const foldersKey = `drafty-flashcard-folders-${user.uid}`

    const loadJson = <T,>(key: string, fallback: T): T => {
      const raw = localStorage.getItem(key)
      if (!raw) return fallback
      try {
        return JSON.parse(raw) as T
      } catch (e) {
        console.error('Failed to parse storage key:', key, e)
        return fallback
      }
    }

    let loadedBooks = loadJson<Book[]>(booksKey, [])

    // Migrate legacy notes only if no books exist yet
    if (loadedBooks.length === 0) {
      const legacyNotes = loadJson<LegacyNote[]>(legacyNotesKey, [])
      if (legacyNotes.length > 0) {
        loadedBooks = legacyNotes.map((n) => {
          const now = new Date().toISOString()
          const page: Page = {
            id: `${n.id}-p1`,
            name: 'Page 1',
            content: n.content || '',
            order: 1,
            createdAt: n.createdAt || now,
            updatedAt: n.updatedAt || now,
          }
          return {
            id: n.id,
            name: n.title || 'Untitled Book',
            pages: [page],
            createdAt: n.createdAt || now,
            updatedAt: n.updatedAt || now,
          }
        })
        localStorage.setItem(booksKey, JSON.stringify(loadedBooks))
      }
    }

    const loadedProjects = loadJson<Project[]>(projectsKey, [])
    const loadedFlashcards = loadJson<Flashcard[]>(flashcardsKey, [])
    const loadedFolders = loadJson<FlashcardFolder[]>(foldersKey, [])

    setBooks(loadedBooks)
    setSelectedBookId(loadedBooks.length > 0 ? loadedBooks[0].id : null)
    setSelectedPageId(loadedBooks.length > 0 && loadedBooks[0].pages.length > 0 ? loadedBooks[0].pages[0].id : null)
    setProjects(loadedProjects)
    setSelectedProjectId(loadedProjects.length > 0 ? loadedProjects[0].id : null)
    setFlashcards(loadedFlashcards)
    setFlashcardFolders(loadedFolders)
  }, [user])

  // Load and apply theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('drafty-theme') || 'macchiato'
    const savedMode = (localStorage.getItem('drafty-theme-mode') as 'dark' | 'light') || 'dark'
    const savedAccent = localStorage.getItem('drafty-accent') || null
    applyTheme(savedTheme, savedMode, savedAccent)
    
    // Load text formatting preferences
    const savedTextColor = localStorage.getItem('drafty-text-color') || DEFAULT_TEXT_COLOR
    const savedFontSize = localStorage.getItem('drafty-font-size') || DEFAULT_FONT_SIZE
    const savedUiFont = localStorage.getItem('drafty-ui-font-family') || DEFAULT_FONT_FAMILY
    const savedEditorFont = localStorage.getItem('drafty-editor-font-family') || DEFAULT_FONT_FAMILY
    setTextColor(savedTextColor)
    setFontSize(savedFontSize)
    setEditorFontFamily(savedEditorFont)
    // apply css vars
    document.documentElement.style.setProperty('--ui-font-family', savedUiFont)
    document.documentElement.style.setProperty('--editor-font-family', savedEditorFont)
  }, [])

  const handleTextColorChange = (color: string) => {
    setTextColor(color)
    localStorage.setItem('drafty-text-color', color)
  }

  const handleFontSizeChange = (size: string) => {
    setFontSize(size)
    localStorage.setItem('drafty-font-size', size)
  }

  const handleEditorFontFamilyChange = (family: string) => {
    setEditorFontFamily(family)
    localStorage.setItem('drafty-editor-font-family', family)
    document.documentElement.style.setProperty('--editor-font-family', family)
  }

  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (!user) return
    localStorage.setItem(`drafty-books-${user.uid}`, JSON.stringify(books))
  }, [books, user])

  useEffect(() => {
    if (!user) return
    localStorage.setItem(`drafty-projects-${user.uid}`, JSON.stringify(projects))
  }, [projects, user])

  useEffect(() => {
    if (!user) return
    localStorage.setItem(`drafty-flashcards-${user.uid}`, JSON.stringify(flashcards))
  }, [flashcards, user])

  useEffect(() => {
    if (!user) return
    localStorage.setItem(`drafty-flashcard-folders-${user.uid}`, JSON.stringify(flashcardFolders))
  }, [flashcardFolders, user])

  const createNewBook = () => {
    const now = new Date().toISOString()
    const bookId = Date.now().toString()
    const firstPage: Page = {
      id: `${bookId}-p1`,
      name: 'Page 1',
      content: '',
      order: 1,
      createdAt: now,
      updatedAt: now,
    }
    const newBook: Book = {
      id: bookId,
      name: 'Untitled Book',
      pages: [firstPage],
      createdAt: now,
      updatedAt: now,
    }
    setBooks([newBook, ...books])
    setSelectedBookId(newBook.id)
    setSelectedPageId(firstPage.id)
  }

  const updateBook = (bookId: string, updates: Partial<Omit<Book, 'id' | 'pages'>> & { pages?: Page[] }) => {
    const now = new Date().toISOString()
    setBooks(
      books.map((b) =>
        b.id === bookId ? { ...b, ...updates, updatedAt: now } : b
      )
    )
  }

  const deleteBook = (bookId: string) => {
    const idx = books.findIndex((b) => b.id === bookId)
    const newBooks = books.filter((b) => b.id !== bookId)
    setBooks(newBooks)

    // remove from projects (any items referencing this book)
    setProjects(projects.map((p) => ({ ...p, items: p.items.filter((it) => !(it.kind === 'book' && it.id === bookId)) })))

    if (selectedBookId === bookId) {
      const next = newBooks.length > 0 ? newBooks[Math.min(idx, newBooks.length - 1)] : null
      setSelectedBookId(next ? next.id : null)
      setSelectedPageId(next && next.pages.length > 0 ? next.pages[0].id : null)
    }
  }

  const createNewPage = (bookId: string) => {
    const now = new Date().toISOString()
    const pageId = `${bookId}-p${Date.now().toString()}`
    
    const book = books.find((b) => b.id === bookId)
    if (!book) return
    
    const nextOrder = Math.max(0, ...book.pages.map(p => p.order ?? 0)) + 1
    const newPage: Page = {
      id: pageId,
      name: 'Untitled Page',
      content: '',
      order: nextOrder,
      createdAt: now,
      updatedAt: now,
    }

    updateBook(bookId, { pages: [newPage, ...book.pages] })
    setSelectedPageId(pageId)
  }

  const updatePage = (bookId: string, pageId: string, updates: Partial<Omit<Page, 'id'>>) => {
    const now = new Date().toISOString()
    const book = books.find((b) => b.id === bookId)
    if (!book) return
    const pages = book.pages.map((p) => (p.id === pageId ? { ...p, ...updates, updatedAt: now } : p))
    updateBook(bookId, { pages })
  }

  const deletePage = (bookId: string, pageId: string) => {
    const book = books.find((b) => b.id === bookId)
    if (!book) return
    const idx = book.pages.findIndex((p) => p.id === pageId)
    const newPages = book.pages.filter((p) => p.id !== pageId)
    updateBook(bookId, { pages: newPages })

    if (selectedPageId === pageId) {
      const next = newPages.length > 0 ? newPages[Math.min(idx, newPages.length - 1)] : null
      setSelectedPageId(next ? next.id : null)
    }
  }

  const selectedBook = books.find((b) => b.id === selectedBookId)
  const selectedPage = selectedBook?.pages.find((p) => p.id === selectedPageId) || null

  const handleModeChange = (mode: Mode) => {
    // Auto-create a book when entering notebook if none exists
    if (mode === 'notebook' && !selectedBookId) {
      createNewBook()
    }
    setCurrentMode(mode)
    setMenuOpen(false)
  }

  const handleSettings = () => {
    setMenuOpen(false)
    window.location.hash = '#settings'
  }

  const handleLogout = async () => {
    setMenuOpen(false)
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const renderModeContent = () => {
    switch (currentMode) {
      case 'dashboard':
        return renderDashboard()
      case 'notes':
        return (
          <NotebookPage
            userEmail={user?.email ?? null}
            books={books}
            selectedBookId={selectedBookId}
            setSelectedBookId={setSelectedBookId}
            selectedPageId={selectedPageId}
            setSelectedPageId={setSelectedPageId}
            createNewBook={createNewBook}
            createNewPage={createNewPage}
            updateBook={updateBook}
            updatePage={updatePage}
            deletePage={deletePage}
            textColor={textColor}
            setTextColor={handleTextColorChange}
            fontSize={fontSize}
            setFontSize={handleFontSizeChange}
            editorFontFamily={editorFontFamily}
            setEditorFontFamily={handleEditorFontFamilyChange}
          />
        )
      case 'projects':
        return (
          <ProjectsPage
            books={books}
            projects={projects}
            setProjects={setProjects}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            openNotebook={(bookId) => {
              setSelectedBookId(bookId)
              const book = books.find((b) => b.id === bookId) || null
              setSelectedPageId(book && book.pages.length > 0 ? book.pages[0].id : null)
              handleModeChange('notebook')
            }}
            flashcards={flashcards}
            flashcardFolders={flashcardFolders}
          />
        )
      case 'notebook':
        return (
          <NotebookPage
            userEmail={user?.email ?? null}
            books={books}
            selectedBookId={selectedBookId}
            setSelectedBookId={setSelectedBookId}
            selectedPageId={selectedPageId}
            setSelectedPageId={setSelectedPageId}
            createNewBook={createNewBook}
            createNewPage={createNewPage}
            updateBook={updateBook}
            updatePage={updatePage}
            deletePage={deletePage}
            textColor={textColor}
            setTextColor={handleTextColorChange}
            fontSize={fontSize}
            setFontSize={handleFontSizeChange}
            editorFontFamily={editorFontFamily}
            setEditorFontFamily={handleEditorFontFamilyChange}
          />
        )
      case 'flashcards':
        return <FlashcardsPage user={user ? { uid: user.uid } : null} flashcards={flashcards} setFlashcards={setFlashcards} folders={flashcardFolders} setFolders={setFlashcardFolders} />
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => (
    <Dashboard onModeSelect={(mode) => handleModeChange(mode as Mode)} />
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
                className={`menu-item ${currentMode === 'notes' ? 'active' : ''}`}
                onClick={() => handleModeChange('notes')}
              >
                <span className="menu-icon"><NotebookIcon size={20} /></span>
                Notes
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
                className={`menu-item ${currentMode === 'projects' ? 'active' : ''}`}
                onClick={() => handleModeChange('projects')}
              >
                <span className="menu-icon"><BookIcon size={20} /></span>
                Projects
              </button>
            </div>
            {selectedBook && currentMode === 'notebook' && (
              <>
                <div className="menu-divider" />
                <div className="menu-section">
                  <button 
                    className="menu-item delete" 
                    onClick={() => {
                      deleteBook(selectedBook.id)
                      setMenuOpen(false)
                    }}
                  >
                    <span className="menu-icon"><TrashIcon size={20} /></span>
                    Delete Book
                  </button>
                  {selectedPage && (
                    <button
                      className="menu-item delete"
                      onClick={() => {
                        deletePage(selectedBook.id, selectedPage.id)
                        setMenuOpen(false)
                      }}
                    >
                      <span className="menu-icon"><TrashIcon size={20} /></span>
                      Delete Page
                    </button>
                  )}
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

      {renderModeContent()}
    </div>
  )
}

export default App
