import React, { useEffect, useState } from 'react';
import { DashboardStats } from '../../types';
import StatsCard from './StatsCard';
import NormalizedDataCard from './NormalizedDataCard';
import MinimalCacheStatus from './MinimalCacheStatus';
import ConversionStatsCard from './ConversionStatsCard';
import ErrorBoundary from '../UI/ErrorBoundary';
import { Users, UserCheck, UserPlus, TrendingUp, BarChart2, LogOut, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboardCache } from '../../contexts/DashboardCacheContext';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<string>('all');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // Use dashboard cache
  const { 
    cachedStats, 
    isLoading, 
    error, 
    getStats, 
    refreshStats,
    isStale,
    subscribeToChanges,
    triggerDataChange
  } = useDashboardCache();

  // Check user role for conditional rendering
  const roleName = typeof user?.role === 'string'
    ? user.role
    : user?.role?.name || user?.peran;

  const canViewAdminStats = roleName === 'SUPERADMIN' || roleName === 'MANAJER';
  const canViewNormalizedData = roleName === 'SUPERADMIN' || roleName === 'MANAJER' || roleName === 'ADMIN';

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      const freshStats = await getStats(period);
      if (freshStats) {
        setStats(freshStats);
      }
    };

    initializeData();
  }, [period, getStats]);

  // Subscribe to data changes
  useEffect(() => {
    const unsubscribe = subscribeToChanges(() => {
      console.log('[Dashboard] Data change detected, updating view');
      // Trigger UI update when data changes
      if (cachedStats) {
        setStats(cachedStats);
      }
    });

    return unsubscribe;
  }, [subscribeToChanges, cachedStats]);

  // Update stats when cache changes
  useEffect(() => {
    if (cachedStats) {
      setStats(cachedStats);
    }
  }, [cachedStats]);

  // Handle period change
  const handlePeriodChange = async (newPeriod: string) => {
    setPeriod(newPeriod);
    const freshStats = await getStats(newPeriod);
    if (freshStats) {
      setStats(freshStats);
    }
  };

  // Handle manual refresh
  const handleManualRefresh = async () => {
    await refreshStats(period);
  };

  // Component untuk menampilkan admin input stats
  const AdminInputStatsWidget: React.FC = () => {
    if (!stats?.admin_input_stats || !canViewAdminStats) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-purple-600" />
          Statistik Inputan Admin
        </h3>
        
        <div className="space-y-4">
          {stats.admin_input_stats.map((admin, index) => (
            <div key={admin.admin_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">
                      {admin.admin_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{admin.admin_name}</div>
                    <div className="text-sm text-gray-500">{admin.admin_email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{admin.total_input}</div>
                  <div className="text-sm text-gray-500">Total Input</div>
                </div>
              </div>
              
              {/* Detail Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-sm font-medium text-blue-600">Anak</div>
                  <div className="text-lg font-bold text-blue-900">{admin.detail.anak}</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="text-sm font-medium text-green-600">Penilaian</div>
                  <div className="text-lg font-bold text-green-900">{admin.detail.penilaian}</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="text-sm font-medium text-yellow-600">Program</div>
                  <div className="text-lg font-bold text-yellow-900">{admin.detail.program_terapi}</div>
                </div>
                <div className="text-center p-2 bg-red-50 rounded">
                  <div className="text-sm font-medium text-red-600">Jadwal</div>
                  <div className="text-lg font-bold text-red-900">{admin.detail.jadwal_terapi}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Show loading only on initial load, not background refresh
  if (isLoading && !stats) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Memuat data dashboard...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={handleManualRefresh}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Tidak ada data statistik tersedia</p>
        <button
          onClick={handleManualRefresh}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  // Pie data for age distribution
  const pieData = stats.insight?.age_distribution
    ? Object.entries(stats.insight.age_distribution).map(([age, count]) => ({ name: age + ' tahun', value: count }))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <MinimalCacheStatus />
          </div>
          <div className="flex items-center gap-3">
            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={period}
              onChange={e => handlePeriodChange(e.target.value)}
            >
              <option value="month">1 Bulan Terakhir</option>
              <option value="1month">1 Bulan Terakhir</option>
              <option value="4month">4 Bulan Terakhir</option>
              <option value="6month">6 Bulan Terakhir</option>
              <option value="1year">1 Tahun Terakhir</option>
              <option value="all">Semua Waktu</option>
            </select>
            <button 
              onClick={handleManualRefresh}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isLoading 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Memuat...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Background refresh indicator */}
      {isLoading && stats && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Memperbarui data di background...</span>
          </div>
        </div>
      )}



      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Total Anak" value={stats.total_anak} icon={Users} color="blue" />
        <StatsCard title="Anak Aktif" value={stats.anak_aktif || 0} icon={TrendingUp} color="green" />
        <StatsCard title="Anak Keluar Bulan Ini" value={stats.anak_keluar_bulan_ini || 0} icon={LogOut} color="red" />
        <StatsCard title="Anak Keluar Bulan Lalu" value={stats.anak_keluar_bulan_lalu || 0} icon={LogOut} color="orange" />
        {typeof stats.total_terapis !== 'undefined' && (
          <StatsCard title="Total Terapis" value={stats.total_terapis} icon={UserCheck} color="purple" />
        )}
        {typeof stats.total_admin !== 'undefined' && (
          <StatsCard title="Total Admin" value={stats.total_admin} icon={UserPlus} color="purple" />
        )}
        {typeof stats.total_manajer !== 'undefined' && (
          <StatsCard title="Total Manajer" value={stats.total_manajer} icon={UserPlus} color="indigo" />
        )}
        {typeof stats.total_orangtua !== 'undefined' && (
          <StatsCard title="Total Orang Tua" value={stats.total_orangtua} icon={Users} color="teal" />
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            Pertumbuhan Anak
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.growth || []}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="period" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  fill="url(#colorGrowth)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Distribution */}
        {pieData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Distribusi Usia
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Conversion Stats */}
      {stats.conversion_data && (
        <div className="mb-8">
          <ErrorBoundary>
            <ConversionStatsCard conversionData={stats.conversion_data} />
          </ErrorBoundary>
        </div>
      )}

      {/* Normalized Data Section */}
      {canViewNormalizedData && stats.normalized_data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {stats.normalized_data.keluhan && (
            <NormalizedDataCard
              title="Keluhan (Normalisasi)"
              data={stats.normalized_data.keluhan}
              type="keluhan"
            />
          )}
          {stats.normalized_data.sumber_informasi && (
            <NormalizedDataCard
              title="Sumber Informasi (Normalisasi)"
              data={stats.normalized_data.sumber_informasi}
              type="sumber"
            />
          )}
        </div>
      )}

      {/* Admin Input Stats Section */}
      <div className="mb-8">
        <AdminInputStatsWidget />
      </div>

      {/* Geographic Distribution */}
      {stats.insight?.geographic && Object.keys(stats.insight.geographic).length > 0 && (
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Distribusi Geografis
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(stats.insight.geographic).map(([location, count]) => ({ location, count }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {Object.entries(stats.insight.geographic).map(([location, count]) => (
                <div key={location} className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{count}</div>
                  <div className="text-sm text-gray-600">{location}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats */}
      {stats.insight && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {typeof stats.insight.therapy_success_count !== 'undefined' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-green-600 mb-4">Terapi Berhasil</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.insight.therapy_success_count}</div>
              <p className="text-gray-600">Anak yang lulus terapi</p>
            </div>
          )}
          {typeof stats.insight.avg_therapy_duration_month !== 'undefined' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Rata-rata Durasi Terapi</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.insight.avg_therapy_duration_month}</div>
              <p className="text-gray-600">Bulan per anak</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;