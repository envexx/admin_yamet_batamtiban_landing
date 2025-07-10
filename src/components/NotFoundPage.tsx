import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = ({ onGoHome = () => window.location.href = '/' }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau mungkin telah dipindahkan.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Home size={20} />
            Kembali ke Beranda
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 