import React from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useDashboardCache } from '../../contexts/DashboardCacheContext';

const MinimalCacheStatus: React.FC = () => {
  const { 
    isLoading, 
    error, 
    isStale,
    refreshStats 
  } = useDashboardCache();

  // Only show if there's an issue or loading
  if (!isLoading && !error && !isStale) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {isLoading && (
        <div className="flex items-center gap-1 text-blue-600">
          <RefreshCw className="w-3 h-3 animate-spin" />
          <span>Memperbarui...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-1 text-red-600">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
          <button
            onClick={() => refreshStats()}
            className="text-xs underline hover:no-underline"
          >
            Coba lagi
          </button>
        </div>
      )}
      
      {isStale && !isLoading && !error && (
        <div className="flex items-center gap-1 text-yellow-600">
          <CheckCircle className="w-3 h-3" />
          <span>Data perlu diperbarui</span>
          <button
            onClick={() => refreshStats()}
            className="text-xs underline hover:no-underline"
          >
            Perbarui
          </button>
        </div>
      )}
    </div>
  );
};

export default MinimalCacheStatus; 