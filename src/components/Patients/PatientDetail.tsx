import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { anakAPI, programTerapiAPI } from '../../services/api';
import { AnakDetail } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';
import Modal from '../UI/Modal';
import SurveyForm from './SurveyForm';
import RiwayatMedisForm from './RiwayatMedisForm';
import { ArrowLeft, User, Users, FileText, Heart, Brain, Calendar, Download, ChevronDown, ChevronUp, ClipboardList, Stethoscope } from 'lucide-react';
import AssessmentList from './AssessmentList';
import { Assessment, AssessmentForm } from '../../types';
import Button from '../UI/Button';

type DetailModalType = 'kehamilan' | 'kelahiran' | 'imunisasi' | 'penyakit' | 'perkembangan' | 'oral' | 'sosial';

const AnakDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anak, setAnak] = useState<AnakDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [showPerilakuModal, setShowPerilakuModal] = useState(false);
  const [showPerkembanganModal, setShowPerkembanganModal] = useState(false);
  const [showDokumenModal, setShowDokumenModal] = useState(false);
  
  // Form states
  const [showSurveyForm, setShowSurveyForm] = useState(false);
  const [showRiwayatForm, setShowRiwayatForm] = useState(false);
  const [editingSurvey, setEditingSurvey] = useState<unknown | null>(null);
  const [editingRiwayat, setEditingRiwayat] = useState<unknown | null>(null);
  
  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState<{
    basicInfo: boolean;
    parents: boolean;
    survey: boolean;
    medical: boolean;
    development: boolean;
    behavior: boolean;
    documents: boolean;
    pemeriksaanSebelumnya: boolean;
    terapiSebelumnya: boolean;
    riwayatPendidikan: boolean;
  }>({
    basicInfo: true,
    parents: true,
    survey: true,
    medical: false,
    development: false,
    behavior: false,
    documents: false,
    pemeriksaanSebelumnya: false,
    terapiSebelumnya: false,
    riwayatPendidikan: false
  });
  
  const navigate = useNavigate();

  // Ganti deklarasi state detailModal menjadi:
  const [detailModal, setDetailModal] = useState<null | { 
    group: 'medis' | 'perkembangan'; 
    tab: DetailModalType; 
    title: string; 
  }>(null);

  // Tambahkan state untuk tab aktif
  const [activeTab, setActiveTab] = useState<DetailModalType | null>(null);

  // Assessment Management
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [assessmentForm, setAssessmentForm] = useState<AssessmentForm>({
    assessment_date: '',
    assessment_type: '',
    assessment_result: '',
    notes: ''
  });

  // Program Terapi Management
  const [programTerapi, setProgramTerapi] = useState<any[]>([]);
  const [programTerapiLoading, setProgramTerapiLoading] = useState(false);
  const [showProgramTerapiForm, setShowProgramTerapiForm] = useState(false);
  const [editingProgramTerapi, setEditingProgramTerapi] = useState<any>(null);
  const [programTerapiForm, setProgramTerapiForm] = useState({
    program_name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'AKTIF' as 'AKTIF' | 'SELESAI' | 'DIBATALKAN'
  });

  // Ubah openDetailModal agar menerima group dan tab
  const openDetailModal = (group: 'medis' | 'perkembangan', tab: DetailModalType, title: string) => {
    setDetailModal({ group, tab, title });
    setActiveTab(tab);
  };
  const closeDetailModal = () => {
    setDetailModal(null);
    setActiveTab(null);
  };

  useEffect(() => {
    fetchAnakDetail();
    // eslint-disable-next-line
  }, [id]);

  const fetchAnakDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await anakAPI.getById(Number(id));
      if (response.status === 'success' && response.data) {
        setAnak(response.data);
      } else {
        setError(response.message || 'Gagal memuat data anak');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data anak');
    } finally {
      setLoading(false);
    }
  };

  const handleSurveyFormSuccess = () => {
    setShowSurveyForm(false);
    setEditingSurvey(null);
    fetchAnakDetail();
  };

  const handleRiwayatFormSuccess = () => {
    setShowRiwayatForm(false);
    setEditingRiwayat(null);
    fetchAnakDetail();
  };

  // Fungsi-fungsi ini di-comment karena tidak digunakan saat ini
  // const handleAddSurvey = () => {
  //   setEditingSurvey(null);
  //   setShowSurveyForm(true);
  // };

  // const handleEditSurvey = () => {
  //   setEditingSurvey(anak?.survey_awal || null);
  //   setShowSurveyForm(true);
  // };

  // const handleAddRiwayat = () => {
  //   setEditingRiwayat(null);
  //   setShowRiwayatForm(true);
  // };

  // const handleEditRiwayat = () => {
  //   setEditingRiwayat(anak?.riwayat_kehamilan || null);
  //   setShowRiwayatForm(true);
  // };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  function formatDate(dateString?: string) {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Fungsi ini di-comment karena tidak digunakan saat ini
  // function getStatusBadge(status: boolean | undefined) {
  //   if (status) {
  //     return (
  //       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  //         Aktif
  //       </span>
  //     );
  //   } else {
  //     return (
  //       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
  //         Tidak Aktif
  //       </span>
  //     );
  //   }
  // }

  // Fungsi download file lampiran sederhana
  function downloadLampiran(filename: string) {
    // Menggunakan endpoint sederhana sesuai dokumentasi baru
    const downloadUrl = `/api/lampiran/${filename}`;
    
    // Method 1: Menggunakan window.open (lebih sederhana)
    window.open(downloadUrl, '_blank');
    
    // Method 2: Menggunakan fetch (alternatif)
    // fetch(downloadUrl)
    //   .then(response => {
    //     if (response.ok) {
    //       return response.blob();
    //     }
    //     throw new Error('Gagal mengunduh file');
    //   })
    //   .then(blob => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = filename.replace(/^\d+-/, ''); // Remove timestamp
    //     document.body.appendChild(a);
    //     a.click();
    //     window.URL.revokeObjectURL(url);
    //     document.body.removeChild(a);
    //   })
    //   .catch(error => {
    //     console.error('Error downloading file:', error);
    //     alert('Gagal mengunduh file');
    //   });
  }

  // Fungsi untuk mendapatkan filename dari URL
  function getFileNameFromUrl(url: string): string {
    try {
      return url.split('/').pop() || 'lampiran';
    } catch {
      return 'lampiran';
    }
  }

  // Fetch assessments for this child
  const fetchAssessments = async () => {
    if (!anak?.id) return;
    
    setAssessmentLoading(true);
    try {
      const response = await anakAPI.getAssessment(anak.id);
      if (response.status === 'success') {
        setAssessments(response.data || []);
      }
    } catch (err: any) {
      console.error('Error fetching assessments:', err);
    } finally {
      setAssessmentLoading(false);
    }
  };

  // Create new assessment
  const handleCreateAssessment = async () => {
    if (!anak?.id) return;
    
    try {
      const response = await anakAPI.createAssessment(anak.id, assessmentForm);
      if (response.status === 'success') {
        setShowAssessmentForm(false);
        setAssessmentForm({
          assessment_date: '',
          assessment_type: '',
          assessment_result: '',
          notes: ''
        });
        fetchAssessments();
        alert('Assessment berhasil dibuat');
      }
          } catch (err: any) {
        alert(err.message || 'Gagal membuat assessment');
      }
  };

  // Update assessment
  const handleUpdateAssessment = async () => {
    if (!anak?.id || !editingAssessment) return;
    
    try {
      const response = await anakAPI.updateAssessment(anak.id, editingAssessment.id, assessmentForm);
      if (response.status === 'success') {
        setShowAssessmentForm(false);
        setEditingAssessment(null);
        setAssessmentForm({
          assessment_date: '',
          assessment_type: '',
          assessment_result: '',
          notes: ''
        });
        fetchAssessments();
        alert('Assessment berhasil diperbarui');
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui assessment');
    }
  };

  // Delete assessment
  const handleDeleteAssessment = async (assessmentId: number) => {
    if (!anak?.id) return;
    
    if (window.confirm('Apakah Anda yakin ingin menghapus assessment ini?')) {
      try {
        const response = await anakAPI.deleteAssessment(anak.id, assessmentId);
        if (response.status === 'success') {
          fetchAssessments();
          alert('Assessment berhasil dihapus');
        }
      } catch (err: any) {
        alert(err.message || 'Gagal menghapus assessment');
      }
    }
  };

  // Edit assessment
  const handleEditAssessment = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setAssessmentForm({
      assessment_date: assessment.assessment_date.split('T')[0],
      assessment_type: assessment.assessment_type,
      assessment_result: assessment.assessment_result || '',
      notes: assessment.notes || ''
    });
    setShowAssessmentForm(true);
  };

  // Fetch program terapi for this child
  const fetchProgramTerapi = async () => {
    if (!anak?.id) return;
    
    setProgramTerapiLoading(true);
    try {
      const response = await programTerapiAPI.getByAnakId(anak.id);
      if (response.status === 'success') {
        setProgramTerapi(response.data || []);
      }
    } catch (err: any) {
      console.error('Error fetching program terapi:', err);
    } finally {
      setProgramTerapiLoading(false);
    }
  };

  // Create new program terapi
  const handleCreateProgramTerapi = async () => {
    if (!anak?.id) return;
    
    try {
      const response = await programTerapiAPI.create(anak.id, programTerapiForm);
      if (response.status === 'success') {
        setShowProgramTerapiForm(false);
        setProgramTerapiForm({
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

  // Update program terapi
  const handleUpdateProgramTerapi = async () => {
    if (!anak?.id || !editingProgramTerapi) return;
    
    try {
      const response = await programTerapiAPI.update(anak.id, editingProgramTerapi.id, programTerapiForm);
      if (response.status === 'success') {
        setShowProgramTerapiForm(false);
        setEditingProgramTerapi(null);
        setProgramTerapiForm({
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

  // Delete program terapi
  const handleDeleteProgramTerapi = async (programId: number) => {
    if (!anak?.id) return;
    
    if (!confirm('Apakah Anda yakin ingin menghapus program terapi ini?')) {
      return;
    }
    
    try {
      const response = await programTerapiAPI.delete(anak.id, programId);
      if (response.status === 'success') {
        fetchProgramTerapi();
        alert('Program terapi berhasil dihapus');
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus program terapi');
    }
  };

  // Edit program terapi
  const handleEditProgramTerapi = (program: any) => {
    setEditingProgramTerapi(program);
    setProgramTerapiForm({
      program_name: program.program_name,
      description: program.description || '',
      start_date: program.start_date ? program.start_date.split('T')[0] : '',
      end_date: program.end_date ? program.end_date.split('T')[0] : '',
      status: program.status
    });
    setShowProgramTerapiForm(true);
  };

  useEffect(() => {
    if (anak?.id) {
      fetchAssessments();
      fetchProgramTerapi();
    }
  }, [anak?.id]);

  // Component definitions
  const InfoCard = ({ icon: Icon, title, children, sectionKey }: {
    icon: any;
    title: string;
    children: React.ReactNode;
    sectionKey: keyof typeof expandedSections;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
        onClick={() => toggleSection(sectionKey)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          {expandedSections[sectionKey] ? 
            <ChevronUp className="w-5 h-5 text-gray-500" /> : 
            <ChevronDown className="w-5 h-5 text-gray-500" />
          }
        </div>
      </div>
      {expandedSections[sectionKey] && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  );

  const DataField = ({ label, value, type = "text" }: any) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="text-base text-gray-900">
        {type === "boolean" ? (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value ? 'Ya' : 'Tidak'}
          </span>
        ) : type === "array" ? (
          <span className="text-gray-900">{Array.isArray(value) ? value.join(', ') : value || '-'}</span>
        ) : (
          <span className="text-gray-900">{value || '-'}</span>
        )}
      </div>
    </div>
  );

  const StatusBadge = ({ status }: any) => {
    let colorClass = 'bg-gray-100 text-gray-800';
    let label = status;
    if (status === 'AKTIF') {
      colorClass = 'bg-green-100 text-green-800';
      label = 'Aktif';
    } else if (status === 'BERHENTI') {
      colorClass = 'bg-red-100 text-red-800';
      label = 'Berhenti';
    } else if (status === 'CUTI') {
      colorClass = 'bg-yellow-100 text-yellow-800';
      label = 'Cuti';
    } else if (status === 'LULUS') {
      colorClass = 'bg-blue-100 text-blue-800';
      label = 'Lulus';
    }
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
        {label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" text="Memuat detail anak..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <h2 className="font-bold mb-2">Terjadi Kesalahan</h2>
        <p>{error}</p>
        <p className="mt-2 text-xs text-gray-700">Cek koneksi, pastikan token login valid, dan backend mengembalikan data sesuai skema. Jika error authentication, silakan login ulang.</p>
      </div>
    );
  }

  if (!anak) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
        <h2 className="font-bold mb-2">Data Tidak Ditemukan</h2>
        <p>Data anak tidak ditemukan atau response backend tidak sesuai. Silakan cek API dan token akses Anda.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <button 
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Kembali</span>
                </button>
                <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{anak.full_name || '-'}</h1>
                <p className="text-sm text-gray-600">Nomor Anak: {anak.nomor_anak}</p>
              </div>
            </div>
            <div className="mt-2 sm:mt-0">
              <StatusBadge status={anak.status || 'Tidak Aktif'} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Usia</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {anak.birth_date ? (new Date().getFullYear() - new Date(anak.birth_date).getFullYear()) : '-'} tahun
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mulai Terapi</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {anak.mulai_terapi ? new Date(anak.mulai_terapi).toLocaleDateString('id-ID') : '-'}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Anak Ke</p>
                  <p className="text-2xl font-semibold text-gray-900">{anak.anak_ke || '-'}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sekolah</p>
                  <p className="text-lg font-semibold text-gray-900">{anak.sekolah_kelas || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Anak */}
          <InfoCard
            icon={User}
            title="Data Anak"
            sectionKey="basicInfo"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DataField label="Nama Lengkap" value={anak.full_name || '-'} />
              <DataField label="Nama Panggilan" value={anak.nick_name} />
              <DataField label="Tanggal Lahir" value={formatDate(anak.birth_date || undefined)} />
              <DataField label="Tempat Lahir" value={anak.birth_place} />
              <DataField label="Jenis Kelamin" value={
                anak.jenis_kelamin === 'LAKI_LAKI' || anak.jenis_kelamin === 'laki_laki'
                  ? 'Laki-laki'
                  : anak.jenis_kelamin === 'PEREMPUAN' || anak.jenis_kelamin === 'perempuan'
                  ? 'Perempuan'
                  : '-'
              } />
              <DataField label="Kewarganegaraan" value={anak.kewarganegaraan} />
              <DataField label="Agama" value={anak.agama} />
              <DataField label="Anak Ke" value={anak.anak_ke} />
              <DataField label="Sekolah/Kelas" value={anak.sekolah_kelas} />
              <DataField label="Tanggal Pemeriksaan" value={formatDate(anak.tanggal_pemeriksaan || undefined)} />
              <DataField label="Mulai Terapi" value={formatDate(anak.mulai_terapi || undefined)} />
              <DataField label="Selesai Terapi" value={formatDate(anak.selesai_terapi || undefined)} />
              <DataField label="Mulai Cuti" value={formatDate(anak.mulai_cuti || undefined)} />
              <DataField label="Dibuat Oleh" value={anak.user_created?.name} />
              <DataField label="Dibuat Pada" value={formatDate(anak.created_at || undefined)} />
              <DataField label="Diupdate Pada" value={formatDate(anak.updated_at || undefined)} />
            </div>
          </InfoCard>

          {/* Data Orang Tua */}
          <InfoCard
            icon={Users}
            title="Data Orang Tua"
            sectionKey="parents"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Data Ayah */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Data Ayah
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DataField label="Nama" value={anak.ayah?.nama} />
                  <DataField label="Tempat Lahir" value={anak.ayah?.tempat_lahir} />
                  <DataField label="Tanggal Lahir" value={formatDate(anak.ayah?.tanggal_lahir || undefined)} />
                  <DataField label="Usia" value={anak.ayah?.usia ? `${anak.ayah.usia} tahun` : '-'} />
                  <DataField label="Agama" value={anak.ayah?.agama} />
                  <DataField label="Pendidikan" value={anak.ayah?.pendidikan_terakhir} />
                  <DataField label="Pekerjaan" value={anak.ayah?.pekerjaan_saat_ini} />
                  <DataField label="Telepon" value={anak.ayah?.telepon} />
                  <DataField label="Email" value={anak.ayah?.email} />
                  <DataField label="Alamat" value={anak.ayah?.alamat_rumah} />
                </div>
              </div>

              {/* Data Ibu */}
              <div className="bg-pink-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-pink-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Data Ibu
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DataField label="Nama" value={anak.ibu?.nama} />
                  <DataField label="Tempat Lahir" value={anak.ibu?.tempat_lahir} />
                  <DataField label="Tanggal Lahir" value={formatDate(anak.ibu?.tanggal_lahir || undefined)} />
                  <DataField label="Usia" value={anak.ibu?.usia ? `${anak.ibu.usia} tahun` : '-'} />
                  <DataField label="Agama" value={anak.ibu?.agama} />
                  <DataField label="Pendidikan" value={anak.ibu?.pendidikan_terakhir} />
                  <DataField label="Pekerjaan" value={anak.ibu?.pekerjaan_saat_ini} />
                  <DataField label="Telepon" value={anak.ibu?.telepon} />
                  <DataField label="Email" value={anak.ibu?.email} />
                  <DataField label="Alamat" value={anak.ibu?.alamat_rumah} />
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Survey Awal */}
          <InfoCard
            icon={FileText}
            title="Survey Awal"
            sectionKey="survey"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DataField label="Mengetahui YAMET Dari" value={anak.survey_awal?.mengetahui_yamet_dari} />
                <DataField label="Penjelasan Mekanisme" value={anak.survey_awal?.penjelasan_mekanisme} type="boolean" />
                <DataField label="Bersedia Online" value={anak.survey_awal?.bersedia_online} type="boolean" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-3">Keluhan Orang Tua</h4>
                  <div className="space-y-2">
                    {anak.survey_awal?.keluhan_orang_tua?.map((keluhan: string, idx: number) => (
                      <span key={idx} className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                        {keluhan}
                      </span>
                    )) || <span className="text-gray-500">Tidak ada keluhan</span>}
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-3">Tindakan Orang Tua</h4>
                  <div className="space-y-2">
                    {anak.survey_awal?.tindakan_orang_tua?.map((tindakan: string, idx: number) => (
                      <span key={idx} className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                        {tindakan}
                      </span>
                    )) || <span className="text-gray-500">Tidak ada tindakan</span>}
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 mb-3">Kendala</h4>
                  <div className="space-y-2">
                    {anak.survey_awal?.kendala?.map((kendala: string, idx: number) => (
                      <span key={idx} className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                        {kendala}
                      </span>
                    )) || <span className="text-gray-500">Tidak ada kendala</span>}
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Program Terapi */}
          <InfoCard
            icon={Stethoscope}
            title="Program Terapi"
            sectionKey="terapiSebelumnya"
          >
            <div className="mb-4 flex justify-between items-center">
              <span className="text-gray-700 font-medium">Daftar Program Terapi Anak</span>
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingProgramTerapi(null);
                  setShowProgramTerapiForm(true);
                  setProgramTerapiForm({
                    program_name: '',
                    description: '',
                    start_date: '',
                    end_date: '',
                    status: 'AKTIF'
                  });
                }}
                className="!bg-white !text-purple-600 hover:!bg-purple-50 px-4 py-2 text-sm font-medium shadow-none border border-gray-200"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Program
              </Button>
            </div>
            {programTerapiLoading ? (
              <div className="py-8 text-center">
                <LoadingSpinner size="md" text="Memuat program terapi..." />
              </div>
            ) : programTerapi.length === 0 ? (
              <div className="py-8 text-center text-gray-500">Belum ada program terapi</div>
            ) : (
              <div className="space-y-4">
                {programTerapi.map((program) => (
                  <div
                    key={program.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                    onClick={() => handleEditProgramTerapi(program)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {program.program_name}
                      </h4>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${program.status === 'AKTIF' ? 'bg-green-100 text-green-800' : program.status === 'SELESAI' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {program.status}
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm mb-2 line-clamp-2">{program.description}</div>
                    <div className="flex items-center text-gray-500 text-xs mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(program.start_date).toLocaleDateString('id-ID')} - {new Date(program.end_date).toLocaleDateString('id-ID')}
                    </div>
                    {program.user_created && (
                      <div className="flex items-center text-gray-500 text-xs mt-1">
                        <User className="h-3 w-3 mr-1" />
                        Oleh: {program.user_created.name}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteProgramTerapi(program.id);
                        }}
                        className="!px-2 !py-1 text-xs"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal Tambah/Edit Program Terapi */}
            <Modal
              isOpen={showProgramTerapiForm}
              onClose={() => {
                setShowProgramTerapiForm(false);
                setEditingProgramTerapi(null);
                setProgramTerapiForm({
                  program_name: '',
                  description: '',
                  start_date: '',
                  end_date: '',
                  status: 'AKTIF'
                });
              }}
              title={editingProgramTerapi ? 'Edit Program Terapi' : 'Tambah Program Terapi'}
              size="lg"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Program *
                    </label>
                    <select
                      value={programTerapiForm.program_name}
                      onChange={e => setProgramTerapiForm(prev => ({ ...prev, program_name: e.target.value }))}
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
                      value={programTerapiForm.status}
                      onChange={e => setProgramTerapiForm(prev => ({ ...prev, status: e.target.value as any }))}
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
                    value={programTerapiForm.description}
                    onChange={e => setProgramTerapiForm(prev => ({ ...prev, description: e.target.value }))}
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
                      value={programTerapiForm.start_date}
                      onChange={e => setProgramTerapiForm(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tanggal Selesai
                    </label>
                    <input
                      type="date"
                      value={programTerapiForm.end_date}
                      onChange={e => setProgramTerapiForm(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowProgramTerapiForm(false);
                      setEditingProgramTerapi(null);
                      setProgramTerapiForm({
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
                    onClick={editingProgramTerapi ? handleUpdateProgramTerapi : handleCreateProgramTerapi}
                    disabled={!programTerapiForm.program_name}
                    className="px-6 py-3 text-sm font-medium"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingProgramTerapi ? 'Update Program' : 'Buat Program'}
                  </Button>
                </div>
              </div>
            </Modal>
          </InfoCard>

          {/* Riwayat Medis */}
          <InfoCard
            icon={Heart}
            title="Riwayat Medis"
            sectionKey="medical"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-green-900 mb-2">Riwayat Kehamilan</h4>
                <p className="text-sm text-green-700">Data lengkap tersedia</p>
                <button className="mt-2 text-green-600 hover:text-green-800 text-sm font-medium" onClick={() => openDetailModal('medis', 'kehamilan', 'Riwayat Kehamilan')}>
                  Lihat Detail →
                </button>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-blue-900 mb-2">Riwayat Kelahiran</h4>
                <p className="text-sm text-blue-700">Data lengkap tersedia</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium" onClick={() => openDetailModal('medis', 'kelahiran', 'Riwayat Kelahiran')}>
                  Lihat Detail →
                </button>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-purple-900 mb-2">Riwayat Imunisasi</h4>
                <p className="text-sm text-purple-700">Data lengkap tersedia</p>
                <button className="mt-2 text-purple-600 hover:text-purple-800 text-sm font-medium" onClick={() => openDetailModal('medis', 'imunisasi', 'Riwayat Imunisasi')}>
                  Lihat Detail →
                </button>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-orange-900 mb-2">Penyakit Diderita</h4>
                <p className="text-sm text-orange-700">Data lengkap tersedia</p>
                <button className="mt-2 text-orange-600 hover:text-orange-800 text-sm font-medium" onClick={() => openDetailModal('medis', 'penyakit', 'Penyakit Diderita')}>
                  Lihat Detail →
                </button>
              </div>
            </div>
          </InfoCard>

          {/* Perkembangan */}
          <InfoCard
            icon={Brain}
            title="Perkembangan & Perilaku"
            sectionKey="development"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-indigo-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-indigo-900 mb-2">Perkembangan Anak</h4>
                <p className="text-sm text-indigo-700">Milestone perkembangan</p>
                <button className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium" onClick={() => openDetailModal('perkembangan', 'perkembangan', 'Perkembangan Anak')}>
                  Lihat Detail →
                </button>
              </div>
              <div className="bg-teal-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-teal-900 mb-2">Perilaku Oral Motor</h4>
                <p className="text-sm text-teal-700">Kemampuan makan & minum</p>
                <button className="mt-2 text-teal-600 hover:text-teal-800 text-sm font-medium" onClick={() => openDetailModal('perkembangan', 'oral', 'Perilaku Oral Motor')}>
                  Lihat Detail →
                </button>
              </div>
              <div className="bg-rose-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-rose-900 mb-2">Perkembangan Sosial</h4>
                <p className="text-sm text-rose-700">Interaksi sosial</p>
                <button className="mt-2 text-rose-600 hover:text-rose-800 text-sm font-medium" onClick={() => openDetailModal('perkembangan', 'sosial', 'Perkembangan Sosial')}>
                  Lihat Detail →
                </button>
              </div>
            </div>
          </InfoCard>

          {/* Riwayat Pendidikan */}
          <InfoCard
            icon={FileText}
            title="Riwayat Pendidikan"
            sectionKey="riwayatPendidikan"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DataField label="Mulai Sekolah Formal (Usia)" value={anak.riwayat_pendidikan?.mulai_sekolah_formal_usia} />
              <DataField label="Mulai Sekolah Informal (Usia)" value={anak.riwayat_pendidikan?.mulai_sekolah_informal_usia} />
              <DataField label="Sekolah Formal Diikuti" value={anak.riwayat_pendidikan?.sekolah_formal_diikuti} />
              <DataField label="Sekolah Informal Diikuti" value={anak.riwayat_pendidikan?.sekolah_informal_diikuti} />
              <DataField label="Bimbingan Belajar" value={anak.riwayat_pendidikan?.bimbingan_belajar} type="boolean" />
              <DataField label="Belajar Membaca Sendiri" value={anak.riwayat_pendidikan?.belajar_membaca_sendiri} type="boolean" />
              <DataField label="Belajar Dibacakan Ortu" value={anak.riwayat_pendidikan?.belajar_dibacakan_ortu} type="boolean" />
              <DataField label="Nilai Rata-rata Sekolah" value={anak.riwayat_pendidikan?.nilai_rata_rata_sekolah} />
              <DataField label="Nilai Tertinggi (Mapel)" value={anak.riwayat_pendidikan?.nilai_tertinggi_mapel} />
              <DataField label="Nilai Tertinggi (Nilai)" value={anak.riwayat_pendidikan?.nilai_tertinggi_nilai} />
              <DataField label="Nilai Terendah (Mapel)" value={anak.riwayat_pendidikan?.nilai_terendah_mapel} />
              <DataField label="Nilai Terendah (Nilai)" value={anak.riwayat_pendidikan?.nilai_terendah_nilai} />
              <div className="flex flex-col space-y-1 col-span-full">
                <label className="text-sm font-medium text-gray-600">Keluhan Guru</label>
                <div className="flex flex-wrap gap-2">
                  {anak.riwayat_pendidikan?.keluhan_guru && anak.riwayat_pendidikan.keluhan_guru.length > 0 ? (
                    anak.riwayat_pendidikan.keluhan_guru.map((keluhan: string, idx: number) => (
                      <span key={idx} className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">{keluhan}</span>
                    ))
                  ) : (
                    <span className="text-gray-500">Tidak ada keluhan</span>
                  )}
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Dokumen & Lampiran */}
          <InfoCard
            icon={FileText}
            title="Dokumen & Lampiran"
            sectionKey="documents"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Hasil EEG', available: !!anak.lampiran?.hasil_eeg_url, url: anak.lampiran?.hasil_eeg_url },
                { name: 'Hasil BERA', available: !!anak.lampiran?.hasil_bera_url, url: anak.lampiran?.hasil_bera_url },
                { name: 'Hasil CT Scan', available: !!anak.lampiran?.hasil_ct_scan_url, url: anak.lampiran?.hasil_ct_scan_url },
                { name: 'Program Terapi 3 Bulan', available: !!anak.lampiran?.program_terapi_3bln_url, url: anak.lampiran?.program_terapi_3bln_url },
                { name: 'Hasil Psikologis/Psikiatris', available: !!anak.lampiran?.hasil_psikologis_psikiatris_url, url: anak.lampiran?.hasil_psikologis_psikiatris_url },
              ].map((doc, idx) => (
                <div key={idx} className={`border rounded-lg p-4 ${doc.available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${doc.available ? 'text-green-800' : 'text-gray-600'}`}>{doc.name}</span>
                    {doc.available && doc.url && (
                      <button
                        type="button"
                        onClick={() => downloadLampiran(getFileNameFromUrl(doc.url || ''))}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Unduh lampiran"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {/* Lampiran Perjanjian */}
              <div className={`border rounded-lg p-4 ${anak.lampiran?.perjanjian ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${anak.lampiran?.perjanjian ? 'text-green-800' : 'text-gray-600'}`}>Perjanjian</span>
                  {anak.lampiran?.perjanjian && (
                    <button
                      type="button"
                      onClick={() => downloadLampiran(getFileNameFromUrl(anak.lampiran.perjanjian || ''))}
                      className="p-1 text-green-600 hover:text-green-800"
                      title="Unduh lampiran"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Pemeriksaan Sebelumnya */}
          <InfoCard
            icon={ClipboardList}
            title="Pemeriksaan Sebelumnya"
            sectionKey="pemeriksaanSebelumnya"
          >
            {anak.pemeriksaan_sebelumnya && anak.pemeriksaan_sebelumnya.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border">Tempat</th>
                      <th className="px-4 py-2 border">Usia</th>
                      <th className="px-4 py-2 border">Diagnosa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anak.pemeriksaan_sebelumnya.map((p, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="px-4 py-2 border">{p.tempat || '-'}</td>
                        <td className="px-4 py-2 border">{p.usia || '-'}</td>
                        <td className="px-4 py-2 border">{p.diagnosa || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500">Tidak ada data pemeriksaan sebelumnya.</div>
            )}
          </InfoCard>

          {/* Terapi Sebelumnya */}
          <InfoCard
            icon={Stethoscope}
            title="Terapi Sebelumnya"
            sectionKey="terapiSebelumnya"
          >
            {anak.terapi_sebelumnya && anak.terapi_sebelumnya.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 border">Jenis Terapi</th>
                      <th className="px-4 py-2 border">Frekuensi</th>
                      <th className="px-4 py-2 border">Lama Terapi</th>
                      <th className="px-4 py-2 border">Tempat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {anak.terapi_sebelumnya.map((t, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="px-4 py-2 border">{t.jenis_terapi || '-'}</td>
                        <td className="px-4 py-2 border">{t.frekuensi || '-'}</td>
                        <td className="px-4 py-2 border">{t.lama_terapi || '-'}</td>
                        <td className="px-4 py-2 border">{t.tempat || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500">Tidak ada data terapi sebelumnya.</div>
            )}
          </InfoCard>

          {/* Assessment Section */}
                     <InfoCard
             icon={FileText}
             title="Assessment"
             sectionKey="assessment"
           >
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-semibold text-gray-900">Assessment</h3>
               <Button
                 onClick={() => {
                   setEditingAssessment(null);
                   setAssessmentForm({
                     assessment_date: '',
                     assessment_type: '',
                     assessment_result: '',
                     notes: ''
                   });
                   setShowAssessmentForm(true);
                 }}
                 className="px-4 py-2"
               >
                 Add Assessment
               </Button>
             </div>

            {assessmentLoading ? (
              <LoadingSpinner size="md" text="Memuat assessment..." />
            ) : assessments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada assessment untuk anak ini</p>
              </div>
                         ) : (
               <div className="space-y-3">
                 {assessments.map(assessment => (
                   <div key={assessment.id} className="border rounded-lg p-4 bg-gray-50">
                     <div className="flex items-start justify-between">
                       <div className="flex-1">
                         <div className="flex items-center gap-2 mb-2">
                           <h4 className="font-medium text-gray-900">
                             {assessment.assessment_type}
                           </h4>
                           {assessment.assessment_date && (
                             <span className="text-sm text-gray-500">
                               {new Date(assessment.assessment_date).toLocaleDateString('id-ID')}
                             </span>
                           )}
                         </div>
                         <p className="text-gray-700 mb-1">
                           <strong>Hasil:</strong> {assessment.assessment_result || 'Menunggu Penilaian'}
                         </p>
                         {assessment.notes && (
                           <p className="text-gray-600 text-sm">{assessment.notes}</p>
                         )}
                         {assessment.user_created && (
                           <p className="text-gray-500 text-xs mt-1">
                             Oleh: {assessment.user_created.name}
                           </p>
                         )}
                       </div>
                       <div className="flex items-center gap-2">
                         <Button
                           onClick={() => handleEditAssessment(assessment)}
                           variant="secondary"
                           size="sm"
                         >
                           Edit
                         </Button>
                         <Button
                           onClick={() => handleDeleteAssessment(assessment.id)}
                           variant="danger"
                           size="sm"
                         >
                           Hapus
                         </Button>
                       </div>
                     </div>
                   </div>
                 ))}
                 
                 {/* Add Assessment Card */}
                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                   <div className="text-center">
                     <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                       <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                       </svg>
                     </div>
                     <h3 className="text-lg font-medium text-gray-900 mb-2">Tambah Assessment Baru</h3>
                     <p className="text-gray-600 mb-4">Klik tombol di bawah untuk menambahkan assessment baru</p>
                     <Button
                       onClick={() => {
                         setEditingAssessment(null);
                         setAssessmentForm({
                           assessment_date: '',
                           assessment_type: '',
                           assessment_result: '',
                           notes: ''
                         });
                         setShowAssessmentForm(true);
                       }}
                       className="px-6 py-2"
                     >
                       Add Assessment
                     </Button>
                   </div>
                 </div>
               </div>
             )}
          </InfoCard>
        </div>
      </div>

      {/* Section Dibuat oleh dan Tanggal Dibuat */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600 gap-2">
          <div>
            Dibuat oleh: <span className="font-medium text-gray-900">{anak.user_created?.name || '-'}</span>
            <span className="mx-2">•</span>
            Dibuat pada: <span className="font-medium text-gray-900">{formatDate(anak.created_at || undefined)}</span>
          </div>
          <div>
            Terakhir diupdate: <span className="font-medium text-gray-900">{formatDate(anak.updated_at || undefined)}</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Survey Modal */}
      <Modal isOpen={showSurveyModal} onClose={() => setShowSurveyModal(false)} title="Survey & Keluhan" size="xl">
        <div className="space-y-4">
          <p className="text-base text-gray-500 text-center py-4">Detail survey akan ditampilkan di sini</p>
        </div>
      </Modal>

      {/* Riwayat Medis Modal */}
      <Modal isOpen={showRiwayatModal} onClose={() => setShowRiwayatModal(false)} title="Riwayat Medis" size="xl">
        <div className="space-y-4">
          <p className="text-base text-gray-500 text-center py-4">Detail riwayat medis akan ditampilkan di sini</p>
        </div>
      </Modal>

      {/* Perilaku Modal */}
      <Modal isOpen={showPerilakuModal} onClose={() => setShowPerilakuModal(false)} title="Perilaku & Kebiasaan" size="xl">
        <div className="space-y-4">
          <p className="text-base text-gray-500 text-center py-4">Detail perilaku akan ditampilkan di sini</p>
        </div>
      </Modal>

      {/* Perkembangan Modal */}
      <Modal isOpen={showPerkembanganModal} onClose={() => setShowPerkembanganModal(false)} title="Perkembangan" size="xl">
        <div className="space-y-4">
          <p className="text-base text-gray-500 text-center py-4">Detail perkembangan akan ditampilkan di sini</p>
        </div>
      </Modal>

      {/* Dokumen Modal */}
      <Modal isOpen={showDokumenModal} onClose={() => setShowDokumenModal(false)} title="Dokumen & Lampiran" size="xl">
        <div className="space-y-4">
          <p className="text-base text-gray-500 text-center py-4">Detail dokumen akan ditampilkan di sini</p>
        </div>
      </Modal>

      {/* Form Modals */}
      <Modal isOpen={showSurveyForm} onClose={() => setShowSurveyForm(false)} title="Survey & Keluhan" size="xl">
        <SurveyForm
          anakId={Number(id)}
          surveyData={editingSurvey}
          onSuccess={handleSurveyFormSuccess}
          onCancel={() => setShowSurveyForm(false)}
        />
      </Modal>

      <Modal isOpen={showRiwayatForm} onClose={() => setShowRiwayatForm(false)} title="Riwayat Medis" size="xl">
        <RiwayatMedisForm
          anakId={Number(id)}
          riwayatData={editingRiwayat}
          onSuccess={handleRiwayatFormSuccess}
          onCancel={() => setShowRiwayatForm(false)}
        />
      </Modal>

      {/* Assessment Form Modal */}
      <Modal
        isOpen={showAssessmentForm}
        onClose={() => {
          setShowAssessmentForm(false);
          setEditingAssessment(null);
          setAssessmentForm({
            assessment_date: new Date().toISOString().split('T')[0],
            assessment_type: '',
            assessment_result: '',
            notes: ''
          });
        }}
        title={editingAssessment ? 'Edit Assessment' : 'Tambah Assessment Baru'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Assessment
            </label>
            <input
              type="date"
              value={assessmentForm.assessment_date}
              onChange={e => setAssessmentForm(prev => ({ ...prev, assessment_date: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Assessment *
            </label>
            <input
              type="text"
              value={assessmentForm.assessment_type}
              onChange={e => setAssessmentForm(prev => ({ ...prev, assessment_type: e.target.value }))}
              placeholder="Contoh: Kognitif, Motorik, Bahasa, dll."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasil Assessment
            </label>
            <input
              type="text"
              value={assessmentForm.assessment_result}
              onChange={e => setAssessmentForm(prev => ({ ...prev, assessment_result: e.target.value }))}
              placeholder="Contoh: Baik, Sedang, Perlu Perhatian"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan
            </label>
            <textarea
              value={assessmentForm.notes}
              onChange={e => setAssessmentForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Catatan tambahan tentang assessment..."
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
                         <Button
               variant="secondary"
               onClick={() => {
                 setShowAssessmentForm(false);
                 setEditingAssessment(null);
                 setAssessmentForm({
                   assessment_date: '',
                   assessment_type: '',
                   assessment_result: '',
                   notes: ''
                 });
               }}
             >
               Batal
             </Button>
                         <Button
               onClick={editingAssessment ? handleUpdateAssessment : handleCreateAssessment}
               disabled={!assessmentForm.assessment_type}
             >
               {editingAssessment ? 'Update Assessment' : 'Buat Assessment'}
             </Button>
          </div>
        </div>
      </Modal>

      {/* Modal dinamis dengan tab */}
      <Modal isOpen={!!detailModal} onClose={closeDetailModal} title={detailModal?.group === 'medis' ? 'Detail Riwayat Medis' : 'Detail Perkembangan & Perilaku'} size="xl">
        {detailModal && (
          <div>
            {/* Tab Header */}
            {detailModal.group === 'medis' && (
              <div className="flex border-b mb-4">
                {[
                  { key: 'kehamilan', label: 'Kehamilan' },
                  { key: 'kelahiran', label: 'Kelahiran' },
                  { key: 'imunisasi', label: 'Imunisasi' },
                  { key: 'penyakit', label: 'Penyakit Diderita' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm focus:outline-none transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
                    onClick={() => setActiveTab(tab.key as DetailModalType)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
            {detailModal.group === 'perkembangan' && (
              <div className="flex border-b mb-4">
                {[
                  { key: 'perkembangan', label: 'Perkembangan Anak' },
                  { key: 'oral', label: 'Perilaku Oral Motor' },
                  { key: 'sosial', label: 'Perkembangan Sosial' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm focus:outline-none transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
                    onClick={() => setActiveTab(tab.key as DetailModalType)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === 'kehamilan' && (
                <table className="min-w-full text-sm border border-gray-300">
                  <tbody>
                    {Object.entries(anak.riwayat_kehamilan || {}).map(([key, value]) => (
                      key !== 'id' && key !== 'anak_id' && (
                        <tr key={key} className="border-b last:border-b-0">
                          <td className="font-medium pr-4 py-2 border-r border-gray-200 bg-gray-50 w-1/3">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                          <td className="py-2 px-2">{typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : value}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'kelahiran' && (
                <table className="min-w-full text-sm border border-gray-300">
                  <tbody>
                    {Object.entries(anak.riwayat_kelahiran || {}).map(([key, value]) => (
                      key !== 'id' && key !== 'anak_id' && (
                        <tr key={key} className="border-b last:border-b-0">
                          <td className="font-medium pr-4 py-2 border-r border-gray-200 bg-gray-50 w-1/3">{key.replace(/_/g, ' ').toUpperCase()}</td>
                          <td className="py-2 px-2">{Array.isArray(value) ? value.join(', ') : (typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : value || '-' )}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'imunisasi' && (
                <table className="min-w-full text-sm border border-gray-300">
                  <tbody>
                    {Object.entries(anak.riwayat_imunisasi || {}).map(([key, value]) => (
                      key !== 'id' && key !== 'anak_id' && (
                        <tr key={key} className="border-b last:border-b-0">
                          <td className="font-medium pr-4 py-2 border-r border-gray-200 bg-gray-50 w-1/3">{key.replace(/_/g, ' ').toUpperCase()}</td>
                          <td className="py-2 px-2">{typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : value || '-'}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'penyakit' && (
                <table className="min-w-full text-sm border border-gray-300">
                  <tbody>
                    {Object.entries(anak.penyakit_diderita || {}).map(([key, value]) => (
                      key !== 'id' && key !== 'anak_id' && (
                        <tr key={key} className="border-b last:border-b-0">
                          <td className="font-medium pr-4 py-2 border-r border-gray-200 bg-gray-50 w-1/3">{key.replace(/_/g, ' ').toUpperCase()}</td>
                          <td className="py-2 px-2">{typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : value || '-'}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'perkembangan' && (
                <table className="min-w-full text-sm border border-gray-300">
                  <tbody>
                    {Object.entries(anak.perkembangan_anak || {}).map(([key, value]) => (
                      key !== 'id' && key !== 'anak_id' && (
                        <tr key={key} className="border-b last:border-b-0">
                          <td className="font-medium pr-4 py-2 border-r border-gray-200 bg-gray-50 w-1/3">{key.replace(/_/g, ' ').toUpperCase()}</td>
                          <td className="py-2 px-2">{typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : value || '-'}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'oral' && (
                <table className="min-w-full text-sm border border-gray-300">
                  <tbody>
                    {Object.entries(anak.perilaku_oral_motor || {}).map(([key, value]) => (
                      key !== 'id' && key !== 'anak_id' && (
                        <tr key={key} className="border-b last:border-b-0">
                          <td className="font-medium pr-4 py-2 border-r border-gray-200 bg-gray-50 w-1/3">{key.replace(/_/g, ' ').toUpperCase()}</td>
                          <td className="py-2 px-2">{typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : value || '-'}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === 'sosial' && (
                <table className="min-w-full text-sm border border-gray-300">
                  <tbody>
                    {Object.entries(anak.perkembangan_sosial || {}).map(([key, value]) => (
                      key !== 'id' && key !== 'anak_id' && (
                        <tr key={key} className="border-b last:border-b-0">
                          <td className="font-medium pr-4 py-2 border-r border-gray-200 bg-gray-50 w-1/3">{key.replace(/_/g, ' ').toUpperCase()}</td>
                          <td className="py-2 px-2">{typeof value === 'boolean' ? (value ? 'Ya' : 'Tidak') : value || '-'}</td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AnakDetailPage; 