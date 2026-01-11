/* eslint-disable react-hooks/set-state-in-effect */
import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './AuthContext'
import { useAuth } from './useAuth'
import { Auth } from './Auth'
import { Homepage } from './Homepage'
import { SettingsPage } from './SettingsPage'
import App from './App.tsx'

export function RootApp() {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState<'homepage' | 'auth' | 'app' | 'settings'>('homepage')

  // Determine which view to show based on user state and hash
  useEffect(() => {
    const determineView = () => {
      const hash = window.location.hash
      
      if (user) {
        if (hash === '#settings') return 'settings'
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

  const viewNode =
    currentView === 'homepage' ? (
      <Homepage />
    ) : currentView === 'auth' ? (
      <Auth />
    ) : currentView === 'settings' ? (
      <SettingsPage />
    ) : (
      <App />
    )

  return <div className="app-view" key={currentView}>{viewNode}</div>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RootApp />
    </AuthProvider>
  </StrictMode>,
)
