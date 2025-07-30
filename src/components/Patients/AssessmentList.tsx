import React, { useEffect, useState } from 'react';
import { anakAPI } from '../../services/api';
import { AnakWithAssessment, Assessment, AssessmentForm, Pagination } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { useModalAlert } from '../UI/ModalAlertContext';

const AssessmentList: React.FC = () => {
  const [data, setData] = useState<AnakWithAssessment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Assessment | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteData, setDeleteData] = useState<{ anakId: number; assessmentId: number } | null>(null);
  const [selectedAnakId, setSelectedAnakId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<AssessmentForm>({
    assessment_date: '',
    assessment_type: '',
    assessment_result: '',
    notes: ''
  });
  const [addForm, setAddForm] = useState<AssessmentForm>({
    assessment_date: '',
    assessment_type: '',
    assessment_result: '',
    notes: ''
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const limit = 10;
  const { showAlert } = useModalAlert();

  useEffect(() => {
    fetchAssessments();
    // eslint-disable-next-line
  }, [search, page, sortBy, sortOrder]);

  useEffect(() => {
    if (error) {
      showAlert({ type: 'error', title: 'Gagal', message: error });
    }
  }, [error]);

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { 
        search, 
        page, 
        limit, 
        sortBy, 
        sortOrder: sortOrder.toUpperCase() 
      };
      const response = await anakAPI.getAllAssessmentGlobal(params);
      if (response.status === 'success' && response.data) {
        setData(response.data);
        setPagination(response.pagination || null);
      } else {
        setError(response.message || 'Gagal memuat data assessment');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page when searching
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1); // Reset to first page when sorting
  };

  const handleEditAssessment = (assessment: Assessment) => {
    if (!assessment.anak_id || isNaN(Number(assessment.anak_id))) {
      showAlert({ type: 'error', title: 'Data Tidak Valid', message: 'ID tidak valid' });
      return;
    }
    setSelected(assessment);
    setEditForm({
      assessment_date: assessment.assessment_date ? assessment.assessment_date.split('T')[0] : '',
      assessment_type: assessment.assessment_type,
      assessment_result: assessment.assessment_result || '',
      notes: assessment.notes || ''
    });
    setShowEditForm(true);
  };

  const handleUpdateAssessment = async () => {
    if (!selected || !selected.anak_id || isNaN(Number(selected.anak_id))) {
      showAlert({ type: 'error', title: 'Data Tidak Valid', message: 'ID tidak valid' });
      return;
    }
    try {
      const response = await anakAPI.updateAssessment(selected.anak_id, selected.id, editForm);
      if (response.status === 'success') {
        setShowEditForm(false);
        setSelected(null);
        setEditForm({
          assessment_date: '',
          assessment_type: '',
          assessment_result: '',
          notes: ''
        });
        fetchAssessments(); // Refresh the list
        showAlert({ type: 'success', title: 'Berhasil', message: 'Assessment berhasil diperbarui' });
      }
    } catch (err: any) {
      showAlert({ type: 'error', title: 'Gagal', message: err.message || 'Gagal memperbarui assessment' });
    }
  };

  const handleAddAssessment = (anakId: number) => {
    if (!anakId || isNaN(Number(anakId))) {
      showAlert({ type: 'error', title: 'Data Tidak Valid', message: 'ID tidak valid' });
      return;
    }
    setSelectedAnakId(anakId);
    setAddForm({
      assessment_date: '',
      assessment_type: '',
      assessment_result: '',
      notes: ''
    });
    setShowAddForm(true);
  };

  const handleCreateAssessment = async () => {
    if (!selectedAnakId || isNaN(Number(selectedAnakId))) {
      showAlert({ type: 'error', title: 'Data Tidak Valid', message: 'ID tidak valid' });
      return;
    }
    try {
      const response = await anakAPI.createAssessment(selectedAnakId, addForm);
      if (response.status === 'success') {
        setShowAddForm(false);
        setSelectedAnakId(null);
        setAddForm({
          assessment_date: '',
          assessment_type: '',
          assessment_result: '',
          notes: ''
        });
        fetchAssessments(); // Refresh the list
        showAlert({ type: 'success', title: 'Berhasil', message: 'Assessment berhasil dibuat' });
      }
    } catch (err: any) {
      showAlert({ type: 'error', title: 'Gagal', message: err.message || 'Gagal membuat assessment' });
    }
  };

  const handleDeleteAssessment = async () => {
    if (!selected || !selected.anak_id || isNaN(Number(selected.anak_id))) {
      showAlert({ type: 'error', title: 'Data Tidak Valid', message: 'ID tidak valid' });
      return;
    }
    setDeleteData({ anakId: selected.anak_id, assessmentId: selected.id });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAssessment = async () => {
    if (!deleteData) return;
    
    try {
      const response = await anakAPI.deleteAssessment(deleteData.anakId, deleteData.assessmentId);
      if (response.status === 'success') {
        setShowEditForm(false);
        setSelected(null);
        setEditForm({
          assessment_date: '',
          assessment_type: '',
          assessment_result: '',
          notes: ''
        });
        fetchAssessments(); // Refresh the list
        showAlert({ type: 'success', title: 'Berhasil', message: 'Assessment berhasil dihapus' });
      }
    } catch (err: any) {
      showAlert({ type: 'error', title: 'Gagal', message: err.message || 'Gagal menghapus assessment' });
    } finally {
      setShowDeleteConfirm(false);
      setDeleteData(null);
    }
  };

  const cancelDeleteAssessment = () => {
    setShowDeleteConfirm(false);
    setDeleteData(null);
  };

  const getAssessmentResultColor = (result: string) => {
    if (!result) return 'bg-gray-100 text-gray-600';
    const lowerResult = result.toLowerCase();
    if (lowerResult.includes('baik') || lowerResult.includes('excellent')) return 'bg-green-100 text-green-800';
    if (lowerResult.includes('sedang') || lowerResult.includes('good')) return 'bg-yellow-100 text-yellow-800';
    if (lowerResult.includes('perlu') || lowerResult.includes('poor')) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
         <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
       <div className="max-w-7xl mx-auto">

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari assessment atau nama anak..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={search}
                  onChange={e => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-64">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={e => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="created_at-desc">🕐 Terbaru</option>
                <option value="created_at-asc">🕐 Terlama</option>
                <option value="assessment_date-desc">📅 Tanggal Assessment (Terbaru)</option>
                <option value="assessment_date-asc">📅 Tanggal Assessment (Terlama)</option>
                <option value="full_name-asc">👶 Nama Anak (A-Z)</option>
                <option value="full_name-desc">👶 Nama Anak (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" text="Memuat assessment..." />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-800 font-medium text-lg mb-2">Oops! Terjadi kesalahan</p>
            <p className="text-red-600">{error}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-2">Tidak ada data assessment ditemukan</p>
            <p className="text-gray-500">Coba ubah kriteria pencarian atau tambahkan assessment baru</p>
          </div>
        ) : (
          <>
            {/* Assessment Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {data.map(anak => (
                <div key={anak.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{anak.full_name}</h3>
                        <p className="text-blue-100 text-sm">
                          {(anak.penilaian || []).length} Assessment{(anak.penilaian || []).length !== 1 ? 's' : ''}
                        </p>
                      </div>
                                             <Button
                         onClick={() => handleAddAssessment(anak.id)}
                         size="sm"
                         variant="secondary"
                         className="!bg-white !text-blue-600 hover:!bg-blue-50 px-4 py-2 text-sm font-medium shadow-none border border-gray-200"
                       >
                         <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                         </svg>
                         Tambah
                       </Button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    {(anak.penilaian || []).length > 0 ? (
                      <div className="space-y-4">
                        {(anak.penilaian || []).map(assessment => (
                          <div
                            key={assessment.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                            onClick={() => handleEditAssessment(assessment)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {assessment.assessment_type}
                              </h4>
                              <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l7 7-7 7" />
                              </svg>
                            </div>
                            
                            {assessment.assessment_date && (
                              <div className="flex items-center text-gray-500 text-sm mb-2">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(assessment.assessment_date).toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            )}
                            
                            <div className="mb-3">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAssessmentResultColor(assessment.assessment_result || '')}`}>
                                {assessment.assessment_result || 'Menunggu Penilaian'}
                              </span>
                            </div>
                            
                            {assessment.user_created && (
                              <div className="flex items-center text-gray-500 text-xs">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Oleh: {assessment.user_created.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <svg className="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-sm">Belum ada assessment</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.total > pagination.limit && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => setPage(p => Math.max(1, p - 1))} 
                      disabled={page === 1}
                      variant="secondary"
                      className="px-4 py-2 text-sm"
                    >
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Sebelumnya
                    </Button>
                    <Button 
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} 
                      disabled={page === pagination.totalPages}
                      variant="secondary"
                      className="px-4 py-2 text-sm"
                    >
                      Berikutnya
                      <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                    Halaman <span className="font-semibold text-blue-600">{pagination.page}</span> dari{' '}
                    <span className="font-semibold">{pagination.totalPages}</span>
                    <span className="text-gray-500 ml-2">
                      ({pagination.total} total item)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Assessment Edit Form Modal */}
        <Modal 
          isOpen={showEditForm} 
          onClose={() => {
            setShowEditForm(false);
            setSelected(null);
            setEditForm({
              assessment_date: '',
              assessment_type: '',
              assessment_result: '',
              notes: ''
            });
          }} 
          title="Edit Assessment"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Assessment
                </label>
                <input
                  type="date"
                  value={editForm.assessment_date}
                  onChange={e => setEditForm(prev => ({ ...prev, assessment_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jenis Assessment *
                </label>
                <input
                  type="text"
                  value={editForm.assessment_type}
                  onChange={e => setEditForm(prev => ({ ...prev, assessment_type: e.target.value }))}
                  placeholder="Contoh: Kognitif, Motorik, Bahasa"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hasil Assessment
              </label>
              <textarea
                value={editForm.assessment_result}
                onChange={e => setEditForm(prev => ({ ...prev, assessment_result: e.target.value }))}
                placeholder="Masukkan hasil assessment secara detail..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                value={editForm.notes}
                onChange={e => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Catatan tambahan tentang assessment..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="danger"
                onClick={handleDeleteAssessment}
                className="px-6 py-3 text-sm font-medium"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Hapus
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEditForm(false);
                    setSelected(null);
                    setEditForm({
                      assessment_date: '',
                      assessment_type: '',
                      assessment_result: '',
                      notes: ''
                    });
                  }}
                  className="px-6 py-3 text-sm font-medium"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleUpdateAssessment}
                  disabled={!editForm.assessment_type}
                  className="px-6 py-3 text-sm font-medium"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Assessment
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Assessment Add Form Modal */}
        <Modal 
          isOpen={showAddForm} 
          onClose={() => {
            setShowAddForm(false);
            setSelectedAnakId(null);
            setAddForm({
              assessment_date: '',
              assessment_type: '',
              assessment_result: '',
              notes: ''
            });
          }} 
          title="Tambah Assessment Baru"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Assessment
                </label>
                <input
                  type="date"
                  value={addForm.assessment_date}
                  onChange={e => setAddForm(prev => ({ ...prev, assessment_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jenis Assessment *
                </label>
                <input
                  type="text"
                  value={addForm.assessment_type}
                  onChange={e => setAddForm(prev => ({ ...prev, assessment_type: e.target.value }))}
                  placeholder="Contoh: Kognitif, Motorik, Bahasa"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hasil Assessment
              </label>
              <textarea
                value={addForm.assessment_result}
                onChange={e => setAddForm(prev => ({ ...prev, assessment_result: e.target.value }))}
                placeholder="Masukkan hasil assessment secara detail..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catatan
              </label>
              <textarea
                value={addForm.notes}
                onChange={e => setAddForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Catatan tambahan tentang assessment..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedAnakId(null);
                  setAddForm({
                    assessment_date: '',
                    assessment_type: '',
                    assessment_result: '',
                    notes: ''
                  });
                }}
                className="px-6 py-3 text-sm font-medium"
              >
                Batal
              </Button>
              <Button
                onClick={handleCreateAssessment}
                disabled={!addForm.assessment_type}
                className="px-6 py-3 text-sm font-medium"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Buat Assessment
              </Button>
            </div>
          </div>
        </Modal>

        {/* Confirm Delete Modal */}
        <Modal
          isOpen={showDeleteConfirm}
          onClose={cancelDeleteAssessment}
          title="Konfirmasi Hapus Assessment"
          size="sm"
        >
          <div className="space-y-4 text-center">
            <p className="text-gray-800">Apakah Anda yakin ingin menghapus assessment ini?</p>
            <div className="flex justify-center gap-3">
              <Button variant="danger" onClick={confirmDeleteAssessment} className="px-6 py-3 text-sm font-medium">
                Hapus
              </Button>
              <Button variant="secondary" onClick={cancelDeleteAssessment} className="px-6 py-3 text-sm font-medium">
                Batal
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AssessmentList;