import { EditIcon, PencilIcon } from '../icons'
import type { Book, Project, Flashcard } from '../models'
import type { ChangeEvent } from 'react'
import { useMemo, useState } from 'react'

export function ProjectsPage({
  books,
  projects,
  setProjects,
  selectedProjectId,
  setSelectedProjectId,
  openNotebook,
  flashcards,
  flashcardFolders,
}: {
  books: Book[]
  projects: Project[]
  setProjects: (v: Project[]) => void
  selectedProjectId: string | null
  setSelectedProjectId: (id: string | null) => void
  openNotebook: (bookId: string) => void
  flashcards: Flashcard[]
  flashcardFolders: import('../models').FlashcardFolder[]
}) {
  // legacy state removed: use `itemToAddId` and `kindToAdd`
  const [kindToAdd, setKindToAdd] = useState<'book' | 'flashcard'>('book')
  const [itemToAddId, setItemToAddId] = useState<string>('')
  const [addingOpen, setAddingOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const project = selectedProjectId ? projects.find((p) => p.id === selectedProjectId) || null : null

  // projectBooks intentionally unused; keep logic in rendering if needed later

  const addableBooks = useMemo(() => {
    if (!project) return []
    const inProject = new Set(project.items.filter((i) => i.kind === 'book').map((i) => i.id))
    return books.filter((b) => !inProject.has(b.id))
  }, [books, project])

  return (
    <div className="projects-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Projects</h1>
          <p>Group files (notebooks and flashcards) for studying</p>
          <button
            className="new-note-btn primary"
            onClick={() => {
              const now = new Date().toISOString()
              const id = Date.now().toString()
              const p: Project = { id, name: 'Untitled Project', items: [], createdAt: now, updatedAt: now }
              setProjects([p, ...projects])
              setSelectedProjectId(id)
            }}
          >
            <EditIcon size={16} /> New Project
          </button>
        </div>
        <div className="notes-list">
          {projects.map((p) => (
            <div
              key={p.id}
              className={`note-item ${selectedProjectId === p.id ? 'active' : ''}`}
              onClick={() => setSelectedProjectId(p.id)}
            >
              <div className="note-item-title">{p.name || 'Untitled Project'}</div>
              <div className="note-item-preview">{p.items.length} item{p.items.length === 1 ? '' : 's'}</div>
              <div className="note-item-date">{formatDate(p.updatedAt)}</div>
            </div>
          ))}
        </div>
      </aside>

      <main className="editor-container">
        {project ? (
          <div className="editor-content">
            <h2 className="projects-title">Project</h2>
            <input
              type="text"
              className="note-title-input"
              value={project.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const now = new Date().toISOString()
                setProjects(projects.map((p) => (p.id === project.id ? { ...p, name: e.target.value, updatedAt: now } : p)))
              }}
              placeholder="Project name..."
            />

            <div className="projects-section">
              <h3>Items in this project</h3>

              <div style={{ marginBottom: 12 }}>
                <button type="button" className="primary" onClick={() => setAddingOpen(!addingOpen)}>
                  {addingOpen ? 'Cancel' : 'Add item'}
                </button>
              </div>

              {addingOpen && (
                <div className="projects-add">
                  <label className="projects-add-label">
                    Kind
                    <select value={kindToAdd} onChange={(e: ChangeEvent<HTMLSelectElement>) => setKindToAdd(e.target.value as any)}>
                      <option value="book">Notebook</option>
                      <option value="flashcard">Flashcard</option>

                    </select>
                  </label>

                  <label className="projects-add-label">
                    Select
                    {kindToAdd === 'book' ? (
                      <select value={itemToAddId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setItemToAddId(e.target.value)}>
                        <option value="">Select a notebook…</option>
                        {addableBooks.map((b) => (
                          <option key={b.id} value={b.id}>{b.name || 'Untitled Notebook'}</option>
                        ))}
                      </select>
                    ) : kindToAdd === 'flashcard' ? (
                      <select value={itemToAddId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setItemToAddId(e.target.value)}>
                        <option value="">Select a flashcard…</option>
                        {flashcards.map((f) => (
                          <option key={f.id} value={f.id}>{f.front || f.id}{f.folderId ? ` (Folder: ${flashcardFolders.find(x => x.id === f.folderId)?.name ?? 'Unknown'})` : ''}</option>
                        ))}
                      </select>
                    ) : null}
                  </label>

                  <button
                    type="button"
                    className="primary"
                    disabled={!itemToAddId}
                    onClick={() => {
                      if (!itemToAddId) return
                      const now = new Date().toISOString()
                      const nextItems = [{ kind: kindToAdd, id: itemToAddId }, ...project.items]
                      setProjects(projects.map((p) => (p.id === project.id ? { ...p, items: nextItems, updatedAt: now } : p)))
                      setItemToAddId('')
                      setAddingOpen(false)
                    }}
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="projects-books">
                {project.items.length === 0 ? (
                  <p className="projects-muted">Nothing added yet. Use “Add item” above.</p>
                ) : (
                  project.items.map((it) => (
                    <div key={`${it.kind}-${it.id}`} className="projects-book-row">
                      <span className="projects-book-name">{it.kind}: {it.id}</span>
                      <div className="projects-book-actions">
                        {it.kind === 'book' && (
                          <button type="button" className="projects-open" onClick={() => openNotebook(it.id)}>
                            Open
                          </button>
                        )}
                        <button
                          type="button"
                          className="projects-remove"
                          onClick={() => {
                            const now = new Date().toISOString()
                            const nextItems = project.items.filter((i) => !(i.kind === it.kind && i.id === it.id))
                            setProjects(projects.map((p) => (p.id === project.id ? { ...p, items: nextItems, updatedAt: now } : p)))
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <PencilIcon size={64} />
            </div>
            <h2>No Project Selected</h2>
            <p>Create a new project or select one from the sidebar</p>
          </div>
        )}
      </main>
    </div>
  )
}
