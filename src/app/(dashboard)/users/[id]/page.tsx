'use client';
import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Avatar, Chip, Grid,
  IconButton, Skeleton, Divider, Button, Tooltip,
} from '@mui/material';
import {
  ArrowBackOutlined, EmailOutlined, PhoneOutlined, BusinessOutlined,
  LocationOnOutlined, CakeOutlined, SchoolOutlined, AccountBalanceOutlined,
  PersonOutlined, FavoriteOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { User } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.5 }}>
    <Box sx={{ color: 'primary.main', mt: 0.2, flexShrink: 0 }}>{icon}</Box>
    <Box>
      <Typography variant="overline" sx={{ fontSize: '0.6rem', color: 'text.disabled', letterSpacing: '0.1em', lineHeight: 1 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: 'text.primary', mt: 0.3 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const InfoCard = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>{title}</Typography>
      </Box>
      <Divider sx={{ mb: 2, borderColor: 'divider' }} />
      {children}
    </CardContent>
  </Card>
);

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get<User>(`https://dummyjson.com/users/${params.id}`)
      .then((r) => setUser(r.data))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <Box>
        <Skeleton width={120} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={2.5}>
          {Array(6).fill(0).map((_, i) => (
            <Grid item xs={12} md={4} key={i}><Skeleton height={200} sx={{ borderRadius: 3 }} /></Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" sx={{ color: 'text.secondary' }}>User not found</Typography>
        <Button component={Link} href="/users" startIcon={<ArrowBackOutlined />} sx={{ mt: 2 }}>
          Back to Users
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Back button */}
      <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
        <Button
          startIcon={<ArrowBackOutlined />}
          onClick={() => router.back()}
          sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          Back to Users
        </Button>
      </motion.div>

      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{ mb: 3, overflow: 'hidden', position: 'relative' }}>
          {/* Gradient banner */}
          <Box sx={{
            height: 100,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(6,182,212,0.08) 100%)',
            borderBottom: '1px solid rgba(245,158,11,0.1)',
            position: 'relative',
          }}>
            <Box sx={{
              position: 'absolute', inset: 0, opacity: 0.04,
              backgroundImage: 'linear-gradient(45deg, #F59E0B 25%, transparent 25%), linear-gradient(-45deg, #F59E0B 25%, transparent 25%)',
              backgroundSize: '20px 20px',
            }} />
          </Box>

          <CardContent sx={{ pt: 0, pb: 3, px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, mt: -5, flexWrap: 'wrap' }}>
              <Avatar
                src={user.image}
                sx={{
                  width: 80, height: 80, fontSize: '1.8rem',
                  border: '3px solid rgba(245,158,11,0.4)',
                  boxShadow: '0 0 24px rgba(245,158,11,0.2)',
                  flexShrink: 0,
                }}
              >
                {user.firstName[0]}
              </Avatar>
              <Box sx={{ flex: 1, pb: 1, minWidth: 200 }}>
                <Typography variant="h4" sx={{ fontSize: { xs: '1.4rem', md: '1.7rem' }, lineHeight: 1.2 }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontFamily: '"DM Mono"', mt: 0.3 }}>
                  @{user.username}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pb: 1 }}>
                <Chip label={user.role} size="small"
                  sx={{ background: 'rgba(245,158,11,0.1)', color: 'primary.main', border: '1px solid rgba(245,158,11,0.25)', textTransform: 'capitalize' }}
                />
                <Chip label={user.gender} size="small"
                  sx={{ background: user.gender === 'female' ? 'rgba(6,182,212,0.1)' : 'rgba(139,92,246,0.1)', color: user.gender === 'female' ? 'secondary.main' : '#8B5CF6', border: `1px solid ${user.gender === 'female' ? 'rgba(6,182,212,0.25)' : 'rgba(139,92,246,0.25)'}`, textTransform: 'capitalize' }}
                />
                <Chip label={user.bloodGroup} size="small"
                  sx={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)', fontFamily: '"DM Mono"' }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail grid */}
      <Grid container spacing={2.5}>
        {/* Contact */}
        <Grid item xs={12} md={6} lg={4}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
            <InfoCard title="Contact" icon={<PersonOutlined sx={{ fontSize: 20 }} />}>
              <InfoRow icon={<EmailOutlined sx={{ fontSize: 18 }} />} label="EMAIL" value={user.email} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<PhoneOutlined sx={{ fontSize: 18 }} />} label="PHONE" value={user.phone} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<CakeOutlined sx={{ fontSize: 18 }} />} label="BIRTH DATE" value={user.birthDate} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<FavoriteOutlined sx={{ fontSize: 18 }} />} label="BLOOD GROUP" value={user.bloodGroup} />
            </InfoCard>
          </motion.div>
        </Grid>

        {/* Address */}
        <Grid item xs={12} md={6} lg={4}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
            <InfoCard title="Location" icon={<LocationOnOutlined sx={{ fontSize: 20 }} />}>
              <InfoRow icon={<LocationOnOutlined sx={{ fontSize: 18 }} />} label="ADDRESS" value={user.address.address} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<LocationOnOutlined sx={{ fontSize: 18 }} />} label="CITY" value={`${user.address.city}, ${user.address.state}`} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<LocationOnOutlined sx={{ fontSize: 18 }} />} label="COUNTRY" value={user.address.country} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<LocationOnOutlined sx={{ fontSize: 18 }} />} label="POSTAL CODE" value={user.address.postalCode} />
            </InfoCard>
          </motion.div>
        </Grid>

        {/* Company */}
        <Grid item xs={12} md={6} lg={4}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
            <InfoCard title="Employment" icon={<BusinessOutlined sx={{ fontSize: 20 }} />}>
              <InfoRow icon={<BusinessOutlined sx={{ fontSize: 18 }} />} label="COMPANY" value={user.company.name} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<BusinessOutlined sx={{ fontSize: 18 }} />} label="DEPARTMENT" value={user.company.department} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<BusinessOutlined sx={{ fontSize: 18 }} />} label="TITLE" value={user.company.title} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<SchoolOutlined sx={{ fontSize: 18 }} />} label="UNIVERSITY" value={user.university} />
            </InfoCard>
          </motion.div>
        </Grid>

        {/* Physical */}
        <Grid item xs={12} md={6} lg={4}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
            <InfoCard title="Physical Info" icon={<PersonOutlined sx={{ fontSize: 20 }} />}>
              <Grid container spacing={1.5} sx={{ mt: 0 }}>
                {[
                  { label: 'HEIGHT', value: `${user.height} cm` },
                  { label: 'WEIGHT', value: `${user.weight} kg` },
                  { label: 'EYE COLOR', value: user.eyeColor },
                  { label: 'HAIR', value: `${user.hair.color} ${user.hair.type}` },
                  { label: 'AGE', value: String(user.age) },
                ].map((item) => (
                  <Grid item xs={6} key={item.label}>
                    <Box sx={{ p: 1.5, background: 'rgba(255,255,255,0.02)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.04)' }}>
                      <Typography variant="overline" sx={{ fontSize: '0.6rem', color: 'text.disabled', letterSpacing: '0.1em' }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', mt: 0.3, textTransform: 'capitalize' }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </InfoCard>
          </motion.div>
        </Grid>

        {/* Bank */}
        <Grid item xs={12} md={6} lg={4}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
            <InfoCard title="Banking" icon={<AccountBalanceOutlined sx={{ fontSize: 20 }} />}>
              <InfoRow icon={<AccountBalanceOutlined sx={{ fontSize: 18 }} />} label="CARD TYPE" value={user.bank.cardType} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<AccountBalanceOutlined sx={{ fontSize: 18 }} />} label="CARD NUMBER" value={`•••• •••• •••• ${user.bank.cardNumber.slice(-4)}`} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<AccountBalanceOutlined sx={{ fontSize: 18 }} />} label="EXPIRES" value={user.bank.cardExpire} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<AccountBalanceOutlined sx={{ fontSize: 18 }} />} label="CURRENCY" value={user.bank.currency} />
            </InfoCard>
          </motion.div>
        </Grid>

        {/* Crypto */}
        <Grid item xs={12} md={6} lg={4}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }}>
            <InfoCard title="Crypto" icon={<TrendingUp sx={{ fontSize: 20 }} />}>
              <InfoRow icon={<TrendingUp sx={{ fontSize: 18 }} />} label="COIN" value={user.crypto.coin} />
              <Divider sx={{ borderColor: 'divider' }} />
              <InfoRow icon={<TrendingUp sx={{ fontSize: 18 }} />} label="NETWORK" value={user.crypto.network} />
              <Divider sx={{ borderColor: 'divider' }} />
              <Box sx={{ mt: 1.5, p: 1.5, background: 'rgba(245,158,11,0.04)', borderRadius: 2, border: '1px solid rgba(245,158,11,0.1)' }}>
                <Typography variant="overline" sx={{ fontSize: '0.6rem', color: 'text.disabled', letterSpacing: '0.1em' }}>
                  WALLET
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'primary.main', fontFamily: '"DM Mono"', mt: 0.3, wordBreak: 'break-all' }}>
                  {user.crypto.wallet}
                </Typography>
              </Box>
            </InfoCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}

// Fix missing import
function TrendingUp({ sx }: { sx?: any }) {
  return (
    <svg style={{ fontSize: sx?.fontSize || 20, ...sx }} viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
    </svg>
  );
}
