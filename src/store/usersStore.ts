import { create } from 'zustand';
import axios from 'axios';
import { User, UsersResponse } from '@/types';

/**
 * CACHING STRATEGY:
 * We store fetched users in a Map keyed by "page-search" string.
 * Before making an API call, we check the cache first.
 * This avoids repeat network requests when the user paginates
 * back and forth or types a previously-searched query.
 * Cache is held in-memory (Zustand state) for the session lifetime.
 * For persistence across page refreshes, we could use localStorage
 * via Zustand's persist middleware — opted for in-memory to avoid
 * serving stale user data across sessions.
 */

interface UsersState {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  // Cache: key = "limit-skip-query", value = UsersResponse
  cache: Record<string, UsersResponse>;
  fetchUsers: (limit: number, skip: number, query?: string) => Promise<void>;
  clearError: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  cache: {},

  fetchUsers: async (limit: number, skip: number, query = '') => {
    const cacheKey = `${limit}-${skip}-${query}`;
    const cached = get().cache[cacheKey];

    // Return cached data immediately if available (avoids re-fetch)
    if (cached) {
      set({ users: cached.users, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const url = query
        ? `https://dummyjson.com/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
        : `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;

      const { data } = await axios.get<UsersResponse>(url);

      // Store in cache
      set((state) => ({
        users: data.users,
        total: data.total,
        loading: false,
        cache: { ...state.cache, [cacheKey]: data },
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch users', loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
