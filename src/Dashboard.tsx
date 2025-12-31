import { useState } from 'react'
import { DashboardIcon, NotebookIcon, FlashcardsIcon, WhiteboardIcon, StudyIcon } from './icons'
import './Dashboard.css'

interface DashboardProps {
  onModeSelect: (mode: string) => void
}

export function Dashboard({ onModeSelect }: DashboardProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const modes = [
    {
      id: 'notebook',
      name: 'Notebook',
      description: 'Organize your notes with sections and chapters',
      icon: NotebookIcon,
      color: '#cba6f7',
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      description: 'Create and study with interactive flashcards',
      icon: FlashcardsIcon,
      color: '#94e2d5',
    },
    {
      id: 'whiteboard',
      name: 'Whiteboard',
      description: 'Draw and brainstorm on a freeform canvas',
      icon: WhiteboardIcon,
      color: '#f5e0dc',
    },
    {
      id: 'study',
      name: 'Study & Revise',
      description: 'Test your knowledge with spaced repetition',
      icon: StudyIcon,
      color: '#f9e2af',
    },
  ]

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <DashboardIcon size={48} className="dashboard-icon" />
        <h1>Welcome to Drafty</h1>
        <p>Choose a mode to get started</p>
      </div>

      <div className="dashboard-grid">
        {modes.map((mode) => {
          const Icon = mode.icon
          return (
            <button
              key={mode.id}
              className={`dashboard-card ${hoveredCard === mode.id ? 'hovered' : ''}`}
              onClick={() => onModeSelect(mode.id)}
              onMouseEnter={() => setHoveredCard(mode.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ '--card-color': mode.color } as React.CSSProperties}
            >
              <div className="card-icon">
                <Icon size={48} />
              </div>
              <h3>{mode.name}</h3>
              <p>{mode.description}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
