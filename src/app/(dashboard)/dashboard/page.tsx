'use client';
import { useEffect, useState, memo } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, Skeleton,
  LinearProgress, Chip, Avatar, List, ListItem, ListItemAvatar,
  ListItemText, Divider,
} from '@mui/material';
import {
  PeopleOutlined, Inventory2Outlined, TrendingUpOutlined,
  StarOutlined, ShoppingCartOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';

const MotionCard = motion(Card);

interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
}

const StatCardComponent = memo(({ card, index }: { card: StatCard; index: number }) => (
  <MotionCard
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: '0.65rem', letterSpacing: '0.12em' }}>
            {card.label}
          </Typography>
          <Typography variant="h3" sx={{ fontSize: '2rem', fontWeight: 800, color: 'text.primary', lineHeight: 1.1, mt: 0.5 }}>
            {card.value}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.78rem' }}>
            {card.sub}
          </Typography>
        </Box>
        <Box sx={{
          width: 48, height: 48, borderRadius: 2.5,
          background: `${card.color}15`,
          border: `1px solid ${card.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 20px ${card.glow}`,
          color: card.color,
          flexShrink: 0,
        }}>
          {card.icon}
        </Box>
      </Box>
    </CardContent>
  </MotionCard>
));
StatCardComponent.displayName = 'StatCardComponent';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, productsRes] = await Promise.all([
          axios.get('https://dummyjson.com/users?limit=5&skip=0'),
          axios.get('https://dummyjson.com/products?limit=5&skip=0'),
        ]);
        setStats({
          totalUsers: usersRes.data.total,
          totalProducts: productsRes.data.total,
          avgRating: (productsRes.data.products.reduce((a: number, p: any) => a + p.rating, 0) / 5).toFixed(1),
          totalValue: productsRes.data.products.reduce((a: number, p: any) => a + p.price, 0).toFixed(0),
        });
        setRecentUsers(usersRes.data.users);
        setTopProducts(productsRes.data.products);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards: StatCard[] = stats ? [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString(), sub: 'Registered accounts', icon: <PeopleOutlined />, color: '#F59E0B', glow: 'rgba(245,158,11,0.12)' },
    { label: 'Total Products', value: stats.totalProducts.toLocaleString(), sub: 'Active listings', icon: <Inventory2Outlined />, color: '#06B6D4', glow: 'rgba(6,182,212,0.12)' },
    { label: 'Avg Rating', value: stats.avgRating, sub: 'Across all products', icon: <StarOutlined />, color: '#10B981', glow: 'rgba(16,185,129,0.12)' },
    { label: 'Portfolio Value', value: `$${Number(stats.totalValue).toLocaleString()}`, sub: 'Sample selection', icon: <TrendingUpOutlined />, color: '#8B5CF6', glow: 'rgba(139,92,246,0.12)' },
  ] : [];

  return (
    <Box>
      {/* Page header */}
      <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.15em', fontSize: '0.7rem' }}>
            OVERVIEW
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Welcome back — here's what's happening today.
          </Typography>
        </Box>
      </motion.div>

      {/* Stat cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {loading
          ? Array(4).fill(0).map((_, i) => (
            <Grid item xs={12} sm={6} lg={3} key={i}>
              <Card><CardContent sx={{ p: 3 }}><Skeleton height={80} /></CardContent></Card>
            </Grid>
          ))
          : statCards.map((card, i) => (
            <Grid item xs={12} sm={6} lg={3} key={card.label}>
              <StatCardComponent card={card} index={i} />
            </Grid>
          ))
        }
      </Grid>

      {/* Recent activity panels */}
      <Grid container spacing={2.5}>
        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Recent Users</Typography>
                <Chip
                  label="VIEW ALL" size="small"
                  component={Link} href="/users" clickable
                  sx={{ background: 'rgba(245,158,11,0.1)', color: 'primary.main', border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.62rem', fontFamily: '"DM Mono"', letterSpacing: '0.06em' }}
                />
              </Box>
              {loading
                ? Array(4).fill(0).map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 1, borderRadius: 2 }} />)
                : (
                  <List disablePadding>
                    {recentUsers.map((user, i) => (
                      <Box key={user.id}>
                        <ListItem
                          disablePadding
                          component={Link} href={`/users/${user.id}`}
                          sx={{
                            py: 1, px: 1.5, borderRadius: 2, display: 'flex',
                            transition: 'background 0.2s',
                            '&:hover': { background: 'rgba(245,158,11,0.04)' },
                            textDecoration: 'none',
                          }}
                        >
                          <ListItemAvatar sx={{ minWidth: 44 }}>
                            <Avatar src={user.image} sx={{ width: 32, height: 32 }}>
                              {user.firstName[0]}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${user.firstName} ${user.lastName}`}
                            secondary={user.email}
                            primaryTypographyProps={{ fontSize: '0.83rem', fontWeight: 500 }}
                            secondaryTypographyProps={{ fontSize: '0.72rem', color: 'text.disabled', fontFamily: '"DM Mono"' }}
                          />
                          <Chip
                            label={user.gender} size="small"
                            sx={{ fontSize: '0.62rem', background: user.gender === 'female' ? 'rgba(6,182,212,0.1)' : 'rgba(245,158,11,0.1)', color: user.gender === 'female' ? 'secondary.main' : 'primary.main', border: `1px solid ${user.gender === 'female' ? 'rgba(6,182,212,0.2)' : 'rgba(245,158,11,0.2)'}` }}
                          />
                        </ListItem>
                        {i < recentUsers.length - 1 && <Divider sx={{ my: 0.5, borderColor: 'divider' }} />}
                      </Box>
                    ))}
                  </List>
                )}
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={6}>
          <MotionCard
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5 }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>Top Products</Typography>
                <Chip
                  label="VIEW ALL" size="small"
                  component={Link} href="/products" clickable
                  sx={{ background: 'rgba(6,182,212,0.1)', color: 'secondary.main', border: '1px solid rgba(6,182,212,0.2)', fontSize: '0.62rem', fontFamily: '"DM Mono"', letterSpacing: '0.06em' }}
                />
              </Box>
              {loading
                ? Array(4).fill(0).map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 1, borderRadius: 2 }} />)
                : topProducts.map((p, i) => (
                  <Box key={p.id}>
                    <Box
                      component={Link} href={`/products/${p.id}`}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        py: 1, px: 1.5, borderRadius: 2,
                        textDecoration: 'none', transition: 'background 0.2s',
                        '&:hover': { background: 'rgba(6,182,212,0.04)' },
                      }}
                    >
                      <Box
                        component="img" src={p.thumbnail} alt={p.title}
                        sx={{ width: 36, height: 36, borderRadius: 1.5, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.06)' }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontSize: '0.83rem', fontWeight: 500, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography sx={{ fontSize: '0.7rem', color: 'primary.main', fontFamily: '"DM Mono"', fontWeight: 600 }}>
                            ${p.price}
                          </Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.disabled' }}>·</Typography>
                          <StarOutlined sx={{ fontSize: 11, color: '#F59E0B' }} />
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: '"DM Mono"' }}>
                            {p.rating}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <LinearProgress
                          variant="determinate" value={(p.rating / 5) * 100}
                          sx={{ width: 60, height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </Box>
                    {i < topProducts.length - 1 && <Divider sx={{ my: 0.5, borderColor: 'divider' }} />}
                  </Box>
                ))}
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Box>
  );
}
