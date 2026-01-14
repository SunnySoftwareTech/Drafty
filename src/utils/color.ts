export const DEFAULT_FONT_FAMILY = '"Trebuchet MS", "Segoe UI", Tahoma, Arial, sans-serif'

export const COLOR_PRESETS = ['#cdd6f4', '#f38ba8', '#fab387', '#f9e2af', '#a6e3a1', '#89b4fa', '#cba6f7']

export function clampByte(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)))
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.trim().replace('#', '')
  if (h.length !== 6) return null
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null
  return { r, g, b }
}

export function rgbToHex(r: number, g: number, b: number) {
  const rr = clampByte(r).toString(16).padStart(2, '0')
  const gg = clampByte(g).toString(16).padStart(2, '0')
  const bb = clampByte(b).toString(16).padStart(2, '0')
  return `#${rr}${gg}${bb}`
}
