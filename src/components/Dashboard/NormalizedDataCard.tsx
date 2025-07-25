import React from 'react';
import { NormalizedData } from '../../types';
import { AlertCircle, Info, TrendingUp, BarChart3 } from 'lucide-react';

interface NormalizedDataCardProps {
  title: string;
  data: NormalizedData;
  type: 'keluhan' | 'sumber';
  className?: string;
}

const NormalizedDataCard: React.FC<NormalizedDataCardProps> = ({ 
  title, 
  data, 
  type, 
  className = '' 
}) => {
  if (!data) return null;

  const getIcon = () => {
    switch (type) {
      case 'keluhan':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'sumber':
        return <Info className="w-5 h-5 text-green-600" />;
      default:
        return <BarChart3 className="w-5 h-5 text-gray-600" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'keluhan':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200',
          highlight: 'bg-blue-100'
        };
      case 'sumber':
        return {
          bg: 'bg-green-50',
          text: 'text-green-600',
          border: 'border-green-200',
          highlight: 'bg-green-100'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          border: 'border-gray-200',
          highlight: 'bg-gray-100'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          {getIcon()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">Data yang sudah dinormalisasi</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {type === 'keluhan' 
              ? data.summary.total_unique_keluhan || 0
              : data.summary.total_unique_sumber || 0
            }
          </div>
          <div className="text-sm text-gray-600">Total Unique</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">
            {type === 'keluhan'
              ? data.summary.total_normalized_keluhan || 0
              : data.summary.total_normalized_sumber || 0
            }
          </div>
          <div className="text-sm text-gray-600">Normalized</div>
        </div>
      </div>

      {/* Top Item */}
      {type === 'keluhan' && data.summary.top_keluhan && (
        <div className={`mb-6 p-4 ${colors.bg} rounded-lg border ${colors.border}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">Top Keluhan</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {data.summary.top_keluhan.normalized}
          </div>
          <div className="text-sm text-gray-600">
            {data.summary.top_keluhan.count} kasus
          </div>
        </div>
      )}

      {type === 'sumber' && data.summary.top_sumber && (
        <div className={`mb-6 p-4 ${colors.bg} rounded-lg border ${colors.border}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">Top Sumber</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {data.summary.top_sumber.normalized}
          </div>
          <div className="text-sm text-gray-600">
            {data.summary.top_sumber.count} kasus
          </div>
        </div>
      )}

      {/* Normalized Data List */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Data Normalisasi
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {data.normalized_data.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{item.normalized}</div>
                <div className="text-xs text-gray-500">
                  Original: {item.original}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {item.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Data Summary */}
      {data.raw_data && data.raw_data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Raw Data Summary</h4>
          <div className="text-xs text-gray-500">
            {data.raw_data.length} item raw data telah dinormalisasi menjadi {data.normalized_data.length} kategori
          </div>
        </div>
      )}
    </div>
  );
};

export default NormalizedDataCard; 