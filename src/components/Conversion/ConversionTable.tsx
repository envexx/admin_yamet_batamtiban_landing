import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useConversionData, useCreateConversion, useUpdateConversion, useDeleteConversion } from '../../hooks/useConversion';
import type { ConversionForm } from '../../types';
import Modal from '../UI/Modal';
import ConversionFormComponent from './ConversionForm';
import { useAuth } from '../../contexts/AuthContext';

interface ConversionTableProps {
  className?: string;
}

const ConversionTable: React.FC<ConversionTableProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const userRole = user?.role?.name || user?.peran || '';
  
  // Role-based permissions
  const canCreate = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const canEdit = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const canDeleteConversion = userRole === 'SUPERADMIN' || userRole === 'ADMIN';
  const canView = userRole === 'MANAJER' || userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  
  // Debug: Log user role for troubleshooting
  console.log('[DEBUG] Current user:', user);
  console.log('[DEBUG] User role:', userRole);
  console.log('[DEBUG] Can delete conversion:', canDeleteConversion);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingConversion, setEditingConversion] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, loading, error, refetch } = useConversionData(page, 10, search);
  const { createConversion, loading: createLoading } = useCreateConversion();
  const { updateConversion, loading: updateLoading } = useUpdateConversion();
  const { deleteConversion, loading: deleteLoading } = useDeleteConversion();

  const handleSubmit = async (formData: ConversionForm) => {
    try {
      if (editingConversion) {
        await updateConversion(editingConversion.id, formData);
      } else {
        await createConversion(formData);
      }
      setShowForm(false);
      setEditingConversion(null);
      refetch();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (conversion: any) => {
    setEditingConversion(conversion);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (!canDeleteConversion) {
      alert('Anda tidak memiliki izin untuk menghapus data conversion');
      return;
    }
    setDeleteId(id);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteConversion(deleteId);
        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteError(null);
        refetch();
      } catch (error: any) {
        console.error('Error:', error);
        if (error.message?.includes('403') || error.response?.status === 403) {
          setDeleteError('Anda tidak memiliki izin untuk menghapus data conversion ini');
        } else {
          setDeleteError(error.message || 'Terjadi kesalahan saat menghapus data');
        }
      }
    }
  };

  const calculateConversionRate = (conversi: number, leads: number) => {
    if (leads === 0) return '0%';
    return `${((conversi / leads) * 100).toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Memuat data conversion...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error saat memuat data</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Action Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-end">
          {canCreate && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Data
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari berdasarkan bulan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bulan/Tahun
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anak Keluar
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah Leads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah Conversi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conversion Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dibuat Oleh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diupdate Oleh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.conversions?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.bulan} {item.tahun}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.jumlah_anak_keluar}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.jumlah_leads}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.jumlah_conversi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {calculateConversionRate(item.jumlah_conversi, item.jumlah_leads)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.user_created?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.user_updated?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {canDeleteConversion && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {!canEdit && !canDeleteConversion && (
                      <span className="text-gray-400 text-xs">View Only</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {data?.conversions?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data</h3>
          <p className="text-gray-500">Belum ada data conversion yang tersedia.</p>
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.total_pages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Menampilkan {((data.pagination.current_page - 1) * 10) + 1} - {Math.min(data.pagination.current_page * 10, data.pagination.total_records)} dari {data.pagination.total_records} data
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!data.pagination.has_prev}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sebelumnya
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Halaman {data.pagination.current_page} dari {data.pagination.total_pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={!data.pagination.has_next}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingConversion(null);
          }}
          title={editingConversion ? 'Edit Data Conversion' : 'Tambah Data Conversion'}
        >
          <ConversionFormComponent
            initialData={editingConversion}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingConversion(null);
            }}
            loading={createLoading || updateLoading}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Konfirmasi Hapus"
        >
          <div className="p-6">
            <p className="text-gray-700 mb-4">
              Apakah Anda yakin ingin menghapus data conversion ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            {deleteError && (
              <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {deleteError}</span>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ConversionTable; 