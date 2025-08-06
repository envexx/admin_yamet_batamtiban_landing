import React from 'react';
import ConversionTable from './ConversionTable';
import ErrorBoundary from '../UI/ErrorBoundary';

const ConversionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <ConversionTable />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ConversionPage; 