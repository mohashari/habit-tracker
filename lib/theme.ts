import { createTheme } from '@mui/material/styles'

export function buildTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#7c3aed' },
      secondary: { main: '#059669' },
      background: {
        default: mode === 'dark' ? '#0d0d14' : '#f5f3ff',
        paper: mode === 'dark' ? '#16162a' : '#ffffff',
      },
    },
    shape: { borderRadius: 16 },
    typography: { fontFamily: 'Inter, sans-serif' },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
      MuiCard: { styleOverrides: { root: { backgroundImage: 'none' } } },
    },
  })
}
