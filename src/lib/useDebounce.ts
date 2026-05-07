import { useState, useEffect } from 'react';

/**
 * Debounce hook — delays a value update by `delay` ms.
 * Used to prevent excessive API calls on every keystroke during search.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
