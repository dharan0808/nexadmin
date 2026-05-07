'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import theme from '@/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          style={{ fontFamily: '"DM Sans", sans-serif' }}
        >
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
