// Catppuccin Color Themes for Drafty
// Using Catppuccin Mocha palette (6 theme variations)

export interface Theme {
  name: string
  colors: {
    base: string
    surface: string
    overlay: string
    text: string
    subtext: string
    accent: string
    accentHover: string
    accentLight: string
  }
  font: {
    family: string
    size: string
    lineHeight: string
  }
}

// Shared font configuration for all themes
const defaultFont = {
  family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  size: '16px',
  lineHeight: '1.6',
}

export const themes: Record<string, Theme> = {
  latte: {
    name: 'Latte',
    colors: {
      base: '#eff1f5',
      surface: '#e6e9ef',
      overlay: '#ccd0da',
      text: '#4c4f69',
      subtext: '#6c6f85',
      accent: '#8839ef',
      accentHover: '#7c3aed',
      accentLight: '#e6d9f5',
    },
    font: defaultFont,
  },
  frappe: {
    name: 'Frappé',
    colors: {
      base: '#303446',
      surface: '#414559',
      overlay: '#51576d',
      text: '#c6d0f5',
      subtext: '#a5adce',
      accent: '#ca9ee6',
      accentHover: '#b584d9',
      accentLight: '#4a4059',
    },
    font: defaultFont,
  },
  macchiato: {
    name: 'Macchiato',
    colors: {
      base: '#24273a',
      surface: '#363a4f',
      overlay: '#494d64',
      text: '#cad3f5',
      subtext: '#a5adcb',
      accent: '#c6a0f6',
      accentHover: '#b38de6',
      accentLight: '#463854',
    },
    font: defaultFont,
  },
  mocha: {
    name: 'Mocha',
    colors: {
      base: '#1e1e2e',
      surface: '#313244',
      overlay: '#45475a',
      text: '#cdd6f4',
      subtext: '#a6adc8',
      accent: '#cba6f7',
      accentHover: '#b794e6',
      accentLight: '#3e3650',
    },
    font: defaultFont,
  },
  rosewater: {
    name: 'Rosewater',
    colors: {
      base: '#1e1e2e',
      surface: '#313244',
      overlay: '#45475a',
      text: '#cdd6f4',
      subtext: '#a6adc8',
      accent: '#f5e0dc',
      accentHover: '#e6cfca',
      accentLight: '#4a3f3d',
    },
    font: defaultFont,
  },
  teal: {
    name: 'Teal',
    colors: {
      base: '#1e1e2e',
      surface: '#313244',
      overlay: '#45475a',
      text: '#cdd6f4',
      subtext: '#a6adc8',
      accent: '#94e2d5',
      accentHover: '#80d5c4',
      accentLight: '#2d4a45',
    },
    font: defaultFont,
  },
}

export const applyTheme = (themeName: string, mode: 'dark' | 'light' = 'dark', accentOverride: string | null = null) => {
  const theme = themes[themeName] || themes.mocha
  const root = document.documentElement

  // Determine base palettes for light/dark
  const isLight = mode === 'light'
  const base = isLight ? invertColor(theme.colors.base, '#ffffff') : theme.colors.base
  const surface = isLight ? invertColor(theme.colors.surface, '#ffffff') : theme.colors.surface
  const overlay = isLight ? invertColor(theme.colors.overlay, '#f6f6f6') : theme.colors.overlay
  const text = isLight ? '#111' : theme.colors.text
  const subtext = isLight ? '#444' : theme.colors.subtext

  const accent = accentOverride || theme.colors.accent

  // Apply colors
  root.style.setProperty('--bg-primary', base)
  root.style.setProperty('--bg-secondary', surface)
  root.style.setProperty('--bg-hover', overlay)
  root.style.setProperty('--text-primary', text)
  root.style.setProperty('--text-secondary', subtext)
  root.style.setProperty('--text-tertiary', subtext)
  root.style.setProperty('--border-color', overlay)
  root.style.setProperty('--accent-color', accent)
  root.style.setProperty('--accent-hover', theme.colors.accentHover)
  root.style.setProperty('--accent-light', theme.colors.accentLight)
  
  // Apply font properties
  root.style.setProperty('--font-family', theme.font.family)
  root.style.setProperty('--font-size', theme.font.size)
  root.style.setProperty('--line-height', theme.font.lineHeight)
}

// Very small helper to blend/invert a color for a basic light mode conversion
function invertColor(hex: string, fallback: string) {
  try {
    // strip #
    const h = hex.replace('#', '')
    if (h.length !== 6) return fallback
    const r = parseInt(h.substring(0,2), 16)
    const g = parseInt(h.substring(2,4), 16)
    const b = parseInt(h.substring(4,6), 16)
    // simple luminance check; return lightened version
    const factor = 1.35
    const nr = Math.min(255, Math.floor(r * factor))
    const ng = Math.min(255, Math.floor(g * factor))
    const nb = Math.min(255, Math.floor(b * factor))
    return `#${nr.toString(16).padStart(2,'0')}${ng.toString(16).padStart(2,'0')}${nb.toString(16).padStart(2,'0')}`
  } catch (e) {
    return fallback
  }
}

export const getThemeNames = (): string[] => Object.keys(themes)

export const getTheme = (themeName: string): Theme => themes[themeName] || themes.mocha
