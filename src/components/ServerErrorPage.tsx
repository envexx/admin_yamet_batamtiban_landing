import React from 'react';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

const ServerErrorPage = ({ onRetry = () => window.location.reload() }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-red-600" size={32} />
            </div>
          </div>
          <div className="text-6xl font-bold text-gray-300 mb-4">500</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Terjadi Kesalahan Server
          </h1>
          <p className="text-gray-600 mb-8">
            Maaf, terjadi kesalahan internal pada server. Tim kami sedang bekerja untuk memperbaikinya.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={20} />
            Coba Lagi
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Home size={20} />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage; 