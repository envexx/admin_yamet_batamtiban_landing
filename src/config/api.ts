// API Configuration for different environments
export const API_CONFIG = {
  // Production API URL
  PRODUCTION_API_URL: 'https://api.yametbatamtiban.id',
  
  // Development API URL (proxy to local backend)
  DEVELOPMENT_API_URL: '/api',
  
  // Frontend URLs
  PRODUCTION_FRONTEND_URL: 'https://admin.yametbatamtiban.id',
  DEVELOPMENT_FRONTEND_URL: 'http://localhost:5173', // or whatever your dev port is
  
  // Get current API base URL based on environment
  getApiBaseURL: (): string => {
    // Check if we're in production by hostname
    if (window.location.hostname === 'admin.yametbatamtiban.id') {
      return API_CONFIG.PRODUCTION_API_URL;
    }
    
    // Check if we're in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return API_CONFIG.DEVELOPMENT_API_URL;
    }
    
    // Default to development for other cases
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
    return window.location.hostname === 'admin.yametbatamtiban.id';
  },
  
  // Check if we're in development
  isDevelopment: (): boolean => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }
};

export default API_CONFIG; 