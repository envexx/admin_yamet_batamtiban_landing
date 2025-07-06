import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Users, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { anakAPI } from '../../services/api';
import { AnakDetail, Pagination } from '../../types';

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const [anak, setAnak] = useState<AnakDetail[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
    search: '',
    status: 'all',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [anakToDelete, setAnakToDelete] = useState<AnakDetail | null>(null);

  useEffect(() => {
    fetchAnak();
    // eslint-disable-next-line
  }, [filters]);

  const fetchAnak = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiFilters = {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        search: filters.search,
        status: filters.status === 'all' ? undefined : filters.status,
      };
      const response = await anakAPI.getAll(apiFilters);
      if (response.status === 'success' && Array.isArray(response.data)) {
        setAnak(response.data);
        setPagination(response.pagination || null);
      } else {
        setError(response.message || 'Gagal memuat data anak');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data anak');
    } finally {
      setLoading(false);
    }
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      'AKTIF': { bg: 'bg-green-100', text: 'text-green-800', label: 'Aktif' },
      'CUTI': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Cuti' },
      'LULUS': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Lulus' },
      'BERHENTI': { bg: 'bg-red-100', text: 'text-red-800', label: 'Berhenti' }
    };
    const config = statusConfig[status] || statusConfig['AKTIF'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleDeleteClick = (anak: AnakDetail) => {
    setAnakToDelete(anak);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!anakToDelete) return;
    try {
      await anakAPI.delete(anakToDelete.id);
      setShowDeleteModal(false);
      setAnakToDelete(null);
      fetchAnak();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus anak');
    }
  };

  const filteredAnak = anak.filter(a => 
    a.nomor_anak.toLowerCase().includes(filters.search.toLowerCase()) ||
    a.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
    a.nick_name.toLowerCase().includes(filters.search.toLowerCase()) ||
    a.ayah?.nama.toLowerCase().includes(filters.search.toLowerCase()) ||
    a.ibu?.nama.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Daftar Anak</h1>
                <p className="text-sm text-gray-600">Kelola data anak terapi</p>
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                onClick={() => navigate('/anak/tambah')}
              >
                <Plus className="w-4 h-4" />
                Tambah Anak
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, nomor anak, atau nama orang tua..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.search}
                    onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.status}
                    onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="all">Semua Status</option>
                    <option value="AKTIF">Aktif</option>
                    <option value="CUTI">Cuti</option>
                    <option value="LULUS">Lulus</option>
                    <option value="BERHENTI">Berhenti</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anak</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usia</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orang Tua</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Dibuat</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">Memuat data...</td></tr>
                ) : error ? (
                  <tr><td colSpan={7} className="text-center py-8 text-red-500">{error}</td></tr>
                ) : filteredAnak.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">Tidak ada data anak</td></tr>
                ) : filteredAnak.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {typeof a.full_name === 'string' && a.full_name.trim()
                                ? a.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)
                                : '--'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{a.full_name}</div>
                          <div className="text-sm text-gray-500">{a.nomor_anak} • {a.nick_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getAge(a.birth_date)} tahun</div>
                      <div className="text-sm text-gray-500">{formatDate(a.birth_date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Ayah: {a.ayah?.nama || '-'}</div>
                      <div className="text-sm text-gray-500">Ibu: {a.ibu?.nama || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(a.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(a.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => navigate(`/anak/${a.id}`)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" onClick={() => navigate(`/anak/edit/${a.id}`)}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleDeleteClick(a)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.total > pagination.limit && (
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setFilters(f => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))}
                  >
                    Sebelumnya
                  </button>
                  <button
                    disabled={pagination.page === pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                  >
                    Berikutnya
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Menampilkan <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> hingga{' '}
                      <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> dari{' '}
                      <span className="font-medium">{pagination.total}</span> data
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setFilters(f => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === i + 1
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                          onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        disabled={pagination.page === pagination.totalPages}
                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-gray-900">Hapus Data Anak</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Apakah Anda yakin ingin menghapus data {anakToDelete?.full_name}? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;