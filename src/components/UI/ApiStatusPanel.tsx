import React, { useState, useEffect } from 'react';

interface ApiStatusPanelProps {
  className?: string;
}

const ApiStatusPanel: React.FC<ApiStatusPanelProps> = ({ className = '' }) => {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      
      // Test multiple endpoints
      const endpoints = [
        { name: 'Health', url: '/health' },
        { name: 'Conversion', url: '/conversion?page=1&limit=1' },
        { name: 'Notifikasi', url: '/notifikasi/user?page=1&limit=1' }
      ];

      const results = await Promise.allSettled(
        endpoints.map(async (endpoint) => {
          const response = await fetch(`${baseUrl}${endpoint.url}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          const data = await response.json();
          return {
            name: endpoint.name,
            status: response.status,
            ok: response.ok,
            data: data,
            url: endpoint.url
          };
        })
      );

      setApiStatus({
        timestamp: new Date(),
        results: results.map((result, index) => ({
          name: endpoints[index].name,
          ...(result.status === 'fulfilled' ? result.value : { 
            name: endpoints[index].name,
            status: 'Network Error',
            ok: false,
            error: result.reason?.message || 'Unknown error'
          })
        }))
      });
      setLastCheck(new Date());
    } catch (error) {
      console.error('API Status check failed:', error);
    }
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-green-800">API Status Monitor</h4>
        <button
          onClick={checkApiStatus}
          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
        >
          Refresh
        </button>
      </div>
      
      {apiStatus && (
        <div className="space-y-2 text-xs">
          <div className="text-green-700">
            Last Check: {lastCheck?.toLocaleTimeString()}
          </div>
          
          {apiStatus.results.map((result: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-green-700">{result.name}:</span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  result.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {result.ok ? 'OK' : 'FAILED'}
                </span>
                <span className="text-gray-600">({result.status})</span>
              </div>
            </div>
          ))}
          
          {apiStatus.results.some((r: any) => !r.ok) && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <div className="text-yellow-800 text-xs font-medium mb-1">Issues Found:</div>
              {apiStatus.results
                .filter((r: any) => !r.ok)
                .map((result: any, index: number) => (
                  <div key={index} className="text-yellow-700 text-xs">
                    • {result.name}: {result.error || `Status ${result.status}`}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiStatusPanel; 