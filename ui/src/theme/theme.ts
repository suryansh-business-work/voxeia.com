import { createTheme, alpha } from '@mui/material/styles';

// Exyconn brand palette — dark, bold, premium SaaS feel
const BRAND = {
  primary: '#00BFA6',     // teal-green accent
  primaryLight: '#33CCBB',
  primaryDark: '#009688',
  surface: '#111827',      // near-black card surface
  surfaceLight: '#1E293B', // slightly lighter surface for hover/elevation
  bg: '#0B0F19',           // deepest background
  border: '#1E293B',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: BRAND.primary,
      light: BRAND.primaryLight,
      dark: BRAND.primaryDark,
      contrastText: '#000',
    },
    secondary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4338CA',
    },
    background: {
      default: BRAND.bg,
      paper: BRAND.surface,
    },
    text: {
      primary: BRAND.textPrimary,
      secondary: BRAND.textSecondary,
    },
    error: { main: BRAND.error },
    warning: { main: BRAND.warning },
    success: { main: BRAND.success },
    info: { main: BRAND.info },
    divider: BRAND.border,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.04em', textTransform: 'uppercase' as const },
    body2: { color: BRAND.textSecondary },
    button: { fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: `${BRAND.surfaceLight} transparent`,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: BRAND.surfaceLight, borderRadius: 3 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 20px',
          fontSize: '0.875rem',
        },
        contained: {
          '&:hover': { filter: 'brightness(1.1)' },
        },
        outlined: {
          borderColor: BRAND.border,
          '&:hover': { borderColor: BRAND.primary, backgroundColor: alpha(BRAND.primary, 0.08) },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: `1px solid ${BRAND.border}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: alpha(BRAND.surfaceLight, 0.5),
            '& fieldset': { borderColor: BRAND.border },
            '&:hover fieldset': { borderColor: BRAND.primaryDark },
            '&.Mui-focused fieldset': { borderColor: BRAND.primary },
          },
          '& .MuiInputLabel-root': { fontSize: '0.85rem' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500, fontSize: '0.75rem' },
        outlined: { borderColor: BRAND.border },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'none', borderBottom: `1px solid ${BRAND.border}` },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottomColor: BRAND.border, fontSize: '0.82rem' },
        head: { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: BRAND.textSecondary },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { '&:hover': { backgroundColor: `${alpha(BRAND.primary, 0.04)} !important` } },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16, border: `1px solid ${BRAND.border}`, backgroundImage: 'none' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { borderRadius: 10, border: `1px solid ${BRAND.border}`, backgroundImage: 'none' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, minHeight: 40, padding: '6px 16px' },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { height: 3, borderRadius: '3px 3px 0 0' },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: { '& .MuiBreadcrumbs-separator': { color: BRAND.textSecondary } },
      },
    },
  },
});

export default theme;

