import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Bell, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useNotifikasiData, useCreateNotifikasi, useUpdateNotifikasi, useDeleteNotifikasi } from '../../hooks/useNotifikasi';
import type { NotifikasiForm } from '../../types';
import NotifikasiForm from './NotifikasiForm';
import Modal from '../UI/Modal';

interface NotifikasiTableProps {
  className?: string;
}

const NotifikasiTable: React.FC<NotifikasiTableProps> = ({ className = '' }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [tujuanFilter, setTujuanFilter] = useState('');
  const [isReadFilter, setIsReadFilter] = useState<boolean | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [editingNotifikasi, setEditingNotifikasi] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, loading, error, refetch } = useNotifikasiData(
    page, 
    10, 
    search, 
    jenisFilter, 
    tujuanFilter, 
    isReadFilter
  );
  const { createNotifikasi, loading: createLoading } = useCreateNotifikasi();
  const { updateNotifikasi, loading: updateLoading } = useUpdateNotifikasi();
  const { deleteNotifikasi, loading: deleteLoading } = useDeleteNotifikasi();

  const handleSubmit = async (formData: NotifikasiForm) => {
    try {
      if (editingNotifikasi) {
        await updateNotifikasi(editingNotifikasi.id, formData);
      } else {
        await createNotifikasi(formData);
      }
      setShowForm(false);
      setEditingNotifikasi(null);
      refetch();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (notifikasi: any) => {
    setEditingNotifikasi(notifikasi);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteNotifikasi(deleteId);
        setShowDeleteModal(false);
        setDeleteId(null);
        refetch();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const getJenisIcon = (jenis: string) => {
    switch (jenis) {
      case 'INFO':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getJenisBadge = (jenis: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (jenis) {
      case 'INFO':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'WARNING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'SUCCESS':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'ERROR':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Action Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Kirim Notifikasi
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari notifikasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Jenis Filter */}
          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Jenis</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="SUCCESS">Success</option>
            <option value="ERROR">Error</option>
          </select>

          {/* Tujuan Filter */}
          <select
            value={tujuanFilter}
            onChange={(e) => setTujuanFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Tujuan</option>
            <option value="ALL">Semua User</option>
            <option value="ROLE:admin">Admin</option>
            <option value="ROLE:terapis">Terapis</option>
          </select>

          {/* Status Filter */}
          <select
            value={isReadFilter === undefined ? '' : isReadFilter.toString()}
            onChange={(e) => setIsReadFilter(e.target.value === '' ? undefined : e.target.value === 'true')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Status</option>
            <option value="false">Belum Dibaca</option>
            <option value="true">Sudah Dibaca</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Isi Notifikasi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tujuan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dibuat Oleh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.notifikasis?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getJenisIcon(item.jenis_pemberitahuan)}
                    <span className={getJenisBadge(item.jenis_pemberitahuan)}>
                      {item.jenis_pemberitahuan}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-900 line-clamp-2">
                      {item.isi_notifikasi}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.tujuan === 'ALL' ? 'Semua User' : 
                   item.tujuan.startsWith('ROLE:') ? item.tujuan.replace('ROLE:', '') :
                   item.tujuan.startsWith('USER:') ? 'User Tertentu' : item.tujuan}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.is_read 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.is_read ? 'Dibaca' : 'Belum Dibaca'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.user_created?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(item.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {data?.notifikasis?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Bell className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada notifikasi</h3>
          <p className="text-gray-500">Belum ada notifikasi yang tersedia.</p>
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
            setEditingNotifikasi(null);
          }}
          title={editingNotifikasi ? 'Edit Notifikasi' : 'Kirim Notifikasi Baru'}
        >
          <NotifikasiForm
            initialData={editingNotifikasi}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingNotifikasi(null);
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
              Apakah Anda yakin ingin menghapus notifikasi ini? Tindakan ini tidak dapat dibatalkan.
            </p>
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

export default NotifikasiTable; 