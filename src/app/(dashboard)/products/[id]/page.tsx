'use client';
import { useEffect, useState, memo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Grid,
  Rating, Divider, Avatar, Skeleton, LinearProgress, Tooltip,
  IconButton,
} from '@mui/material';
import {
  ArrowBackOutlined, StarOutlined, LocalShippingOutlined,
  VerifiedOutlined, InventoryOutlined, ChevronLeftOutlined,
  ChevronRightOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';

const ReviewCard = memo(({ review }: { review: any }) => (
  <Card sx={{ mb: 1.5 }}>
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
        <Avatar sx={{ width: 32, height: 32, background: 'rgba(245,158,11,0.15)', color: 'primary.main', fontSize: '0.8rem', border: '1px solid rgba(245,158,11,0.2)' }}>
          {review.reviewerName[0]}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{review.reviewerName}</Typography>
          <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled', fontFamily: '"DM Mono"' }}>
            {new Date(review.date).toLocaleDateString()}
          </Typography>
        </Box>
        <Rating value={review.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
      </Box>
      <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', lineHeight: 1.6 }}>
        {review.comment}
      </Typography>
    </CardContent>
  </Card>
));
ReviewCard.displayName = 'ReviewCard';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const router = useRouter();

  useEffect(() => {
    axios.get<Product>(`https://dummyjson.com/products/${params.id}`)
      .then((r) => { setProduct(r.data); setActiveImg(0); })
      .finally(() => setLoading(false));
  }, [params.id]);

  const nextImg = () => product && setActiveImg((i) => (i + 1) % product.images.length);
  const prevImg = () => product && setActiveImg((i) => (i - 1 + product.images.length) % product.images.length);

  if (loading) {
    return (
      <Box>
        <Skeleton width={140} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} /></Grid>
          <Grid item xs={12} md={6}><Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} /></Grid>
        </Grid>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" sx={{ color: 'text.secondary' }}>Product not found</Typography>
        <Button onClick={() => router.back()} startIcon={<ArrowBackOutlined />} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const discountedOriginal = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <Box>
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
        <Button
          startIcon={<ArrowBackOutlined />}
          onClick={() => router.back()}
          sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          Back to Products
        </Button>
      </motion.div>

      <Grid container spacing={3}>
        {/* Left: Image gallery */}
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                {/* Main image */}
                <Box sx={{ position: 'relative', mb: 1.5, borderRadius: 2, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeImg}
                      src={product.images[activeImg]}
                      alt={`${product.title} ${activeImg + 1}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: 16 }}
                    />
                  </AnimatePresence>
                  {product.images.length > 1 && (
                    <>
                      <IconButton
                        onClick={prevImg}
                        sx={{ position: 'absolute', left: 8, background: 'rgba(10,10,15,0.8)', color: 'text.primary', '&:hover': { background: 'rgba(245,158,11,0.2)' }, backdropFilter: 'blur(8px)' }}
                        size="small"
                      >
                        <ChevronLeftOutlined />
                      </IconButton>
                      <IconButton
                        onClick={nextImg}
                        sx={{ position: 'absolute', right: 8, background: 'rgba(10,10,15,0.8)', color: 'text.primary', '&:hover': { background: 'rgba(245,158,11,0.2)' }, backdropFilter: 'blur(8px)' }}
                        size="small"
                      >
                        <ChevronRightOutlined />
                      </IconButton>
                    </>
                  )}
                </Box>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                    {product.images.map((img, i) => (
                      <Box
                        key={i}
                        onClick={() => setActiveImg(i)}
                        sx={{
                          flexShrink: 0, width: 60, height: 60, borderRadius: 1.5,
                          overflow: 'hidden', cursor: 'pointer',
                          border: activeImg === i ? '2px solid #F59E0B' : '2px solid transparent',
                          transition: 'border-color 0.2s',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <Box
                          component="img" src={img} alt={`thumb-${i}`}
                          sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 0.5 }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Right: Info */}
        <Grid item xs={12} md={6}>
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Title card */}
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip label={product.category} size="small"
                      sx={{ background: 'rgba(6,182,212,0.1)', color: 'secondary.main', border: '1px solid rgba(6,182,212,0.2)', fontSize: '0.68rem', textTransform: 'capitalize' }}
                    />
                    {product.tags?.map((tag) => (
                      <Chip key={tag} label={`#${tag}`} size="small"
                        sx={{ background: 'rgba(255,255,255,0.03)', color: 'text.secondary', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.65rem', fontFamily: '"DM Mono"' }}
                      />
                    ))}
                  </Box>
                  <Typography variant="h4" sx={{ fontSize: { xs: '1.3rem', md: '1.6rem' }, lineHeight: 1.3, mb: 1 }}>
                    {product.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', mb: 0.5 }}>
                    {product.brand && `by ${product.brand}`}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={product.rating} precision={0.1} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
                    <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontFamily: '"DM Mono"' }}>
                      {product.rating} · {product.reviews?.length || 0} reviews
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2 }}>
                    <Typography variant="h3" sx={{ fontSize: '2rem', fontWeight: 800, color: 'primary.main' }}>
                      ${product.price}
                    </Typography>
                    {product.discountPercentage > 0 && (
                      <>
                        <Typography sx={{ fontSize: '1rem', color: 'text.disabled', textDecoration: 'line-through', fontFamily: '"DM Mono"' }}>
                          ${discountedOriginal}
                        </Typography>
                        <Chip
                          label={`${Math.round(product.discountPercentage)}% OFF`}
                          size="small"
                          sx={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', fontFamily: '"DM Mono"', fontSize: '0.65rem' }}
                        />
                      </>
                    )}
                  </Box>

                  <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', lineHeight: 1.7, mb: 2 }}>
                    {product.description}
                  </Typography>

                  {/* Stock */}
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled', fontFamily: '"DM Mono"', letterSpacing: '0.08em' }}>
                        STOCK LEVEL
                      </Typography>
                      <Typography sx={{ fontSize: '0.72rem', color: product.stock > 50 ? '#10B981' : product.stock > 10 ? '#F59E0B' : '#EF4444', fontFamily: '"DM Mono"', fontWeight: 600 }}>
                        {product.availabilityStatus} · {product.stock} units
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((product.stock / 100) * 100, 100)}
                      sx={{
                        height: 6, borderRadius: 3,
                        background: 'rgba(255,255,255,0.05)',
                        '& .MuiLinearProgress-bar': {
                          background: product.stock > 50 ? 'linear-gradient(90deg, #10B981, #06B6D4)' : product.stock > 10 ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : '#EF4444',
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Logistics */}
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="overline" sx={{ fontSize: '0.65rem', color: 'text.disabled', letterSpacing: '0.12em', mb: 1.5, display: 'block' }}>
                    LOGISTICS & POLICY
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[
                      { icon: <LocalShippingOutlined sx={{ fontSize: 16 }} />, label: 'Shipping', value: product.shippingInformation },
                      { icon: <VerifiedOutlined sx={{ fontSize: 16 }} />, label: 'Warranty', value: product.warrantyInformation },
                      { icon: <InventoryOutlined sx={{ fontSize: 16 }} />, label: 'Returns', value: product.returnPolicy },
                    ].map((item) => (
                      <Box key={item.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box sx={{ color: 'primary.main', mt: 0.1 }}>{item.icon}</Box>
                        <Box>
                          <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled', fontFamily: '"DM Mono"', letterSpacing: '0.06em' }}>
                            {item.label.toUpperCase()}
                          </Typography>
                          <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Specs */}
              {(product.weight || product.dimensions) && (
                <Card>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="overline" sx={{ fontSize: '0.65rem', color: 'text.disabled', letterSpacing: '0.12em', mb: 1.5, display: 'block' }}>
                      SPECIFICATIONS
                    </Typography>
                    <Grid container spacing={1}>
                      {[
                        { label: 'WEIGHT', value: `${product.weight} kg` },
                        { label: 'WIDTH', value: `${product.dimensions?.width} cm` },
                        { label: 'HEIGHT', value: `${product.dimensions?.height} cm` },
                        { label: 'DEPTH', value: `${product.dimensions?.depth} cm` },
                        { label: 'MIN ORDER', value: `${product.minimumOrderQuantity} units` },
                        { label: 'BARCODE', value: product.meta?.barcode },
                      ].filter(s => s.value && s.value !== 'undefined cm').map((spec) => (
                        <Grid item xs={6} key={spec.label}>
                          <Box sx={{ p: 1.5, background: 'rgba(255,255,255,0.02)', borderRadius: 1.5, border: '1px solid rgba(255,255,255,0.04)' }}>
                            <Typography variant="overline" sx={{ fontSize: '0.58rem', color: 'text.disabled', letterSpacing: '0.08em', display: 'block' }}>
                              {spec.label}
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary', fontFamily: '"DM Mono"', mt: 0.3 }}>
                              {spec.value}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              )}
            </Box>
          </motion.div>
        </Grid>
      </Grid>

      {/* Reviews */}
      {product.reviews && product.reviews.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontSize: '1.2rem' }}>
              Customer Reviews
              <Chip label={product.reviews.length} size="small" sx={{ ml: 1.5, background: 'rgba(245,158,11,0.1)', color: 'primary.main', fontFamily: '"DM Mono"' }} />
            </Typography>
            <Grid container spacing={2}>
              {product.reviews.map((review, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <ReviewCard review={review} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}
