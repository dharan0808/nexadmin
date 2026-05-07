'use client';
import { useEffect, useState, useCallback, memo } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Chip, Pagination, IconButton, Skeleton, Tooltip,
} from '@mui/material';
import { SearchOutlined, ArrowForwardOutlined, PeopleOutlined, ClearOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useUsersStore } from '@/store/usersStore';
import { User } from '@/types';
import Link from 'next/link';
import { useDebounce } from '@/lib/useDebounce';

const LIMIT = 10;

const UserRow = memo(({ user, index }: { user: User; index: number }) => (
  <motion.tr
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.04, duration: 0.35 }}
    style={{ display: 'contents' }}
  >
    <TableRow
      component={Link}
      href={`/users/${user.id}`}
      sx={{
        cursor: 'pointer', textDecoration: 'none',
        display: 'table-row',
        '&:hover td': { background: 'rgba(245,158,11,0.04)' },
      }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={user.image} sx={{ width: 36, height: 36, fontSize: '0.8rem' }}>
            {user.firstName[0]}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: 'text.primary' }}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled', fontFamily: '"DM Mono"' }}>
              @{user.username}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontFamily: '"DM Mono"' }}>
          {user.email}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip
          label={user.gender}
          size="small"
          sx={{
            fontSize: '0.65rem',
            background: user.gender === 'female' ? 'rgba(6,182,212,0.1)' : 'rgba(245,158,11,0.1)',
            color: user.gender === 'female' ? 'secondary.main' : 'primary.main',
            border: `1px solid ${user.gender === 'female' ? 'rgba(6,182,212,0.2)' : 'rgba(245,158,11,0.2)'}`,
          }}
        />
      </TableCell>
      <TableCell>
        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontFamily: '"DM Mono"' }}>
          {user.phone}
        </Typography>
      </TableCell>
      <TableCell>
        <Box>
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, color: 'text.primary' }}>
            {user.company.name}
          </Typography>
          <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled' }}>
            {user.company.title}
          </Typography>
        </Box>
      </TableCell>
      <TableCell align="right">
        <Tooltip title="View Profile">
          <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main' } }}>
            <ArrowForwardOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  </motion.tr>
));
UserRow.displayName = 'UserRow';

export default function UsersPage() {
  const { users, total, loading, fetchUsers } = useUsersStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  // Re-fetch when page or debounced search changes
  useEffect(() => {
    const skip = (page - 1) * LIMIT;
    fetchUsers(LIMIT, skip, debouncedSearch);
  }, [page, debouncedSearch, fetchUsers]);

  // Reset page on search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const totalPages = Math.ceil(total / LIMIT);

  const handleSearchClear = useCallback(() => setSearch(''), []);

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.15em', fontSize: '0.7rem' }}>
              MANAGEMENT
            </Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 0.5 }}>
              Users
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {total.toLocaleString()} registered accounts
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 2, py: 1, borderRadius: 2,
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
          }}>
            <PeopleOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'primary.main', fontFamily: '"DM Mono"' }}>
              {total}
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
        <Card sx={{ mb: 2.5 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <TextField
              fullWidth
              placeholder="Search users by name, email, username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleSearchClear}>
                      <ClearOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading
                  ? Array(LIMIT).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      {Array(6).fill(0).map((_, j) => (
                        <TableCell key={j}><Skeleton height={36} /></TableCell>
                      ))}
                    </TableRow>
                  ))
                  : users.length === 0
                    ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <Typography sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
                            No users found for "{search}"
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                    : users.map((user, i) => <UserRow key={user.id} user={user} index={i} />)
                }
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, v) => setPage(v)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Card>
      </motion.div>
    </Box>
  );
}
