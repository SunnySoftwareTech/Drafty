import './Homepage.css'

export function Homepage() {
  const handleGetStarted = () => {
    window.location.hash = 'app'
  }

  const handleLogin = () => {
    window.location.hash = 'login'
  }

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="logo">Drafty</div>
        <nav className="homepage-nav">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <div className="auth-buttons">
            <button className="login-button" onClick={handleLogin}>Log In</button>
            <button className="signup-button" onClick={handleGetStarted}>Sign Up</button>
          </div>
        </nav>
      </header>

      <main className="homepage-main">
        <section className="hero">
          <div className="hero-content">
            <h1>Your Thoughts, Organized</h1>
            <p className="hero-subtitle">
              A beautiful, minimalist note-taking app for all your ideas
            </p>
            <button className="cta-button primary" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
          <div className="hero-visual">
            <div className="note-preview">
              <div className="note-preview-header">
                <div className="note-preview-dot"></div>
                <div className="note-preview-dot"></div>
                <div className="note-preview-dot"></div>
              </div>
              <div className="note-preview-content">
                <div className="note-preview-line wide"></div>
                <div className="note-preview-line"></div>
                <div className="note-preview-line medium"></div>
                <div className="note-preview-line"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Organized</h3>
              <p>Keep all your notes organized in one place with an intuitive sidebar</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 3C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Simple & Beautiful</h3>
              <p>Clean, minimalist interface inspired by Claude's design language</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Auto-Save</h3>
              <p>Your notes are automatically saved as you type, never lose your work</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Personal & Private</h3>
              <p>Each user has their own isolated note storage</p>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <h2>About Drafty</h2>
          <div className="data-storage">
            <p>
              Drafty is a modern note-taking application designed for simplicity and efficiency. 
              Built with the latest web technologies, it provides a seamless experience for capturing 
              and organizing your thoughts.
            </p>
            <p>
              Your notes are stored locally in your browser, giving you fast access and complete privacy. 
              Each user's data is isolated and secure, ensuring your thoughts remain yours alone.
            </p>
            <p className="future-note">
              <strong>Coming Soon:</strong> Cloud synchronization for seamless access across all your devices.
            </p>
          </div>
        </section>

        <section className="cta">
          <h2>Ready to Get Started?</h2>
          <button className="cta-button primary large" onClick={handleGetStarted}>
            Start Taking Notes
          </button>
        </section>
      </main>

      <footer className="homepage-footer">
        <p>&copy; 2026 Drafty. Your thoughts, organized.</p>
      </footer>
    </div>
  )
}
