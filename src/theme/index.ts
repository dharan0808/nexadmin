'use client';
import { createTheme } from '@mui/material/styles';

// NexAdmin Theme — Dark luxury with electric amber accents
// Inspired by trading terminals & premium SaaS dashboards
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F59E0B',       // electric amber
      light: '#FCD34D',
      dark: '#D97706',
      contrastText: '#0A0A0F',
    },
    secondary: {
      main: '#06B6D4',       // cyan accent
      light: '#67E8F9',
      dark: '#0891B2',
      contrastText: '#0A0A0F',
    },
    background: {
      default: '#0A0A0F',
      paper: '#111118',
    },
    surface: {
      main: '#16161F',
      light: '#1E1E2A',
    },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    success: { main: '#10B981' },
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      disabled: '#475569',
    },
    divider: 'rgba(241,245,249,0.06)',
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Syne", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"DM Sans", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    overline: {
      fontFamily: '"DM Mono", monospace',
      fontSize: '0.7rem',
      letterSpacing: '0.12em',
    },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #0A0A0F; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0A0A0F; }
        ::-webkit-scrollbar-thumb { background: #2A2A3A; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #F59E0B; }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.2s ease',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
          boxShadow: '0 0 24px rgba(245,158,11,0.25)',
          '&:hover': {
            boxShadow: '0 0 36px rgba(245,158,11,0.4)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#111118',
          border: '1px solid rgba(241,245,249,0.06)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          transition: 'all 0.25s ease',
          '&:hover': {
            border: '1px solid rgba(245,158,11,0.2)',
            boxShadow: '0 8px 32px rgba(245,158,11,0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255,255,255,0.03)',
            '& fieldset': { borderColor: 'rgba(241,245,249,0.12)' },
            '&:hover fieldset': { borderColor: 'rgba(245,158,11,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#F59E0B' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#F59E0B' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.7rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            background: 'rgba(245,158,11,0.06)',
            color: '#F59E0B',
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500,
            borderBottom: '1px solid rgba(245,158,11,0.15)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: 'rgba(245,158,11,0.04) !important',
          },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid rgba(241,245,249,0.04)',
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
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0D0D14',
          borderRight: '1px solid rgba(241,245,249,0.06)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10,10,15,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(241,245,249,0.06)',
          boxShadow: 'none',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          background: 'rgba(245,158,11,0.1)',
        },
        bar: {
          background: 'linear-gradient(90deg, #F59E0B, #06B6D4)',
          borderRadius: 4,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.03)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: '#16161F',
          border: '1px solid rgba(241,245,249,0.08)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#1E1E2A',
          border: '1px solid rgba(245,158,11,0.2)',
          fontSize: '0.75rem',
          fontFamily: '"DM Mono", monospace',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid rgba(245,158,11,0.3)',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            color: '#94A3B8',
            '&.Mui-selected': {
              background: 'rgba(245,158,11,0.15)',
              color: '#F59E0B',
              border: '1px solid rgba(245,158,11,0.3)',
            },
            '&:hover': {
              background: 'rgba(245,158,11,0.08)',
            },
          },
        },
      },
    },
  },
});

export default theme;
