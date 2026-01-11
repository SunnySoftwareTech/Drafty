import type { Flashcard } from '../models'
import { FlashcardsIcon } from '../icons'
import { FlashcardsManager } from '../components/FlashcardsManager'

export function FlashcardsPage({
  user,
  flashcards,
  setFlashcards,
}: {
  user: { uid: string } | null
  flashcards: Flashcard[]
  setFlashcards: (v: Flashcard[]) => void
}) {
  return (
    <div className="mode-container">
      <div className="mode-content">
        <div className="mode-header">
          <FlashcardsIcon size={48} />
          <h2>Flashcards</h2>
          <p>Create and study with interactive flashcards</p>
        </div>
        <div className="mode-body">
          <FlashcardsManager flashcards={flashcards} setFlashcards={setFlashcards} user={user} />
        </div>
      </div>
    </div>
  )
}
