// API Configuration for different environments
export const API_CONFIG = {
  // Development API URL (proxy to local backend)
  DEVELOPMENT_API_URL: '/api',
  
  // Frontend URLs
  PRODUCTION_FRONTEND_URL: 'https://admin.yametbatamtiban.id',
  DEVELOPMENT_FRONTEND_URL: 'http://localhost:5173', // or whatever your dev port is
  
  // Get current API base URL based on environment
  getApiBaseURL: (): string => {
    console.log('[DEBUG] import.meta.env.NEXT_PUBLIC_API_URL:', import.meta.env.NEXT_PUBLIC_API_URL);
    console.log('[DEBUG] window.location.hostname:', window.location.hostname);
    
    // Jika ada env, pakai env (prioritas tertinggi)
    if (import.meta.env.NEXT_PUBLIC_API_URL) {
      console.log('[DEBUG] Menggunakan env:', import.meta.env.NEXT_PUBLIC_API_URL);
      return import.meta.env.NEXT_PUBLIC_API_URL;
    }
    
    // Auto-detect berdasarkan hostname
    const hostname = window.location.hostname;
    
    // Domain baru
    if (hostname === 'admin.yametbatuaji.id') {
      console.log('[DEBUG] Auto-detect: domain baru');
      return 'https://api.yametbatuaji.id/api/';
    }
    
    // Domain lama
    if (hostname === 'admin.yametbatamtiban.id') {
      console.log('[DEBUG] Auto-detect: domain lama');
      return 'https://api.yametbatamtiban.id/api/';
    }
    
    // Development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('[DEBUG] Auto-detect: development');
      return API_CONFIG.DEVELOPMENT_API_URL;
    }
    
    // Fallback untuk domain lain
    console.log('[DEBUG] Auto-detect: fallback ke development');
    return API_CONFIG.DEVELOPMENT_API_URL;
  },
  
  // Get current frontend URL
  getFrontendURL: (): string => {
    if (window.location.hostname === 'admin.yametbatamtiban.id') {
      return API_CONFIG.PRODUCTION_FRONTEND_URL;
    }
    return API_CONFIG.DEVELOPMENT_FRONTEND_URL;
  },
  
  // Check if we're in production
  isProduction: (): boolean => {
    return window.location.hostname === 'admin.yametbatamtiban.id' || window.location.hostname === 'admin.yametbatuaji.id';
  },
  
  // Check if we're in development
  isDevelopment: (): boolean => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }
};

export default API_CONFIG; 