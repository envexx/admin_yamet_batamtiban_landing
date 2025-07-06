import React, { useState, useEffect } from 'react';
import { programTerapiAPI } from '../../services/api';
import { AnakWithProgramTerapi, CreateProgramTerapiData, UpdateProgramTerapiData } from '../../types';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import Modal from '../UI/Modal';

const ProgramTerapiList: React.FC = () => {
  const [data, setData] = useState<AnakWithProgramTerapi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState<any>(null);

  // Modal states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedAnakId, setSelectedAnakId] = useState<number | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [addForm, setAddForm] = useState<CreateProgramTerapiData>({
    program_name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'AKTIF'
  });
  const [editForm, setEditForm] = useState<UpdateProgramTerapiData>({
    program_name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'AKTIF'
  });

  const fetchProgramTerapi = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await programTerapiAPI.getAllGrouped({
        page,
        limit: 10,
        search,
        sortBy,
        sortOrder
      });
      
      if (response.status === 'success') {
        setData(response.data);
        setPagination(response.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data program terapi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgramTerapi();
  }, [page, search, sortBy, sortOrder]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleAddProgram = (anakId: number) => {
    setSelectedAnakId(anakId);
    setAddForm({
      program_name: '',
      description: '',
      start_date: '',
      end_date: '',
      status: 'AKTIF'
    });
    setShowAddForm(true);
  };

  const handleEditProgram = (program: any) => {
    setSelectedProgram(program);
    setEditForm({
      program_name: program.program_name,
      description: program.description || '',
      start_date: program.start_date ? program.start_date.split('T')[0] : '',
      end_date: program.end_date ? program.end_date.split('T')[0] : '',
      status: program.status
    });
    setShowEditForm(true);
  };

  const handleCreateProgram = async () => {
    if (!selectedAnakId) return;
    
    try {
      const response = await programTerapiAPI.create(selectedAnakId, addForm);
      if (response.status === 'success') {
        setShowAddForm(false);
        setSelectedAnakId(null);
        setAddForm({
          program_name: '',
          description: '',
          start_date: '',
          end_date: '',
          status: 'AKTIF'
        });
        fetchProgramTerapi();
        alert('Program terapi berhasil dibuat');
      }
    } catch (err: any) {
      alert(err.message || 'Gagal membuat program terapi');
    }
  };

  const handleUpdateProgram = async () => {
    if (!selectedProgram) return;
    
    try {
      const response = await programTerapiAPI.update(selectedProgram.anak_id, selectedProgram.id, editForm);
      if (response.status === 'success') {
        setShowEditForm(false);
        setSelectedProgram(null);
        setEditForm({
          program_name: '',
          description: '',
          start_date: '',
          end_date: '',
          status: 'AKTIF'
        });
        fetchProgramTerapi();
        alert('Program terapi berhasil diperbarui');
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui program terapi');
    }
  };

  const handleDeleteProgram = async (anakId: number, programId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus program terapi ini?')) {
      return;
    }
    
    try {
      const response = await programTerapiAPI.delete(anakId, programId);
      if (response.status === 'success') {
        fetchProgramTerapi();
        alert('Program terapi berhasil dihapus');
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus program terapi');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AKTIF':
        return 'bg-green-100 text-green-800';
      case 'SELESAI':
        return 'bg-blue-100 text-blue-800';
      case 'DIBATALKAN':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
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
                  placeholder="Cari program terapi atau nama anak..."
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
                <option value="full_name-asc">👶 Nama Anak (A-Z)</option>
                <option value="full_name-desc">👶 Nama Anak (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="lg" text="Memuat program terapi..." />
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
            <p className="text-gray-600 text-lg mb-2">Tidak ada data program terapi ditemukan</p>
            <p className="text-gray-500">Coba ubah kriteria pencarian atau tambahkan program terapi baru</p>
          </div>
        ) : (
          <>
            {/* Program Terapi Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {data.map(anak => (
                <div key={anak.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{anak.full_name}</h3>
                        <p className="text-purple-100 text-sm">
                          {(anak.program_terapi || []).length} Program{(anak.program_terapi || []).length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleAddProgram(anak.id)}
                        size="sm"
                        variant="secondary"
                        className="!bg-white !text-purple-600 hover:!bg-purple-50 px-4 py-2 text-sm font-medium shadow-none border border-gray-200"
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
                    {(anak.program_terapi || []).length > 0 ? (
                      <div className="space-y-4">
                        {(anak.program_terapi || []).map(program => (
                          <div
                            key={program.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                            onClick={() => handleEditProgram(program)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                {program.program_name}
                              </h4>
                              <svg className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l7 7-7 7" />
                              </svg>
                            </div>
                            
                            {program.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {program.description}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center text-gray-500 text-sm">
                                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(program.start_date).toLocaleDateString('id-ID')} - {new Date(program.end_date).toLocaleDateString('id-ID')}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                                {program.status}
                              </span>
                              
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProgram(program.anak_id, program.id);
                                }}
                                className="!px-2 !py-1 text-xs"
                              >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Button>
                            </div>
                            
                            {program.user_created && (
                              <div className="flex items-center text-gray-500 text-xs mt-2">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Oleh: {program.user_created.name}
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
                        <p className="text-gray-500 text-sm">Belum ada program terapi</p>
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
                    Halaman <span className="font-semibold text-purple-600">{pagination.page}</span> dari{' '}
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

        {/* Edit Program Terapi Modal */}
        <Modal 
          isOpen={showEditForm} 
          onClose={() => {
            setShowEditForm(false);
            setSelectedProgram(null);
            setEditForm({
              program_name: '',
              description: '',
              start_date: '',
              end_date: '',
              status: 'AKTIF'
            });
          }} 
          title="Edit Program Terapi"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Program *
                  </label>
                  <select
                    value={editForm.program_name}
                    onChange={e => setEditForm(prev => ({ ...prev, program_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Pilih jenis program terapi</option>
                    <option value="BT">BT - Behavioral Therapy</option>
                    <option value="OT">OT - Occupational Therapy</option>
                    <option value="TW">TW - Terapi Wicara</option>
                    <option value="SI">SI - Sensory Integration</option>
                    <option value="CBT">CBT - Cognitive Behavioral Therapy</option>
                  </select>
                </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="SELESAI">SELESAI</option>
                  <option value="DIBATALKAN">DIBATALKAN</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={editForm.description}
                onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi program terapi..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={editForm.start_date}
                  onChange={e => setEditForm(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={editForm.end_date}
                  onChange={e => setEditForm(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="danger"
                onClick={() => {
                  if (selectedProgram) {
                    handleDeleteProgram(selectedProgram.anak_id, selectedProgram.id);
                  }
                }}
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
                    setSelectedProgram(null);
                    setEditForm({
                      program_name: '',
                      description: '',
                      start_date: '',
                      end_date: '',
                      status: 'AKTIF'
                    });
                  }}
                  className="px-6 py-3 text-sm font-medium"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleUpdateProgram}
                  disabled={!editForm.program_name}
                  className="px-6 py-3 text-sm font-medium"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Program
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/* Add Program Terapi Modal */}
        <Modal 
          isOpen={showAddForm} 
          onClose={() => {
            setShowAddForm(false);
            setSelectedAnakId(null);
            setAddForm({
              program_name: '',
              description: '',
              start_date: '',
              end_date: '',
              status: 'AKTIF'
            });
          }} 
          title="Tambah Program Terapi Baru"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Program *
                  </label>
                  <select
                    value={addForm.program_name}
                    onChange={e => setAddForm(prev => ({ ...prev, program_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Pilih jenis program terapi</option>
                    <option value="BT">BT - Behavioral Therapy</option>
                    <option value="OT">OT - Occupational Therapy</option>
                    <option value="TW">TW - Terapi Wicara</option>
                    <option value="SI">SI - Sensory Integration</option>
                    <option value="CBT">CBT - Cognitive Behavioral Therapy</option>
                  </select>
                </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={addForm.status}
                  onChange={e => setAddForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="SELESAI">SELESAI</option>
                  <option value="DIBATALKAN">DIBATALKAN</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={addForm.description}
                onChange={e => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi program terapi..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={addForm.start_date}
                  onChange={e => setAddForm(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  value={addForm.end_date}
                  onChange={e => setAddForm(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedAnakId(null);
                  setAddForm({
                    program_name: '',
                    description: '',
                    start_date: '',
                    end_date: '',
                    status: 'AKTIF'
                  });
                }}
                className="px-6 py-3 text-sm font-medium"
              >
                Batal
              </Button>
              <Button
                onClick={handleCreateProgram}
                disabled={!addForm.program_name}
                className="px-6 py-3 text-sm font-medium"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Buat Program
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProgramTerapiList; 