import { useState } from 'react'
import { DashboardIcon, NotebookIcon, FlashcardsIcon, BookIcon } from './icons'
import './Dashboard.css'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.trim().replace('#', '')
  if (h.length !== 6) return null
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return { r, g, b }
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}

function rgbToHex(r: number, g: number, b: number) {
  const rr = clampByte(r).toString(16).padStart(2, '0')
  const gg = clampByte(g).toString(16).padStart(2, '0')
  const bb = clampByte(b).toString(16).padStart(2, '0')
  return `#${rr}${gg}${bb}`
}

function darken(hex: string, amount: number) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const a = clamp01(amount)
  return rgbToHex(rgb.r * (1 - a), rgb.g * (1 - a), rgb.b * (1 - a))
}

function srgbToLinear(c: number) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const rs = srgbToLinear(r / 255)
  const gs = srgbToLinear(g / 255)
  const bs = srgbToLinear(b / 255)
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

interface DashboardProps {
  onModeSelect: (mode: string) => void
}

export function Dashboard({ onModeSelect }: DashboardProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const themeMode = (localStorage.getItem('drafty-theme-mode') as 'dark' | 'light' | null) || 'dark'

  const ensureReadableCardColor = (hex: string) => {
    if (themeMode !== 'light') return hex
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    const l = relativeLuminance(rgb)
    if (l <= 0.62) return hex
    const strength = l > 0.78 ? 0.42 : 0.28
    return darken(hex, strength)
  }

  const modes = [
    {
      id: 'notes',
      name: 'Notes',
      description: 'Quick notes and ideas',
      icon: NotebookIcon,
      color: '#cba6f7',
    },
    {
      id: 'notebook',
      name: 'Notebook',
      description: 'Organize your notes with sections and chapters',
      icon: BookIcon,
      color: '#89b4fa',
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      description: 'Create and study with interactive flashcards',
      icon: FlashcardsIcon,
      color: '#94e2d5',
    },
    {
      id: 'projects',
      name: 'Projects',
      description: 'Group multiple notebooks for a class or goal',
      icon: BookIcon,
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
              style={{ '--card-color': ensureReadableCardColor(mode.color) } as React.CSSProperties}
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
