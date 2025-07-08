import React, { useEffect, useState } from 'react';
import { authAPI } from '../../services/api';
import { User, Pagination } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';

const TerapisList: React.FC = () => {
  const [terapis, setTerapis] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
    search: '',
    role: 'TERAPIS',
    status: undefined as 'active' | 'inactive' | 'pending' | undefined,
  });

  useEffect(() => {
    fetchTerapis();
    // eslint-disable-next-line
  }, [filters]);

  const fetchTerapis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.getAllUsers(filters);
      if (response.status === 'success' && response.data) {
        setTerapis(response.data.users || []);
        setPagination(response.data.pagination || null);
      } else {
        setError(response.message || 'Gagal memuat data terapis');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data terapis');
    } finally {
      setLoading(false);
    }
  };

  function getRoleBadge(peran: string) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        <Shield className="w-3 h-3 inline mr-1" />{peran}
      </span>
    );
  }

  function getStatusBadge(status: string) {
    if (status === 'active') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          <UserCheck className="w-3 h-3 inline mr-1" />Aktif
        </span>
      );
    } else if (status === 'inactive') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          <UserX className="w-3 h-3 inline mr-1" />Nonaktif
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          <UserX className="w-3 h-3 inline mr-1" />Pending
        </span>
      );
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Daftar Terapis</h1>
            <p className="text-sm text-gray-600">Data seluruh terapis aktif/nonaktif</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner size="lg" text="Memuat data terapis..." />
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No. Telepon</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dibuat</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {terapis.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">Tidak ada data terapis</td></tr>
                ) : terapis.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2 whitespace-nowrap">{t.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{t.email}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{t.phone || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{getStatusBadge(t.status)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{getRoleBadge(t.peran)}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{formatDate(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerapisList; 