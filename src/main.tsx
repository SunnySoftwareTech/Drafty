/* eslint-disable react-hooks/set-state-in-effect */
import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './AuthContext'
import { useAuth } from './useAuth'
import { Auth } from './Auth'
import { Homepage } from './Homepage'
import App from './App.tsx'

export function RootApp() {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState<'homepage' | 'auth' | 'app'>('homepage')

  // Determine which view to show based on user state and hash
  useEffect(() => {
    const determineView = () => {
      const hash = window.location.hash
      
      if (user) {
        return 'app'
      }
      
      if (hash === '#app') {
        return 'auth'
      }
      
      return 'homepage'
    }

    const newView = determineView()
    if (newView !== currentView) {
      setCurrentView(newView)
    }

    const handleHashChange = () => {
      const newView = determineView()
      if (newView !== currentView) {
        setCurrentView(newView)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [user, currentView])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        color: 'var(--text-tertiary)'
      }}>
        Loading...
      </div>
    )
  }

  if (currentView === 'homepage') {
    return <Homepage />
  }

  if (currentView === 'auth') {
    return <Auth />
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  </StrictMode>,
)
