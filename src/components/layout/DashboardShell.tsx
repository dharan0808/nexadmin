'use client';
import { useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItemButton,
  ListItemIcon, ListItemText, Typography, IconButton,
  Avatar, Tooltip, Divider, Badge, Collapse, useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  DashboardOutlined, PeopleOutlined, Inventory2Outlined,
  MenuOutlined, CloseOutlined, LogoutOutlined,
  AdminPanelSettingsOutlined, ChevronRightOutlined,
  NotificationsOutlined, SettingsOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
  { label: 'Users', icon: <PeopleOutlined />, path: '/users' },
  { label: 'Products', icon: <Inventory2Outlined />, path: '/products' },
];

interface Props {
  children: React.ReactNode;
  session: any;
}

export default function DashboardShell({ children, session }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: '/login' });
  }, []);

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
            border: '1px solid rgba(245,158,11,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(245,158,11,0.1)',
          }}>
            <AdminPanelSettingsOutlined sx={{ fontSize: 20, color: 'primary.main' }} />
          </Box>
          <Typography variant="h5" sx={{ fontSize: '1.25rem' }}>
            Nex<Box component="span" sx={{ color: 'primary.main' }}>Admin</Box>
          </Typography>
        </Box>
        <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: '0.65rem', letterSpacing: '0.1em', mt: 0.5, display: 'block' }}>
          MANAGEMENT CONSOLE
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'divider', mx: 2 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2, px: 1.5, overflowY: 'auto' }}>
        <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: '0.62rem', px: 1.5, letterSpacing: '0.12em' }}>
          NAVIGATION
        </Typography>
        <List sx={{ mt: 1 }} disablePadding>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
            return (
              <ListItemButton
                key={item.path}
                onClick={() => { router.push(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  position: 'relative',
                  transition: 'all 0.2s',
                  background: isActive
                    ? 'rgba(245,158,11,0.1)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(245,158,11,0.2)'
                    : '1px solid transparent',
                  '&:hover': {
                    background: isActive ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                  },
                }}
              >
                {isActive && (
                  <Box sx={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: 3, height: 20, borderRadius: '0 2px 2px 0',
                    background: '#F59E0B',
                    boxShadow: '0 0 8px rgba(245,158,11,0.6)',
                  }} />
                )}
                <ListItemIcon sx={{
                  minWidth: 36,
                  color: isActive ? 'primary.main' : 'text.secondary',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
                {isActive && (
                  <ChevronRightOutlined sx={{ fontSize: 16, color: 'primary.main', opacity: 0.6 }} />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'divider', mx: 2 }} />

      {/* User profile */}
      <Box sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          p: 1.5, borderRadius: 2,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(241,245,249,0.06)',
        }}>
          <Avatar
            src={session?.user?.image}
            sx={{ width: 36, height: 36, border: '2px solid rgba(245,158,11,0.3)' }}
          >
            {session?.user?.firstName?.[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session?.user?.firstName} {session?.user?.lastName}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: '"DM Mono", monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session?.user?.username}
            </Typography>
          </Box>
          <Tooltip title="Sign Out">
            <IconButton onClick={handleSignOut} size="small"
              sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' }, transition: 'color 0.2s' }}>
              <LogoutOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'background.default' }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
          }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ gap: 2 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: 'text.primary' }}>
                <MenuOutlined />
              </IconButton>
            )}
            <Box sx={{ flex: 1 }} />
            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'text.secondary' }}>
                <Badge badgeContent={3} color="primary">
                  <NotificationsOutlined />
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar
              src={session?.user?.image}
              sx={{ width: 32, height: 32, border: '2px solid rgba(245,158,11,0.3)', cursor: 'pointer' }}
            />
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box component="main" sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
