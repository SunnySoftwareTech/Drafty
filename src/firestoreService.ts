// Firebase Firestore service for cross-device data synchronization

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { db } from './firebase'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  deckId: string
  createdAt: string
  lastReviewed?: string
  nextReview?: string
  easeFactor: number
  interval: number
}

export interface UserPreferences {
  theme: string
  [key: string]: any
}

// Notes API
export const saveNote = async (userId: string, note: Note) => {
  try {
    const noteRef = doc(db, 'users', userId, 'notes', note.id)
    await setDoc(noteRef, {
      ...note,
      updatedAt: Timestamp.now().toDate().toISOString(),
    })
  } catch (error) {
    console.error('Error saving note:', error)
    throw error
  }
}

export const getNotes = async (userId: string): Promise<Note[]> => {
  try {
    const notesRef = collection(db, 'users', userId, 'notes')
    const q = query(notesRef, orderBy('updatedAt', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data() as Note)
  } catch (error) {
    console.error('Error getting notes:', error)
    return []
  }
}

export const deleteNote = async (userId: string, noteId: string) => {
  try {
    const noteRef = doc(db, 'users', userId, 'notes', noteId)
    await deleteDoc(noteRef)
  } catch (error) {
    console.error('Error deleting note:', error)
    throw error
  }
}

// Flashcards API
export const saveFlashcard = async (userId: string, flashcard: Flashcard) => {
  try {
    const cardRef = doc(db, 'users', userId, 'flashcards', flashcard.id)
    await setDoc(cardRef, flashcard)
  } catch (error) {
    console.error('Error saving flashcard:', error)
    throw error
  }
}

export const getFlashcards = async (userId: string, deckId?: string): Promise<Flashcard[]> => {
  try {
    const cardsRef = collection(db, 'users', userId, 'flashcards')
    let q = query(cardsRef)
    if (deckId) {
      q = query(cardsRef, where('deckId', '==', deckId))
    }
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data() as Flashcard)
  } catch (error) {
    console.error('Error getting flashcards:', error)
    return []
  }
}

export const deleteFlashcard = async (userId: string, cardId: string) => {
  try {
    const cardRef = doc(db, 'users', userId, 'flashcards', cardId)
    await deleteDoc(cardRef)
  } catch (error) {
    console.error('Error deleting flashcard:', error)
    throw error
  }
}

// User Preferences API
export const saveUserPreferences = async (userId: string, preferences: UserPreferences) => {
  try {
    const prefsRef = doc(db, 'users', userId, 'settings', 'preferences')
    await setDoc(prefsRef, preferences, { merge: true })
  } catch (error) {
    console.error('Error saving preferences:', error)
    throw error
  }
}

export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const prefsRef = doc(db, 'users', userId, 'settings', 'preferences')
    const docSnap = await getDoc(prefsRef)
    return docSnap.exists() ? docSnap.data() as UserPreferences : null
  } catch (error) {
    console.error('Error getting preferences:', error)
    return null
  }
}
