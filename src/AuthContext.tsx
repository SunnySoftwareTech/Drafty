/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './firebase'

export interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

// Demo credentials for testing purposes only (development/testing feature)
// In production, these should be removed or controlled via environment variables
const DEMO_EMAIL = 'demo@example.com'
const DEMO_PASSWORD = 'demo123'

const createDemoUser = (): User => ({
  uid: 'demo-user',
  email: DEMO_EMAIL,
} as User)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for demo mode in localStorage
    const demoMode = localStorage.getItem('drafty-demo-mode')
    if (demoMode === 'true') {
      setUser(createDemoUser())
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleDemoAuth = (email: string, password: string): boolean => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem('drafty-demo-mode', 'true')
      setUser(createDemoUser())
      return true
    }
    return false
  }

  const signup = async (email: string, password: string) => {
    // Check for demo mode
    if (handleDemoAuth(email, password)) {
      return
    }
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const login = async (email: string, password: string) => {
    // Check for demo mode
    if (handleDemoAuth(email, password)) {
      return
    }
    await signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const logout = async () => {
    try {
      localStorage.removeItem('drafty-demo-mode')
      await signOut(auth)
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
