import React, { useState, useEffect } from 'react';
import { BarChart3, Database, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useDashboardCache } from '../../contexts/DashboardCacheContext';

interface CacheStats {
  totalRequests: number;
  cacheHits: number;
  cacheMisses: number;
  averageLoadTime: number;
  lastUpdateTime: number | null;
}

const CacheStatsPanel: React.FC = () => {
  const [stats, setStats] = useState<CacheStats>({
    totalRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    averageLoadTime: 0,
    lastUpdateTime: null
  });
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { 
    lastFetchTime, 
    timeSinceLastFetch,
    isStale 
  } = useDashboardCache();

  // Simulate cache statistics (in real app, this would come from actual metrics)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 3),
        cacheHits: prev.cacheHits + Math.floor(Math.random() * 2),
        cacheMisses: prev.cacheMisses + Math.floor(Math.random() * 1),
        averageLoadTime: Math.max(50, prev.averageLoadTime + (Math.random() - 0.5) * 20),
        lastUpdateTime: lastFetchTime
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [lastFetchTime]);

  const hitRate = stats.totalRequests > 0 ? (stats.cacheHits / stats.totalRequests * 100).toFixed(1) : '0';
  const missRate = stats.totalRequests > 0 ? (stats.cacheMisses / stats.totalRequests * 100).toFixed(1) : '0';

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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Cache Performance</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Database className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{hitRate}%</div>
          <div className="text-xs text-gray-500">Cache Hit Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.averageLoadTime.toFixed(0)}ms</div>
          <div className="text-xs text-gray-500">Avg Load Time</div>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Requests:</span>
          <span className="font-medium">{stats.totalRequests}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cache Hits:</span>
          <span className="font-medium text-green-600">{stats.cacheHits}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cache Misses:</span>
          <span className="font-medium text-red-600">{stats.cacheMisses}</span>
        </div>
        {lastFetchTime && timeSinceLastFetch && (
          <div className="flex justify-between">
            <span className="text-gray-600">Last Update:</span>
            <span className="font-medium">{formatTimeAgo(timeSinceLastFetch)}</span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <div className="text-xs text-gray-500">
            <div className="flex items-center gap-1 mb-2">
              <TrendingUp className="w-3 h-3" />
              <span>Performance Metrics</span>
            </div>
            <div className="space-y-1">
              <div>• Cache hit rate: {hitRate}%</div>
              <div>• Cache miss rate: {missRate}%</div>
              <div>• Average load time: {stats.averageLoadTime.toFixed(0)}ms</div>
              <div>• Total requests: {stats.totalRequests}</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded p-2">
            <div className="flex items-center gap-1 mb-1">
              <AlertCircle className="w-3 h-3 text-yellow-600" />
              <span className="text-xs font-medium text-gray-700">Cache Status</span>
            </div>
            <div className="text-xs text-gray-600">
              {isStale ? (
                <span className="text-yellow-600">Data perlu diperbarui</span>
              ) : (
                <span className="text-green-600">Data terbaru</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 bg-green-50 rounded p-2 text-center">
              <div className="text-lg font-bold text-green-600">{hitRate}%</div>
              <div className="text-xs text-green-700">Hit Rate</div>
            </div>
            <div className="flex-1 bg-red-50 rounded p-2 text-center">
              <div className="text-lg font-bold text-red-600">{missRate}%</div>
              <div className="text-xs text-red-700">Miss Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheStatsPanel; 