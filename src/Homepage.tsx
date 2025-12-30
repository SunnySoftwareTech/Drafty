import './Homepage.css'

export function Homepage() {
  const handleGetStarted = () => {
    window.location.hash = 'app'
  }

  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="logo">Drafty</div>
        <nav className="homepage-nav">
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main className="homepage-main">
        <section className="hero">
          <div className="hero-content">
            <h1>Your Thoughts, Organized</h1>
            <p className="hero-subtitle">
              A beautiful, secure note-taking app with Firebase authentication
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
              <div className="feature-icon">🔐</div>
              <h3>Secure Authentication</h3>
              <p>Firebase Authentication ensures your data is protected with industry-standard security</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✏️</div>
              <h3>Simple & Beautiful</h3>
              <p>Clean, minimalist interface inspired by Claude's design language</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Auto-Save</h3>
              <p>Your notes are automatically saved as you type, never lose your work</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3>Personal & Private</h3>
              <p>Each user has their own isolated note storage</p>
            </div>
          </div>
        </section>

        <section id="security" className="security">
          <h2>Built with Security in Mind</h2>
          <div className="security-content">
            <div className="security-item">
              <h3>🔒 Firebase Authentication</h3>
              <p>Industry-leading authentication from Google Firebase with secure email/password login</p>
            </div>
            <div className="security-item">
              <h3>🛡️ User Isolation</h3>
              <p>Your notes are stored separately per user - no one else can access your data</p>
            </div>
            <div className="security-item">
              <h3>💻 Local Storage</h3>
              <p>Notes are saved in your browser's secure localStorage, tied to your authenticated session</p>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <h2>Where Your Data is Saved</h2>
          <div className="data-storage">
            <p>
              <strong>Currently:</strong> Your notes are stored in your browser's localStorage, 
              associated with your Firebase user ID. This means:
            </p>
            <ul>
              <li>✅ Notes are private and isolated per user account</li>
              <li>✅ Data stays on your device for privacy</li>
              <li>✅ Fast access and instant saving</li>
              <li>⚠️ Notes are device-specific (not synced across devices)</li>
            </ul>
            <p className="future-note">
              <strong>Future Enhancement:</strong> Firebase Firestore integration coming soon 
              for cloud storage and cross-device sync while maintaining security.
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
        <p>&copy; 2025 Drafty. Your thoughts, organized.</p>
      </footer>
    </div>
  )
}
