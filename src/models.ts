export interface Page {
  id: string
  name: string
  content: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Book {
  id: string
  name: string
  pages: Page[]
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  // items can reference any file type: 'book', 'flashcard', 'page'
  items: { kind: 'book' | 'flashcard' | 'page'; id: string }[]
  createdAt: string
  updatedAt: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  folderId?: string | null
  createdAt: string
  updatedAt: string
}

export interface FlashcardFolder {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}
