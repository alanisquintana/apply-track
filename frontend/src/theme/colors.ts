export const lightColors = {
  background: '#f4f6f9',
  elevation: '#ffffff',
  text: '#1a1d23',
  muted: '#6b7280',
  primary: '#3B82EF',
  success: '#22c59c',
  danger: '#ef4444',
  divider: '#e5e7eb',
} as const

export const darkColors = {
  background: '#192330',
  elevation: '#232f42',
  text: '#d6dce6',
  muted: '#9eaac5',
  primary: '#3B82EF',
  success: '#22c59c',
  danger: '#ef4444',
  divider: '#3b82f61a',
} as const

export type ThemeColors = typeof lightColors

export function getColors(mode: 'light' | 'dark') {
  return mode === 'light' ? lightColors : darkColors
}
