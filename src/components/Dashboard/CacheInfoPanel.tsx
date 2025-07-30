import React, { useState } from 'react';
import { Info, Clock, RefreshCw, Database, Settings } from 'lucide-react';
import { useDashboardCache } from '../../contexts/DashboardCacheContext';

const CacheInfoPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    lastFetchTime, 
    isLoading, 
    error, 
    isStale, 
    timeSinceLastFetch,
    refreshStats,
    clearCache
  } = useDashboardCache();

  const formatTimeAgo = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours} jam ${minutes % 60} menit yang lalu`;
    } else if (minutes > 0) {
      return `${minutes} menit ${seconds % 60} detik yang lalu`;
    } else {
      return `${seconds} detik yang lalu`;
    }
  };

  const formatCacheAge = (): string => {
    if (!lastFetchTime) return 'Tidak ada cache';
    return formatTimeAgo(timeSinceLastFetch || 0);
  };

  const getCacheStatus = () => {
    if (error) return { color: 'text-red-600', text: 'Error', icon: 'error' };
    if (isLoading) return { color: 'text-blue-600', text: 'Memuat', icon: 'loading' };
    if (isStale) return { color: 'text-yellow-600', text: 'Kadaluarsa', icon: 'stale' };
    return { color: 'text-green-600', text: 'Segar', icon: 'fresh' };
  };

  const status = getCacheStatus();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Status Cache Dashboard</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-sm font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>

        {lastFetchTime && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Terakhir diperbarui:</span>
            <span className="text-sm text-gray-700">{formatCacheAge()}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Error:</span>
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <div className="text-xs text-gray-500">
            <div className="flex items-center gap-1 mb-1">
              <Info className="w-3 h-3" />
              <span>Informasi Cache</span>
            </div>
            <div className="space-y-1">
              <div>• Cache berlaku selama 5 menit</div>
              <div>• Background refresh setiap 2 menit</div>
              <div>• Data diperbarui otomatis di background</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => refreshStats()}
              disabled={isLoading}
              className={`flex-1 px-3 py-1 text-xs rounded border ${
                isLoading
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={clearCache}
              className="flex-1 px-3 py-1 text-xs rounded border bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            >
              <Clock className="w-3 h-3 mr-1" />
              Clear Cache
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheInfoPanel; 