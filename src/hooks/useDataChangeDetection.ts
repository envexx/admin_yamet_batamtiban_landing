import { useCallback, useRef, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { DashboardStats } from '../types';

interface UseDataChangeDetectionOptions {
  period?: string;
  checkInterval?: number; // Interval untuk check perubahan (dalam ms)
  onDataChange?: (newData: DashboardStats) => void;
  onNoChange?: () => void;
  enabled?: boolean;
}

export const useDataChangeDetection = (options: UseDataChangeDetectionOptions = {}) => {
  const {
    period = 'all',
    checkInterval = 5 * 60 * 1000, // 5 menit
    onDataChange,
    onNoChange,
    enabled = true
  } = options;

  const lastDataHash = useRef<string>('');
  const isCheckingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate hash dari data untuk detect perubahan
  const generateDataHash = useCallback((data: DashboardStats): string => {
    try {
      const keyData = {
        total_anak: data.total_anak,
        anak_aktif: data.anak_aktif,
        total_terapis: data.total_terapis,
        total_admin: data.total_admin,
        anak_keluar_bulan_ini: data.anak_keluar_bulan_ini,
        anak_keluar_bulan_lalu: data.anak_keluar_bulan_lalu,
        // Tambahkan field lain yang penting untuk change detection
        last_updated: new Date().toISOString().split('T')[0] // Date only
      };
      return JSON.stringify(keyData);
    } catch {
      return '';
    }
  }, []);

  // Check for data changes
  const checkForChanges = useCallback(async () => {
    if (isCheckingRef.current || !enabled) return;
    
    try {
      isCheckingRef.current = true;
      console.log('[Data Change Detection] Checking for data changes...');
      
      const response = await dashboardAPI.getStats(period);
      
      if (response.status === 'success' && response.data) {
        const newDataHash = generateDataHash(response.data);
        
        if (newDataHash !== lastDataHash.current) {
          console.log('[Data Change Detection] Data changes detected!');
          lastDataHash.current = newDataHash;
          onDataChange?.(response.data);
        } else {
          console.log('[Data Change Detection] No changes detected');
          onNoChange?.();
        }
      }
    } catch (err) {
      console.error('[Data Change Detection] Error checking for changes:', err);
    } finally {
      isCheckingRef.current = false;
    }
  }, [period, generateDataHash, onDataChange, onNoChange, enabled]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (enabled) {
      intervalRef.current = setInterval(checkForChanges, checkInterval);
      console.log('[Data Change Detection] Started monitoring with interval:', checkInterval);
    }
  }, [checkInterval, checkForChanges, enabled]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('[Data Change Detection] Stopped monitoring');
    }
  }, []);

  // Manual check
  const manualCheck = useCallback(() => {
    checkForChanges();
  }, [checkForChanges]);

  // Set initial data hash
  const setInitialDataHash = useCallback((data: DashboardStats) => {
    lastDataHash.current = generateDataHash(data);
    console.log('[Data Change Detection] Set initial data hash');
  }, [generateDataHash]);

  // Setup monitoring
  useEffect(() => {
    startMonitoring();

    return () => {
      stopMonitoring();
    };
  }, [startMonitoring, stopMonitoring]);

  return {
    startMonitoring,
    stopMonitoring,
    manualCheck,
    setInitialDataHash,
    isChecking: isCheckingRef.current
  };
}; 