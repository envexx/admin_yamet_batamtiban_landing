import React, { useState } from 'react';

interface ApiTestPanelProps {
  className?: string;
}

const ApiTestPanel: React.FC<ApiTestPanelProps> = ({ className = '' }) => {
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const testApiConnection = async () => {
    setTesting(true);
    setTestResults(null);

    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      
      // Test 1: Basic connectivity
      const connectivityTest = await fetch(`${baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).catch(() => ({ ok: false, status: 'Network Error' }));

      // Test 2: Conversion API
      const conversionTest = await fetch(`${baseUrl}/conversion?page=1&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).catch(() => ({ ok: false, status: 'Network Error' }));

      // Test 3: Notifikasi API
      const notifikasiTest = await fetch(`${baseUrl}/notifikasi/user?page=1&limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }).catch(() => ({ ok: false, status: 'Network Error' }));

      setTestResults({
        timestamp: new Date().toISOString(),
        connectivity: {
          status: connectivityTest.ok ? 'OK' : 'FAILED',
          statusCode: connectivityTest.status
        },
        conversion: {
          status: conversionTest.ok ? 'OK' : 'FAILED',
          statusCode: conversionTest.status
        },
        notifikasi: {
          status: notifikasiTest.ok ? 'OK' : 'FAILED',
          statusCode: notifikasiTest.status
        }
      });
    } catch (error) {
      setTestResults({
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <h4 className="text-sm font-medium text-blue-800 mb-2">API Connection Test</h4>
      
      <button
        onClick={testApiConnection}
        disabled={testing}
        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test API Connection'}
      </button>

      {testResults && (
        <div className="mt-3 text-xs text-blue-700">
          <div className="font-medium mb-1">Test Results ({testResults.timestamp})</div>
          {testResults.error ? (
            <div className="text-red-600">Error: {testResults.error}</div>
          ) : (
            <div className="space-y-1">
              <div>Connectivity: <span className={testResults.connectivity.status === 'OK' ? 'text-green-600' : 'text-red-600'}>{testResults.connectivity.status} ({testResults.connectivity.statusCode})</span></div>
              <div>Conversion API: <span className={testResults.conversion.status === 'OK' ? 'text-green-600' : 'text-red-600'}>{testResults.conversion.status} ({testResults.conversion.statusCode})</span></div>
              <div>Notifikasi API: <span className={testResults.notifikasi.status === 'OK' ? 'text-green-600' : 'text-red-600'}>{testResults.notifikasi.status} ({testResults.notifikasi.statusCode})</span></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiTestPanel; 