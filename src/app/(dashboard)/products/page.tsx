'use client';
import { useEffect, useState, useCallback, memo } from 'react';
import {
  Box, Card, CardContent, CardMedia, Typography, TextField,
  InputAdornment, Grid, Chip, Pagination, IconButton, Skeleton,
  Select, MenuItem, FormControl, InputLabel, Rating, Button,
  CardActionArea,
} from '@mui/material';
import {
  SearchOutlined, ClearOutlined, Inventory2Outlined, FilterListOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useProductsStore } from '@/store/productsStore';
import { Product } from '@/types';
import Link from 'next/link';
import { useDebounce } from '@/lib/useDebounce';

const LIMIT = 12;

const ProductCard = memo(({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    style={{ height: '100%' }}
  >
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={Link}
        href={`/products/${product.id}`}
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        {/* Image */}
        <Box sx={{ position: 'relative', pt: '60%', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
          <Box
            component="img"
            src={product.thumbnail}
            alt={product.title}
            sx={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'contain', p: 2,
              transition: 'transform 0.4s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          />
          <Chip
            label={product.category}
            size="small"
            sx={{
              position: 'absolute', top: 10, left: 10,
              background: 'rgba(10,10,15,0.85)', color: 'text.secondary',
              border: '1px solid rgba(255,255,255,0.08)',
              fontSize: '0.62rem', fontFamily: '"DM Mono"', backdropFilter: 'blur(8px)',
              textTransform: 'capitalize',
            }}
          />
          {product.discountPercentage > 10 && (
            <Chip
              label={`-${Math.round(product.discountPercentage)}%`}
              size="small"
              sx={{
                position: 'absolute', top: 10, right: 10,
                background: 'rgba(239,68,68,0.85)', color: '#fff',
                fontSize: '0.62rem', fontFamily: '"DM Mono"', backdropFilter: 'blur(8px)',
              }}
            />
          )}
        </Box>

        <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.primary', lineHeight: 1.3, mb: 0.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.title}
          </Typography>
          <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', mb: 1.5, flex: 1 }}>
            {product.brand || product.category}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.5 }}>
            <Box>
              <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'primary.main', fontFamily: '"Syne"' }}>
                ${product.price}
              </Typography>
              {product.discountPercentage > 0 && (
                <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled', textDecoration: 'line-through', fontFamily: '"DM Mono"' }}>
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating value={product.rating} precision={0.1} readOnly size="small" sx={{ fontSize: '0.75rem', '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
              <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', fontFamily: '"DM Mono"' }}>
                {product.rating}
              </Typography>
            </Box>
          </Box>

          {product.stock <= 10 && (
            <Chip
              label={product.stock === 0 ? 'OUT OF STOCK' : `ONLY ${product.stock} LEFT`}
              size="small"
              sx={{
                mt: 1, fontSize: '0.58rem', fontFamily: '"DM Mono"',
                background: product.stock === 0 ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                color: product.stock === 0 ? '#EF4444' : '#F59E0B',
                border: `1px solid ${product.stock === 0 ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
              }}
            />
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  </motion.div>
));
ProductCard.displayName = 'ProductCard';

export default function ProductsPage() {
  const { products, total, categories, loading, fetchProducts, fetchCategories } = useProductsStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  useEffect(() => {
    const skip = (page - 1) * LIMIT;
    fetchProducts(LIMIT, skip, debouncedSearch, category);
  }, [page, debouncedSearch, category, fetchProducts]);

  useEffect(() => { setPage(1); }, [debouncedSearch, category]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: '0.15em', fontSize: '0.7rem' }}>
              CATALOG
            </Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, mt: 0.5 }}>
              Products
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {total.toLocaleString()} products in catalog
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 2, py: 1, borderRadius: 2,
            background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)',
          }}>
            <Inventory2Outlined sx={{ fontSize: 18, color: 'secondary.main' }} />
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'secondary.main', fontFamily: '"DM Mono"' }}>
              {total}
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                sx={{ flex: 1, minWidth: 200 }}
                placeholder="Search products..."
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
                      <IconButton size="small" onClick={() => setSearch('')}>
                        <ClearOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.slug} value={cat.slug} sx={{ textTransform: 'capitalize' }}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {(search || category) && (
                <Button
                  variant="outlined" size="small"
                  onClick={() => { setSearch(''); setCategory(''); }}
                  startIcon={<ClearOutlined />}
                  sx={{ borderColor: 'rgba(255,255,255,0.12)', color: 'text.secondary', whiteSpace: 'nowrap' }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <Grid container spacing={2.5}>
          {Array(LIMIT).fill(0).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography sx={{ color: 'text.disabled' }}>No products found</Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {products.map((product, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard product={product} index={i} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
}
