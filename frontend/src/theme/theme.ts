import { createTheme, alpha } from '@mui/material/styles'
import { getColors, type ThemeColors } from './colors'

export function createAppTheme(mode: 'light' | 'dark') {
  const colors = getColors(mode)
  return createTheme({
    palette: {
      mode,
      primary: { main: colors.primary },
      secondary: { main: colors.primary },
      success: { main: colors.success },
      error: { main: colors.danger },
      info: { main: colors.primary },
      background: {
        default: colors.background,
        paper: colors.elevation,
      },
      text: {
        primary: colors.text,
        secondary: colors.muted,
      },
      divider: colors.divider,
    },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background,
          minHeight: '100vh',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: colors.elevation,
            color: colors.text,
            fontWeight: 600,
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderBottom: `1px solid ${colors.divider}`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: colors.divider,
          color: colors.text,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(colors.primary, 0.04),
          },
          '&:last-child .MuiTableCell-body': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          border: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
  })
}
