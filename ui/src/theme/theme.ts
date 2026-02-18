import { createTheme, alpha, PaletteMode } from '@mui/material/styles';

const LIGHT = {
  primary: '#00897B',
  primaryLight: '#4DB6AC',
  primaryDark: '#00695C',
  bg: '#F5F7FA',
  paper: '#FFFFFF',
  surface: '#F0F2F5',
  border: '#E2E8F0',
  textPrimary: '#1A1A2E',
  textSecondary: '#64748B',
};

const DARK = {
  primary: '#00BFA6',
  primaryLight: '#33CCBB',
  primaryDark: '#009688',
  bg: '#0B0F19',
  paper: '#111827',
  surface: '#1E293B',
  border: '#1E293B',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
};

export const createAppTheme = (mode: PaletteMode) => {
  const c = mode === 'light' ? LIGHT : DARK;

  return createTheme({
    palette: {
      mode,
      primary: { main: c.primary, light: c.primaryLight, dark: c.primaryDark, contrastText: '#fff' },
      secondary: { main: '#6366F1', light: '#818CF8', dark: '#4338CA' },
      background: { default: c.bg, paper: c.paper },
      text: { primary: c.textPrimary, secondary: c.textSecondary },
      error: { main: '#EF4444' },
      warning: { main: '#F59E0B' },
      success: { main: '#10B981' },
      info: { main: '#3B82F6' },
      divider: c.border,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase' as const },
      button: { fontWeight: 600, letterSpacing: '0.02em' },
    },
    shape: { borderRadius: 0 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            scrollbarColor: `${c.surface} transparent`,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: c.surface, borderRadius: 0 },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 0, padding: '8px 20px', fontSize: '0.875rem' },
          contained: { '&:hover': { filter: 'brightness(1.08)' } },
          outlined: {
            borderColor: c.border,
            '&:hover': { borderColor: c.primary, backgroundColor: alpha(c.primary, 0.08) },
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { borderRadius: 0, border: `1px solid ${c.border}`, backgroundImage: 'none' } },
      },
      MuiPaper: {
        styleOverrides: { root: { borderRadius: 0, backgroundImage: 'none' } },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 0,
              backgroundColor: mode === 'light' ? '#fff' : alpha(c.surface, 0.5),
              '& fieldset': { borderColor: c.border },
              '&:hover fieldset': { borderColor: c.primaryDark },
              '&.Mui-focused fieldset': { borderColor: c.primary },
            },
            '& .MuiInputLabel-root': { fontSize: '0.85rem' },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 0, fontWeight: 500, fontSize: '0.75rem' },
          outlined: { borderColor: c.border },
        },
      },
      MuiAppBar: {
        styleOverrides: { root: { backgroundImage: 'none', borderBottom: `1px solid ${c.border}` } },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderBottomColor: c.border, fontSize: '0.82rem' },
          head: { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: c.textSecondary },
        },
      },
      MuiTableRow: {
        styleOverrides: { root: { '&:hover': { backgroundColor: `${alpha(c.primary, 0.04)} !important` } } },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 0, border: `1px solid ${c.border}`, backgroundImage: 'none' } },
      },
      MuiMenu: {
        styleOverrides: { paper: { borderRadius: 0, border: `1px solid ${c.border}`, backgroundImage: 'none' } },
      },
      MuiTab: {
        styleOverrides: { root: { textTransform: 'none', fontWeight: 600, minHeight: 40, padding: '6px 16px' } },
      },
      MuiTabs: {
        styleOverrides: { indicator: { height: 3, borderRadius: 0 } },
      },
      MuiAlert: {
        styleOverrides: { root: { borderRadius: 0 } },
      },
      MuiAvatar: {
        styleOverrides: { root: { borderRadius: 0 } },
      },
      MuiSkeleton: {
        styleOverrides: { root: { borderRadius: 0 } },
      },
    },
  });
};

export default createAppTheme('light');

