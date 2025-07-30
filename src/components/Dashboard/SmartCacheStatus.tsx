import React, { useState, useEffect } from 'react';
import { Brain, Zap, Clock, CheckCircle, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import { useDashboardCache } from '../../contexts/DashboardCacheContext';

const SmartCacheStatus: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [activityCount, setActivityCount] = useState(0);
  
  const { 
    lastFetchTime, 
    isLoading, 
    error, 
    isStale, 
    timeSinceLastFetch,
    refreshStats 
  } = useDashboardCache();

  // Track activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLoading) {
        setLastActivity(new Date());
        setActivityCount(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading]);

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

  const getStatusInfo = () => {
    if (error) {
      return {
        color: 'text-red-600',
        text: 'Error',
        icon: AlertCircle,
        description: 'Terjadi kesalahan saat memuat data'
      };
    }
    
    if (isLoading) {
      return {
        color: 'text-blue-600',
        text: 'Smart Loading',
        icon: Brain,
        description: 'Memeriksa perubahan data secara cerdas'
      };
    }
    
    if (isStale) {
      return {
        color: 'text-yellow-600',
        text: 'Perlu Update',
        icon: Clock,
        description: 'Data sudah lama, akan diperbarui saat ada perubahan'
      };
    }
    
    return {
      color: 'text-green-600',
      text: 'Data Terbaru',
      icon: CheckCircle,
      description: 'Data sudah terbaru dan optimal'
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">Smart Cache Status</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <StatusIcon className={`w-4 h-4 ${status.color}`} />
          <span className={`text-sm font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>

        <p className="text-xs text-gray-600">{status.description}</p>

        {lastFetchTime && timeSinceLastFetch && (
          <div className="text-xs text-gray-500">
            Terakhir diperbarui: {formatTimeAgo(timeSinceLastFetch)}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Memeriksa perubahan data...</span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <div className="text-xs text-gray-500">
            <div className="flex items-center gap-1 mb-2">
              <Zap className="w-3 h-3" />
              <span>Smart Features</span>
            </div>
            <div className="space-y-1">
              <div>• Event-driven updates (tidak ada timer)</div>
              <div>• Change detection otomatis</div>
              <div>• Update hanya saat ada perubahan data</div>
              <div>• Cache berlaku 15 menit</div>
              <div>• Stale detection 30 menit</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded p-2">
            <div className="flex items-center gap-1 mb-1">
              <Brain className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Activity</span>
            </div>
            <div className="text-xs text-gray-600">
              <div>Activity count: {activityCount}</div>
              <div>Last activity: {lastActivity.toLocaleTimeString()}</div>
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
              Force Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartCacheStatus; 