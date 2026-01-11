import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { Flashcard, FlashcardFolder } from '../models'
import { StudyManager } from './StudyManager'

export function FlashcardsManager({
  flashcards,
  setFlashcards,
  user,
  folders,
  setFolders,
}: {
  flashcards: Flashcard[]
  setFlashcards: (v: Flashcard[]) => void
  user: { uid: string } | null
  folders: FlashcardFolder[]
  setFolders: (v: FlashcardFolder[]) => void
}) {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState<string | 'all'>('all')
  const [newFolderName, setNewFolderName] = useState('')
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState('')

  const visibleFlashcards = useMemo(() => {
    if (selectedFolderId === 'all') return flashcards
    return flashcards.filter((f) => f.folderId === selectedFolderId)
  }, [flashcards, selectedFolderId])

  const addCard = () => {
    if (!user) return
    if (!front.trim() && !back.trim()) return
    const now = new Date().toISOString()
    const card: Flashcard = {
      id: Date.now().toString(),
      front,
      back,
      folderId: selectedFolderId === 'all' ? null : selectedFolderId,
      createdAt: now,
      updatedAt: now,
    }
    setFlashcards([card, ...flashcards])
    setFront('')
    setBack('')
  }

  const removeCard = (id: string) => {
    setFlashcards(flashcards.filter((c) => c.id !== id))
  }

  const createFolder = () => {
    if (!user) return
    const name = newFolderName.trim() || 'New Folder'
    const now = new Date().toISOString()
    const f: FlashcardFolder = { id: Date.now().toString(), name, createdAt: now, updatedAt: now }
    setFolders([f, ...folders])
    setNewFolderName('')
  }

  const deleteFolder = (id: string) => {
    if (!confirm('Delete this folder? Flashcards will be unassigned, not deleted.')) return
    setFolders(folders.filter((f) => f.id !== id))
    // Unassign flashcards in that folder
    setFlashcards(flashcards.map((c) => (c.folderId === id ? { ...c, folderId: null } : c)))
    if (selectedFolderId === id) setSelectedFolderId('all')
  }

  const startEditFolder = (f: FlashcardFolder) => {
    setEditingFolderId(f.id)
    setEditingFolderName(f.name)
  }

  const saveEditFolder = () => {
    if (!editingFolderId) return
    setFolders(folders.map((f) => (f.id === editingFolderId ? { ...f, name: editingFolderName, updatedAt: new Date().toISOString() } : f)))
    setEditingFolderId(null)
    setEditingFolderName('')
  }

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <aside style={{ minWidth: 220 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input placeholder="New folder" value={newFolderName} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value)} />
          <button className="primary" onClick={createFolder}>Add</button>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 600 }}>Folders</div>
          <div style={{ marginTop: 6 }}>
            <div style={{ padding: 6, cursor: 'pointer', backgroundColor: selectedFolderId === 'all' ? 'var(--bg-hover)' : 'transparent' }} onClick={() => setSelectedFolderId('all')}>All flashcards</div>
            {folders.map((f) => (
              <div key={f.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 6, backgroundColor: selectedFolderId === f.id ? 'var(--bg-hover)' : 'transparent' }}>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setSelectedFolderId(f.id)}>{f.name}</div>
                <button onClick={() => startEditFolder(f)} title="Edit">✏️</button>
                <button onClick={() => deleteFolder(f.id)} title="Delete" className="danger">🗑️</button>
              </div>
            ))}
            {editingFolderId && (
              <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                <input value={editingFolderName} onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingFolderName(e.target.value)} />
                <button onClick={saveEditFolder} className="primary">Save</button>
                <button onClick={() => setEditingFolderId(null)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            placeholder="Question"
            value={front}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFront(e.target.value)}
            style={{ flex: '1 1 200px' }}
          />
          <input
            placeholder="Answer"
            value={back}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setBack(e.target.value)}
            style={{ flex: '1 1 200px' }}
          />

          <select value={selectedFolderId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedFolderId(e.target.value as any)}>
            <option value={'all'}>No folder</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          <button onClick={addCard} className="primary">Add</button>
        </div>

        <div>
          {visibleFlashcards.length === 0 ? (
            <div style={{ color: 'var(--text-tertiary)' }}>No flashcards yet.</div>
          ) : (
            visibleFlashcards.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: 10,
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <strong>{c.front}</strong>
                  <div style={{ color: 'var(--text-secondary)' }}>{c.back}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => removeCard(c.id)} className="delete-btn">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: 16 }}>
          <StudyManager flashcards={flashcards} />
        </div>
      </div>
    </div>
  )
}
