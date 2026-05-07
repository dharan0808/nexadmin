import { create } from 'zustand';
import axios from 'axios';
import { Product, ProductsResponse, Category } from '@/types';

/**
 * CACHING STRATEGY:
 * Products are cached in a Map keyed by "limit-skip-query-category".
 * Categories list is cached separately and never re-fetched once loaded.
 * This reduces API calls significantly during normal browsing:
 * - Category filter stays instant after first load
 * - Pagination re-uses cached pages
 * - Search results cached per query string
 */

interface ProductsState {
  products: Product[];
  total: number;
  categories: Category[];
  loading: boolean;
  error: string | null;
  cache: Record<string, ProductsResponse>;
  fetchProducts: (limit: number, skip: number, query?: string, category?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  categories: [],
  loading: false,
  error: null,
  cache: {},

  fetchProducts: async (limit, skip, query = '', category = '') => {
    const cacheKey = `${limit}-${skip}-${query}-${category}`;
    const cached = get().cache[cacheKey];

    if (cached) {
      set({ products: cached.products, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      let url = '';
      if (query) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`;
      } else if (category) {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      }

      const { data } = await axios.get<ProductsResponse>(url);

      set((state) => ({
        products: data.products,
        total: data.total,
        loading: false,
        cache: { ...state.cache, [cacheKey]: data },
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch products', loading: false });
    }
  },

  fetchCategories: async () => {
    // Categories are stable — only fetch once per session
    if (get().categories.length > 0) return;
    try {
      const { data } = await axios.get<Category[]>('https://dummyjson.com/products/categories');
      set({ categories: data });
    } catch {
      // Non-critical — silently fail
    }
  },

  clearError: () => set({ error: null }),
}));
