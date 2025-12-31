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
  },
}

export const applyTheme = (themeName: string) => {
  const theme = themes[themeName] || themes.mocha
  const root = document.documentElement

  root.style.setProperty('--bg-primary', theme.colors.base)
  root.style.setProperty('--bg-secondary', theme.colors.surface)
  root.style.setProperty('--bg-hover', theme.colors.overlay)
  root.style.setProperty('--text-primary', theme.colors.text)
  root.style.setProperty('--text-secondary', theme.colors.subtext)
  root.style.setProperty('--text-tertiary', theme.colors.subtext)
  root.style.setProperty('--border-color', theme.colors.overlay)
  root.style.setProperty('--accent-color', theme.colors.accent)
  root.style.setProperty('--accent-hover', theme.colors.accentHover)
  root.style.setProperty('--accent-light', theme.colors.accentLight)
}

export const getThemeNames = (): string[] => Object.keys(themes)

export const getTheme = (themeName: string): Theme => themes[themeName] || themes.mocha
