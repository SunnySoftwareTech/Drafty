import type { Flashcard, FlashcardFolder } from '../models'
import { FlashcardsIcon } from '../icons'
import { FlashcardsManager } from '../components/FlashcardsManager'

export function FlashcardsPage({
  user,
  flashcards,
  setFlashcards,
  folders,
  setFolders,
}: {
  user: { uid: string } | null
  flashcards: Flashcard[]
  setFlashcards: (v: Flashcard[]) => void
  folders: FlashcardFolder[]
  setFolders: (v: FlashcardFolder[]) => void
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
          <FlashcardsManager flashcards={flashcards} setFlashcards={setFlashcards} user={user} folders={folders} setFolders={setFolders} />
        </div>
      </div>
    </div>
  )
}
