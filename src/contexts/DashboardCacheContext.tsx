import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { dashboardAPI } from '../services/api';
import { DashboardStats } from '../types';

interface DashboardCacheContextType {
  // Cache data
  cachedStats: DashboardStats | null;
  lastFetchTime: number | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getStats: (period?: string, forceRefresh?: boolean) => Promise<DashboardStats | null>;
  refreshStats: (period?: string) => Promise<void>;
  clearCache: () => void;
  
  // Cache info
  isStale: boolean;
  timeSinceLastFetch: number | null;
  
  // Event-driven methods
  triggerDataChange: () => void;
  subscribeToChanges: (callback: () => void) => () => void;
}

const DashboardCacheContext = createContext<DashboardCacheContextType | undefined>(undefined);

// Cache configuration - lebih lama untuk mengurangi request
const CACHE_DURATION = 15 * 60 * 1000; // 15 menit (lebih lama)
const STALE_THRESHOLD = 30 * 60 * 1000; // 30 menit untuk stale detection

export const DashboardCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cachedStats, setCachedStats] = useState<DashboardStats | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<string>('all');
  
  // Event-driven change detection
  const changeSubscribers = useRef<Set<() => void>>(new Set());
  const lastDataHash = useRef<string>('');
  const isBackgroundFetchingRef = useRef(false);

  // Generate hash dari data untuk detect perubahan
  const generateDataHash = useCallback((data: DashboardStats): string => {
    try {
      const keyData = {
        total_anak: data.total_anak,
        anak_aktif: data.anak_aktif,
        total_terapis: data.total_terapis,
        total_admin: data.total_admin,
        // Tambahkan field lain yang penting untuk change detection
        last_updated: new Date().toISOString().split('T')[0] // Date only
      };
      return JSON.stringify(keyData);
    } catch {
      return '';
    }
  }, []);

  // Check if cache is stale
  const isStale = useCallback(() => {
    if (!lastFetchTime) return true;
    return Date.now() - lastFetchTime > STALE_THRESHOLD;
  }, [lastFetchTime]);

  // Get time since last fetch
  const timeSinceLastFetch = lastFetchTime ? Date.now() - lastFetchTime : null;

  // Event-driven change detection
  const triggerDataChange = useCallback(() => {
    console.log('[Dashboard Cache] Data change detected, triggering refresh');
    changeSubscribers.current.forEach(callback => callback());
  }, []);

  // Subscribe to data changes
  const subscribeToChanges = useCallback((callback: () => void) => {
    changeSubscribers.current.add(callback);
    return () => {
      changeSubscribers.current.delete(callback);
    };
  }, []);

  // Smart fetch function dengan change detection
  const smartFetch = useCallback(async (period: string = 'all') => {
    if (isBackgroundFetchingRef.current) return;
    
    try {
      isBackgroundFetchingRef.current = true;
      console.log('[Dashboard Cache] Smart fetch started for period:', period);
      
      const response = await dashboardAPI.getStats(period);
      
      if (response.status === 'success' && response.data) {
        const newDataHash = generateDataHash(response.data);
        
        // Check if data actually changed
        if (newDataHash !== lastDataHash.current) {
          console.log('[Dashboard Cache] Data changed, updating cache');
          setCachedStats(response.data);
          setLastFetchTime(Date.now());
          setError(null);
          lastDataHash.current = newDataHash;
          
          // Trigger change event
          triggerDataChange();
        } else {
          console.log('[Dashboard Cache] No data changes detected, keeping existing cache');
          // Update timestamp even if no changes
          setLastFetchTime(Date.now());
        }
      }
    } catch (err) {
      console.error('[Dashboard Cache] Smart fetch failed:', err);
      // Don't set error for background fetches to avoid UI disruption
    } finally {
      isBackgroundFetchingRef.current = false;
    }
  }, [generateDataHash, triggerDataChange]);

  // Main fetch function
  const getStats = useCallback(async (period: string = 'all', forceRefresh: boolean = false): Promise<DashboardStats | null> => {
    // If we have cached data and it's not stale, return it immediately
    if (!forceRefresh && cachedStats && !isStale() && currentPeriod === period) {
      console.log('[Dashboard Cache] Returning cached data');
      return cachedStats;
    }

    // If force refresh or cache is stale, fetch new data
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPeriod(period);
      
      console.log('[Dashboard Cache] Fetching fresh data for period:', period);
      const response = await dashboardAPI.getStats(period);
      
      if (response.status === 'success' && response.data) {
        const newDataHash = generateDataHash(response.data);
        setCachedStats(response.data);
        setLastFetchTime(Date.now());
        setError(null);
        lastDataHash.current = newDataHash;
        console.log('[Dashboard Cache] Fresh data fetched successfully');
        return response.data;
      } else {
        const errorMsg = response.message || 'Gagal memuat statistik dashboard';
        setError(errorMsg);
        console.error('[Dashboard Cache] API error:', errorMsg);
        return null;
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat statistik dashboard';
      setError(errorMessage);
      console.error('[Dashboard Cache] Fetch error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [cachedStats, isStale, currentPeriod, generateDataHash]);

  // Manual refresh function
  const refreshStats = useCallback(async (period: string = 'all') => {
    await getStats(period, true);
  }, [getStats]);

  // Clear cache function
  const clearCache = useCallback(() => {
    setCachedStats(null);
    setLastFetchTime(null);
    setError(null);
    lastDataHash.current = '';
    console.log('[Dashboard Cache] Cache cleared');
  }, []);

  // Setup event listeners untuk data changes
  useEffect(() => {
    // Listen untuk window focus (user kembali ke tab)
    const handleWindowFocus = () => {
      if (isStale()) {
        console.log('[Dashboard Cache] Window focused, checking for updates');
        smartFetch(currentPeriod);
      }
    };

    // Listen untuk online/offline events
    const handleOnline = () => {
      console.log('[Dashboard Cache] Back online, checking for updates');
      smartFetch(currentPeriod);
    };

    // Listen untuk visibility change (tab visibility)
    const handleVisibilityChange = () => {
      if (!document.hidden && isStale()) {
        console.log('[Dashboard Cache] Tab visible, checking for updates');
        smartFetch(currentPeriod);
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('online', handleOnline);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('online', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [smartFetch, currentPeriod, isStale]);

  const value: DashboardCacheContextType = {
    cachedStats,
    lastFetchTime,
    isLoading,
    error,
    getStats,
    refreshStats,
    clearCache,
    isStale: isStale(),
    timeSinceLastFetch,
    triggerDataChange,
    subscribeToChanges,
  };

  return (
    <DashboardCacheContext.Provider value={value}>
      {children}
    </DashboardCacheContext.Provider>
  );
};

export const useDashboardCache = (): DashboardCacheContextType => {
  const context = useContext(DashboardCacheContext);
  if (context === undefined) {
    throw new Error('useDashboardCache must be used within a DashboardCacheProvider');
  }
  return context;
}; 