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
  // items can reference any file type: 'book', 'flashcard', 'whiteboard', 'page'
  items: { kind: 'book' | 'flashcard' | 'whiteboard' | 'page'; id: string }[]
  createdAt: string
  updatedAt: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  createdAt: string
  updatedAt: string
}
