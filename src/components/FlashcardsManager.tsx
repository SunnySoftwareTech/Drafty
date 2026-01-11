import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { Flashcard } from '../models'
import { StudyManager } from './StudyManager'

export function FlashcardsManager({
  flashcards,
  setFlashcards,
  user,
}: {
  flashcards: Flashcard[]
  setFlashcards: (v: Flashcard[]) => void
  user: { uid: string } | null
}) {
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')

  const addCard = () => {
    if (!user) return
    if (!front.trim() && !back.trim()) return
    const now = new Date().toISOString()
    const card: Flashcard = {
      id: Date.now().toString(),
      front,
      back,
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

  return (
    <div>
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
        <button onClick={addCard} className="primary">
          Add
        </button>
      </div>

      <div>
        {flashcards.length === 0 ? (
          <div style={{ color: 'var(--text-tertiary)' }}>No flashcards yet.</div>
        ) : (
          flashcards.map((c) => (
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
              <button onClick={() => removeCard(c.id)} className="delete-btn">
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <StudyManager flashcards={flashcards} />
      </div>
    </div>
  )
}
