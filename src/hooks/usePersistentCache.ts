import { useState, useEffect, useCallback } from 'react';
import { DashboardStats } from '../types';

interface CacheEntry {
  data: DashboardStats;
  timestamp: number;
  period: string;
}

interface UsePersistentCacheOptions {
  cacheKey?: string;
  maxAge?: number; // dalam milliseconds
  maxSize?: number; // jumlah maksimal cache entries
}

export const usePersistentCache = (options: UsePersistentCacheOptions = {}) => {
  const {
    cacheKey = 'dashboard_cache',
    maxAge = 5 * 60 * 1000, // 5 menit
    maxSize = 10 // maksimal 10 cache entries
  } = options;

  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());

  // Load cache from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const cacheMap = new Map(Object.entries(parsed));
        
        // Clean expired entries
        const now = Date.now();
        const validEntries = new Map();
        
        for (const [key, entry] of cacheMap) {
          const cacheEntry = entry as CacheEntry;
          if (now - cacheEntry.timestamp < maxAge) {
            validEntries.set(key, cacheEntry);
          }
        }
        
        setCache(validEntries);
        console.log('[Persistent Cache] Loaded from localStorage:', validEntries.size, 'entries');
      }
    } catch (error) {
      console.error('[Persistent Cache] Error loading from localStorage:', error);
      // Clear corrupted cache
      localStorage.removeItem(cacheKey);
    }
  }, [cacheKey, maxAge]);

  // Save cache to localStorage when it changes
  useEffect(() => {
    try {
      const cacheObject = Object.fromEntries(cache);
      localStorage.setItem(cacheKey, JSON.stringify(cacheObject));
      console.log('[Persistent Cache] Saved to localStorage:', cache.size, 'entries');
    } catch (error) {
      console.error('[Persistent Cache] Error saving to localStorage:', error);
    }
  }, [cache, cacheKey]);

  const getCacheKey = useCallback((period: string) => {
    return `dashboard_${period}`;
  }, []);

  const get = useCallback((period: string): DashboardStats | null => {
    const key = getCacheKey(period);
    const entry = cache.get(key);
    
    if (!entry) {
      console.log('[Persistent Cache] Cache miss for period:', period);
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > maxAge) {
      console.log('[Persistent Cache] Cache expired for period:', period);
      cache.delete(key);
      setCache(new Map(cache));
      return null;
    }

    console.log('[Persistent Cache] Cache hit for period:', period);
    return entry.data;
  }, [cache, maxAge, getCacheKey]);

  const set = useCallback((period: string, data: DashboardStats) => {
    const key = getCacheKey(period);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      period
    };

    const newCache = new Map(cache);
    
    // Remove oldest entries if cache is full
    if (newCache.size >= maxSize) {
      const entries = Array.from(newCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      // Remove oldest entries
      const toRemove = entries.slice(0, entries.length - maxSize + 1);
      toRemove.forEach(([key]) => newCache.delete(key));
      
      console.log('[Persistent Cache] Removed', toRemove.length, 'old entries');
    }

    newCache.set(key, entry);
    setCache(newCache);
    
    console.log('[Persistent Cache] Cached data for period:', period);
  }, [cache, maxSize, getCacheKey]);

  const clear = useCallback(() => {
    setCache(new Map());
    localStorage.removeItem(cacheKey);
    console.log('[Persistent Cache] Cache cleared');
  }, [cacheKey]);

  const clearExpired = useCallback(() => {
    const now = Date.now();
    const newCache = new Map();
    
    for (const [key, entry] of cache) {
      if (now - entry.timestamp < maxAge) {
        newCache.set(key, entry);
      }
    }
    
    if (newCache.size !== cache.size) {
      setCache(newCache);
      console.log('[Persistent Cache] Cleared', cache.size - newCache.size, 'expired entries');
    }
  }, [cache, maxAge]);

  const getStats = useCallback(() => {
    const now = Date.now();
    const stats = {
      totalEntries: cache.size,
      expiredEntries: 0,
      validEntries: 0,
      oldestEntry: null as number | null,
      newestEntry: null as number | null
    };

    for (const entry of cache.values()) {
      if (now - entry.timestamp > maxAge) {
        stats.expiredEntries++;
      } else {
        stats.validEntries++;
        if (!stats.oldestEntry || entry.timestamp < stats.oldestEntry) {
          stats.oldestEntry = entry.timestamp;
        }
        if (!stats.newestEntry || entry.timestamp > stats.newestEntry) {
          stats.newestEntry = entry.timestamp;
        }
      }
    }

    return stats;
  }, [cache, maxAge]);

  return {
    get,
    set,
    clear,
    clearExpired,
    getStats,
    cache
  };
}; 