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

export const applyTheme = (
  themeName: string,
  mode: 'dark' | 'light' = 'dark',
  accentOverride: string | null = null,
  blackAndWhite: boolean = false,
) => {
  const theme = themes[themeName] || themes.mocha
  const root = document.documentElement

  root.setAttribute('data-theme-mode', mode)

  // Determine base palettes for light/dark
  const isLight = mode === 'light'
  const base = isLight ? invertColor(theme.colors.base, '#ffffff') : theme.colors.base
  const surface = isLight ? invertColor(theme.colors.surface, '#ffffff') : theme.colors.surface
  const overlay = isLight ? invertColor(theme.colors.overlay, '#f6f6f6') : theme.colors.overlay
  const text = isLight ? '#111' : theme.colors.text
  const subtext = isLight ? '#444' : theme.colors.subtext

  const accentRaw = accentOverride || theme.colors.accent
  let accent = isLight ? ensureReadableAccentOnLight(accentRaw) : accentRaw
  let accentHover = isLight ? darken(accent, 0.12) : theme.colors.accentHover
  let accentLight = isLight ? tintTowards(accent, '#ffffff', 0.86) : theme.colors.accentLight

  if (blackAndWhite) {
    // Force grayscale accents and readable text for B/W mode
    accent = isLight ? '#000000' : '#ffffff'
    accentHover = isLight ? '#222222' : '#cccccc'
    accentLight = isLight ? '#f6f6f6' : '#111111'
  }

  // Apply colors
  root.style.setProperty('--bg-primary', base)
  root.style.setProperty('--bg-secondary', surface)
  root.style.setProperty('--bg-hover', overlay)
  root.style.setProperty('--text-primary', text)
  root.style.setProperty('--text-secondary', subtext)
  root.style.setProperty('--text-tertiary', subtext)
  root.style.setProperty('--border-color', overlay)
  root.style.setProperty('--accent-color', accent)
  root.style.setProperty('--accent-hover', accentHover)
  root.style.setProperty('--accent-light', accentLight)
  
  // Apply font properties
  root.style.setProperty('--font-family', theme.font.family)
  root.style.setProperty('--font-size', theme.font.size)
  root.style.setProperty('--line-height', theme.font.lineHeight)
}

function ensureReadableAccentOnLight(hex: string) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const l = relativeLuminance(rgb)
  if (l <= 0.62) return hex
  // Darken very light accent colors so icons/borders remain visible in light mode.
  const strength = l > 0.78 ? 0.42 : 0.28
  return darken(hex, strength)
}

function tintTowards(hex: string, targetHex: string, targetWeight: number) {
  const a = hexToRgb(hex)
  const b = hexToRgb(targetHex)
  if (!a || !b) return hex
  const w = clamp01(targetWeight)
  return rgbToHex(
    a.r * (1 - w) + b.r * w,
    a.g * (1 - w) + b.g * w,
    a.b * (1 - w) + b.b * w,
  )
}

function darken(hex: string, amount: number) {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const a = clamp01(amount)
  return rgbToHex(rgb.r * (1 - a), rgb.g * (1 - a), rgb.b * (1 - a))
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.trim().replace('#', '')
  if (h.length !== 6) return null
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
  const rr = clampByte(r).toString(16).padStart(2, '0')
  const gg = clampByte(g).toString(16).padStart(2, '0')
  const bb = clampByte(b).toString(16).padStart(2, '0')
  return `#${rr}${gg}${bb}`
}

function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}

// WCAG relative luminance (sRGB)
function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const rs = srgbToLinear(r / 255)
  const gs = srgbToLinear(g / 255)
  const bs = srgbToLinear(b / 255)
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function srgbToLinear(c: number) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
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
