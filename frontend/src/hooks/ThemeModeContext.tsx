import { createContext, useState, useMemo, type ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createAppTheme } from '../theme/theme'

interface ThemeModeValue {
  mode: 'light' | 'dark'
  toggle: () => void
}

export const ThemeModeContext = createContext<ThemeModeValue>({
  mode: 'light',
  toggle: () => {},
})

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const theme = useMemo(() => createAppTheme(mode), [mode])
  const value = useMemo(() => ({
    mode,
    toggle: () => setMode(prev => prev === 'light' ? 'dark' : 'light'),
  }), [mode])

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}
