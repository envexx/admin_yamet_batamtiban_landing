import { useCallback, useRef, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { DashboardStats } from '../types';

interface UseBackgroundFetchOptions {
  interval?: number; // Interval dalam ms
  enabled?: boolean;
  onDataUpdate?: (data: DashboardStats) => void;
  onError?: (error: string) => void;
}

export const useBackgroundFetch = (options: UseBackgroundFetchOptions = {}) => {
  const {
    interval = 2 * 60 * 1000, // 2 menit default
    enabled = true,
    onDataUpdate,
    onError
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFetchingRef = useRef(false);

  const fetchData = useCallback(async (period: string = 'all') => {
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      console.log('[Background Fetch] Starting background fetch for period:', period);
      
      const response = await dashboardAPI.getStats(period);
      
      if (response.status === 'success' && response.data) {
        console.log('[Background Fetch] Successfully fetched new data');
        onDataUpdate?.(response.data);
      } else {
        const errorMsg = response.message || 'Background fetch failed';
        console.error('[Background Fetch] API error:', errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Background fetch failed';
      console.error('[Background Fetch] Error:', errorMessage);
      onError?.(errorMessage);
    } finally {
      isFetchingRef.current = false;
    }
  }, [onDataUpdate, onError]);

  const startBackgroundFetch = useCallback((period: string = 'all') => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (enabled) {
      intervalRef.current = setInterval(() => {
        fetchData(period);
      }, interval);
      
      console.log('[Background Fetch] Started background fetch with interval:', interval);
    }
  }, [enabled, interval, fetchData]);

  const stopBackgroundFetch = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('[Background Fetch] Stopped background fetch');
    }
  }, []);

  const triggerFetch = useCallback((period: string = 'all') => {
    fetchData(period);
  }, [fetchData]);

  useEffect(() => {
    return () => {
      stopBackgroundFetch();
    };
  }, [stopBackgroundFetch]);

  return {
    startBackgroundFetch,
    stopBackgroundFetch,
    triggerFetch,
    isFetching: isFetchingRef.current
  };
}; 