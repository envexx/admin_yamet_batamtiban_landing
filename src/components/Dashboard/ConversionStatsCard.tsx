import React from 'react';
import { TrendingUp, Users, Target, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ConversionStatsCardProps {
  conversionData?: {
    total_records: number;
    total_leads: number;
    total_anak_keluar: number;
    total_conversi: number;
    conversion_rate: number;
    data: any[];
  };
}

const ConversionStatsCard: React.FC<ConversionStatsCardProps> = ({ conversionData }) => {
  if (!conversionData) {
    return null;
  }

  const { total_records, total_leads, total_anak_keluar, total_conversi, conversion_rate, data } = conversionData;

  // Prepare chart data
  const chartData = data.map(item => ({
    bulan: item.bulan,
    leads: item.jumlah_leads,
    conversi: item.jumlah_conversi,
    rate: item.jumlah_leads > 0 ? ((item.jumlah_conversi / item.jumlah_leads) * 100).toFixed(1) : 0
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        Statistik Conversion
      </h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{total_leads}</div>
          <div className="text-sm text-gray-600">Total Leads</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{total_conversi}</div>
          <div className="text-sm text-gray-600">Total Conversi</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{conversion_rate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{total_anak_keluar}</div>
          <div className="text-sm text-gray-600">Anak Keluar</div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="bulan" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Conversion Rate (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Data Table */}
      {data.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Data Terbaru</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bulan</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Conversi</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.slice(0, 5).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">{item.bulan} {item.tahun}</td>
                    <td className="px-3 py-2 text-gray-900">{item.jumlah_leads}</td>
                    <td className="px-3 py-2 text-gray-900">{item.jumlah_conversi}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.jumlah_leads > 0 
                          ? `${((item.jumlah_conversi / item.jumlah_leads) * 100).toFixed(1)}%`
                          : '0%'
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionStatsCard; 