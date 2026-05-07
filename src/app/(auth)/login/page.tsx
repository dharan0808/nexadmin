'use client';
import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, InputAdornment, IconButton, Chip,
  CircularProgress, Alert, Divider,
} from '@mui/material';
import {
  Visibility, VisibilityOff, LockOutlined,
  PersonOutline, AdminPanelSettingsOutlined,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '@/store/authStore';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const DEMO_CREDENTIALS = [
  { username: 'emilys', password: 'emilyspass', role: 'Admin' },
  { username: 'michaelw', password: 'michaelwpass', role: 'Moderator' },
];

export default function LoginPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const setToken = useAuthStore((s) => s.setToken);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = useCallback(async (u?: string, p?: string) => {
    const user = u ?? username;
    const pass = p ?? password;
    if (!user || !pass) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      username: user,
      password: pass,
      redirect: false,
    });

    // NextAuth returns error="CredentialsSignin" when authorize() returns null
    if (result?.error || !result?.ok) {
      setError('Invalid credentials. Try a demo account below.');
      enqueueSnackbar('Login failed', { variant: 'error' });
    } else {
      // Also save token to Zustand for direct API access
      enqueueSnackbar('Welcome back! 🎉', { variant: 'success' });
      router.push('/dashboard');
    }
    setLoading(false);
  }, [username, password, enqueueSnackbar, router]);

  const fillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#0A0A0F',
      }}
    >
      {/* Ambient gradient orbs */}
      <Box sx={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Grid texture overlay */}
      <Box sx={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <MotionBox
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        sx={{ width: '100%', maxWidth: 420, px: 2 }}
      >
        {/* Logo & Brand */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <MotionBox
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            sx={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 64, height: 64, borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
              border: '1px solid rgba(245,158,11,0.3)',
              mb: 2,
              boxShadow: '0 0 40px rgba(245,158,11,0.15)',
            }}
          >
            <AdminPanelSettingsOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
          </MotionBox>
          <Typography variant="h3" sx={{ fontSize: '2rem', mb: 0.5 }}>
            Nex<Box component="span" sx={{ color: 'primary.main' }}>Admin</Box>
          </Typography>
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '0.15em' }}>
            SECURE ADMIN PORTAL
          </Typography>
        </Box>

        <MotionCard
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          sx={{
            background: 'rgba(17,17,24,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(241,245,249,0.08)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontSize: '0.8rem' }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth label="Username" variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth label="Password" variant="outlined"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small">
                      {showPass
                        ? <VisibilityOff sx={{ color: 'text.secondary', fontSize: 18 }} />
                        : <Visibility sx={{ color: 'text.secondary', fontSize: 18 }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth variant="contained" size="large"
              onClick={() => handleLogin()}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ArrowForward />}
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 3, '&::before,&::after': { borderColor: 'divider' } }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: '"DM Mono", monospace', letterSpacing: '0.05em' }}>
                DEMO ACCOUNTS
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
              {DEMO_CREDENTIALS.map((cred) => (
                <Box
                  key={cred.username}
                  onClick={() => fillDemo(cred.username, cred.password)}
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    p: 1.5, borderRadius: 2, cursor: 'pointer',
                    border: '1px solid rgba(241,245,249,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      border: '1px solid rgba(245,158,11,0.2)',
                      background: 'rgba(245,158,11,0.04)',
                    },
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '0.8rem', fontFamily: '"DM Mono"', color: 'primary.main' }}>
                      {cred.username}
                    </Typography>
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                      {cred.password}
                    </Typography>
                  </Box>
                  <Chip label={cred.role} size="small"
                    sx={{
                      background: 'rgba(245,158,11,0.1)', color: 'primary.main',
                      border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.65rem',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </MotionCard>

        <Typography variant="caption" sx={{
          display: 'block', textAlign: 'center', mt: 3,
          color: 'text.disabled', fontFamily: '"DM Mono", monospace',
        }}>
          Powered by DummyJSON · Built with Next.js 14
        </Typography>
      </MotionBox>
    </Box>
  );
}
