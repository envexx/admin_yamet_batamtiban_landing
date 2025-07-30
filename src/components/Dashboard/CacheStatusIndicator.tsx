import React from 'react';
import { Clock, RefreshCw, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useDashboardCache } from '../../contexts/DashboardCacheContext';

const CacheStatusIndicator: React.FC = () => {
  const { 
    lastFetchTime, 
    isLoading, 
    error, 
    isStale, 
    timeSinceLastFetch,
    refreshStats 
  } = useDashboardCache();

  const formatTimeAgo = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours} jam yang lalu`;
    } else if (minutes > 0) {
      return `${minutes} menit yang lalu`;
    } else {
      return `${seconds} detik yang lalu`;
    }
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600';
    if (isLoading) return 'text-blue-600';
    if (isStale) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-4 h-4" />;
    if (isLoading) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (isStale) return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (isLoading) return 'Memuat...';
    if (isStale) return 'Data perlu diperbarui';
    return 'Data terbaru';
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`flex items-center gap-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
      
      {lastFetchTime && timeSinceLastFetch && (
        <div className="flex items-center gap-1 text-gray-500">
          <Info className="w-3 h-3" />
          <span>{formatTimeAgo(timeSinceLastFetch)}</span>
        </div>
      )}
      
      {isStale && !isLoading && (
        <button
          onClick={() => refreshStats()}
          className="text-blue-600 hover:text-blue-700 text-xs underline"
        >
          Perbarui
        </button>
      )}
    </div>
  );
};

export default CacheStatusIndicator; 