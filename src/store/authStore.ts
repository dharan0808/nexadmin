import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * WHY ZUSTAND?
 * - Zero boilerplate vs Redux (no actions, reducers, dispatch)
 * - Built-in async actions — just use async functions in the store
 * - Tiny footprint (~1KB gzipped) perfect for small-medium apps
 * - Built-in persist middleware for localStorage caching
 * - Works seamlessly with Next.js SSR via getState()
 * - No Provider wrapping needed (uses module-level singleton)
 */

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token: string) => set({ token, isAuthenticated: true }),
      clearToken: () => set({ token: null, isAuthenticated: false }),
    }),
    {
      name: 'nexadmin-auth',
      // Only persist token — session is managed by NextAuth
    }
  )
);
