import axios from 'axios';
import API_CONFIG from '../config/api';
import type {
  ApiResponse,
  User,
  UserForm,
  RegisterData,
  CreateAdminData,
  UpdateUserData,
  Anak,
  AnakForm,
  DashboardStats,
  Assessment,
  AssessmentForm,
  ProgramTerapi,
  ProgramTerapiForm,
  Pagination,
  AnakWithAssessment,
  AnakWithProgramTerapi,
  AnakCompleteData,
  AnakDashboardData,
  SurveyData,
  RiwayatMedisData,
  PerilakuData,
  PerkembanganData,
  DokumenData,
  AnakDetail,
  ProgramTerapiGroupedResponse,
  ProgramTerapiResponse,
  CreateProgramTerapiData,
  UpdateProgramTerapiData,
  AdminStats,
  AdminStatsFilters,
  Conversion,
  ConversionForm,
  ConversionResponse,
  Notifikasi,
  NotifikasiForm,
  NotifikasiResponse
} from '../types';
import { useAuth } from '../contexts/AuthContext';

console.log('[API] BASE URL yang digunakan:', API_CONFIG.getApiBaseURL());

const api = axios.create({
  baseURL: API_CONFIG.getApiBaseURL(),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse<{ accessToken: string; user: User }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  // Enhanced Register - supports both public and admin registration
  register: async (userData: RegisterData): Promise<ApiResponse<User>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  // Create Admin (Superadmin Only)
  createAdmin: async (adminData: CreateAdminData): Promise<ApiResponse<User>> => {
    const response = await api.post('/auth/create-admin', adminData);
    return response.data;
  },
  
  // Update User (Role-based permissions)
  updateUser: async (updateData: UpdateUserData): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/update-user', updateData);
    return response.data;
  },
  
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  // Update Profile (Self)
  updateProfile: async (profileData: Partial<UserForm>): Promise<ApiResponse<{user: User}>> => {
    const response = await api.put('/auth/update', profileData);
    return response.data;
  },
  
  // List Users (Superadmin Only)
  getAllUsers: async (filters: any = {}): Promise<ApiResponse<{ users: User[]; statistics: any; pagination: any }>> => {
    const response = await api.get('/auth/users', { params: filters });
    return response.data;
  },
  
  // Toggle User Status
  toggleActive: async (userId: number, isActive: boolean): Promise<ApiResponse> => {
    const response = await api.post('/auth/toggle-active', { userId, isActive });
    return response.data;
  },
  
  // Activate User
  activate: async (userId: number): Promise<ApiResponse> => {
    const response = await api.post('/auth/activate', { userId });
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (period: string = 'all'): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/dashboard/stats', { params: { period } });
    return response.data;
  },
};

// Anak API - Updated for Hybrid Database
export const anakAPI = {
  // Ambil semua anak (nested, schema baru)
  getAll: async (filters: any = {}): Promise<ApiResponse<AnakDetail[]>> => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      search = '',
      id = undefined,
      status = '',
      startDate = undefined,
      endDate = undefined,
    } = filters;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
      search
    });

    if (id) {
      queryParams.append('id', id.toString());
    }
    if (status) {
      queryParams.append('status', status);
    }
    if (startDate) {
      queryParams.append('startDate', startDate);
    }
    if (endDate) {
      queryParams.append('endDate', endDate);
    }

    const response = await api.get(`/anak?${queryParams}`);
    return response.data;
  },
  
  // Ambil detail anak (nested, schema baru)
  getById: async (id: number): Promise<ApiResponse<AnakDetail>> => {
    const response = await api.get(`/anak/${id}`);
    if (response.data && response.data.data && response.data.data.anak) {
      return {
        ...response.data,
        data: response.data.data.anak
      };
    }
    return response.data;
  },
  
  // Tambah anak (nested, schema baru)
  create: async (anakData: Partial<AnakDetail>): Promise<ApiResponse<AnakDetail>> => {
    const response = await api.post('/anak', anakData);
    return response.data;
  },
  
  // Update anak (nested, schema baru)
  update: async (id: number, anakData: Partial<AnakDetail>): Promise<ApiResponse<AnakDetail>> => {
    const response = await api.put(`/anak/${id}`, anakData);
    return response.data;
  },
  
  // Hapus anak (nested, schema baru)
  delete: async (id: number): Promise<ApiResponse> => {
    const response = await api.delete(`/anak/${id}`);
    return response.data;
  },

  // Generate nomor anak berikutnya
  getNextNumber: async (): Promise<ApiResponse<{ nextNumber: string }>> => {
    try {
      // Ambil semua anak untuk mencari nomor terakhir
      const response = await api.get('/anak', {
        params: {
          page: 1,
          limit: 1000, // Ambil banyak data untuk mencari nomor terakhir
          sortBy: 'nomor_anak',
          sortOrder: 'DESC'
        }
      });
      
      if (response.data.status === 'success' && response.data.data) {
        const anakList = response.data.data;
        const currentYear = new Date().getFullYear();
        
        // Cari nomor anak terakhir dengan format YAMET-YYYY-XXXX untuk tahun saat ini
        let lastNumber = 0;
        const yametPattern = new RegExp(`^YAMET-${currentYear}-(\\d{4})$`);
        
        for (const anak of anakList) {
          if (anak.nomor_anak) {
            // Cek format YAMET-YYYY-XXXX untuk tahun saat ini
            if (yametPattern.test(anak.nomor_anak)) {
              const match = anak.nomor_anak.match(yametPattern);
              if (match) {
                const number = parseInt(match[1], 10);
                if (number > lastNumber) {
                  lastNumber = number;
                }
              }
            }
          }
        }
        
        // Generate nomor berikutnya dengan format 4 digit
        const nextNumber = lastNumber + 1;
        const nextNumberString = `YAMET-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
        
        return {
          status: 'success',
          message: 'Next number generated successfully',
          data: { nextNumber: nextNumberString }
        };
      }
      
      // Fallback jika tidak ada data - mulai dari 0001 untuk tahun ini
      const currentYear = new Date().getFullYear();
      const fallbackNumber = `YAMET-${currentYear}-0001`;
      
      return {
        status: 'success',
        message: 'Next number generated successfully',
        data: { nextNumber: fallbackNumber }
      };
      
    } catch (error) {
      console.error('Error generating next number:', error);
      
      // Fallback jika terjadi error - mulai dari 0001 untuk tahun ini
      const currentYear = new Date().getFullYear();
      const fallbackNumber = `YAMET-${currentYear}-0001`;
      
      return {
        status: 'success',
        message: 'Next number generated successfully',
        data: { nextNumber: fallbackNumber }
      };
    }
  },

  // Hybrid Database Endpoints
  getCompleteData: async (id: number): Promise<ApiResponse<AnakCompleteData>> => {
    const response = await api.get(`/anak/${id}/complete`);
    return response.data;
  },
  
  getDashboardData: async (id: number): Promise<ApiResponse<AnakDashboardData>> => {
    const response = await api.get(`/anak/${id}/dashboard`);
    return response.data;
  },

  // Survey Management (MongoDB)
  getSurvey: async (anakId: number): Promise<ApiResponse<SurveyData>> => {
    const response = await api.get(`/anak/${anakId}/survey`);
    return response.data;
  },
  
  createSurvey: async (anakId: number, surveyData: Partial<SurveyData>): Promise<ApiResponse<SurveyData>> => {
    const response = await api.post(`/anak/${anakId}/survey`, surveyData);
    return response.data;
  },
  
  updateSurvey: async (anakId: number, surveyData: Partial<SurveyData>): Promise<ApiResponse<SurveyData>> => {
    const response = await api.put(`/anak/${anakId}/survey`, surveyData);
    return response.data;
  },

  // Medical History Management (MongoDB)
  getRiwayatMedis: async (anakId: number): Promise<ApiResponse<RiwayatMedisData>> => {
    const response = await api.get(`/anak/${anakId}/riwayat-medis`);
    return response.data;
  },
  
  createRiwayatMedis: async (anakId: number, riwayatData: Partial<RiwayatMedisData>): Promise<ApiResponse<RiwayatMedisData>> => {
    const response = await api.post(`/anak/${anakId}/riwayat-medis`, riwayatData);
    return response.data;
  },
  
  updateRiwayatMedis: async (anakId: number, riwayatData: Partial<RiwayatMedisData>): Promise<ApiResponse<RiwayatMedisData>> => {
    const response = await api.put(`/anak/${anakId}/riwayat-medis`, riwayatData);
    return response.data;
  },

  // Behavior Management (MongoDB)
  getPerilaku: async (anakId: number): Promise<ApiResponse<PerilakuData>> => {
    const response = await api.get(`/anak/${anakId}/perilaku`);
    return response.data;
  },
  
  createPerilaku: async (anakId: number, perilakuData: Partial<PerilakuData>): Promise<ApiResponse<PerilakuData>> => {
    const response = await api.post(`/anak/${anakId}/perilaku`, perilakuData);
    return response.data;
  },
  
  updatePerilaku: async (anakId: number, perilakuData: Partial<PerilakuData>): Promise<ApiResponse<PerilakuData>> => {
    const response = await api.put(`/anak/${anakId}/perilaku`, perilakuData);
    return response.data;
  },

  // Development Management (MongoDB)
  getPerkembangan: async (anakId: number): Promise<ApiResponse<PerkembanganData>> => {
    const response = await api.get(`/anak/${anakId}/perkembangan`);
    return response.data;
  },
  
  createPerkembangan: async (anakId: number, perkembanganData: Partial<PerkembanganData>): Promise<ApiResponse<PerkembanganData>> => {
    const response = await api.post(`/anak/${anakId}/perkembangan`, perkembanganData);
    return response.data;
  },
  
  updatePerkembangan: async (anakId: number, perkembanganData: Partial<PerkembanganData>) => {
    const response = await api.put(`/anak/${anakId}/perkembangan`, perkembanganData);
    return response.data;
  },

  // Documents Management (MongoDB)
  getDokumen: async (anakId: number): Promise<ApiResponse<DokumenData>> => {
    const response = await api.get(`/anak/${anakId}/dokumen`);
    return response.data;
  },
  
  addDokumen: async (anakId: number, dokumenData: any): Promise<ApiResponse<DokumenData>> => {
    const response = await api.post(`/anak/${anakId}/dokumen`, dokumenData);
    return response.data;
  },
  
  deleteDokumen: async (anakId: number, docId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/anak/${anakId}/dokumen/${docId}`);
    return response.data;
  },

  // Assessment Management - Updated for new backend structure
  getAssessment: async (anakId: number, params: any = {}): Promise<ApiResponse<Assessment[]>> => {
    const response = await api.get(`/anak/${anakId}/assessment`, { params });
    return response.data;
  },
  
  createAssessment: async (anakId: number, data: AssessmentForm): Promise<ApiResponse<Assessment>> => {
    // Ensure assessment_date is provided or set to current date if empty
    const assessmentData = {
      ...data,
      assessment_date: data.assessment_date || new Date().toISOString().split('T')[0]
    };
    const response = await api.post(`/anak/${anakId}/assessment`, assessmentData);
    return { ...response.data, data: response.data.data.assessment };
  },
  
  updateAssessment: async (anakId: number, assessmentId: number, data: AssessmentForm): Promise<ApiResponse<Assessment>> => {
    // Ensure assessment_date is provided or set to current date if empty
    const assessmentData = {
      ...data,
      assessment_date: data.assessment_date || new Date().toISOString().split('T')[0]
    };
    const response = await api.put(`/anak/${anakId}/assessment`, assessmentData, { params: { assessmentId } });
    return { ...response.data, data: response.data.data.assessment };
  },
  
  deleteAssessment: async (anakId: number, assessmentId: number): Promise<ApiResponse> => {
    const response = await api.delete(`/anak/${anakId}/assessment`, { params: { assessmentId } });
    return response.data;
  },

  // Global Assessment List - New endpoint for ADMIN/SUPERADMIN
  getAllAssessmentGlobal: async (params: any = {}): Promise<ApiResponse<AnakWithAssessment[]>> => {
    const response = await api.get('/assessment', { params });
    return response.data;
  },

  // Program Terapi (SQL - unchanged)
  getProgramTerapi: async (anakId: number, params: any = {}): Promise<ApiResponse<ProgramTerapi[]>> => {
    const response = await api.get(`/anak/${anakId}/program-terapi`, { params });
    return response.data;
  },
  
  createProgramTerapi: async (anakId: number, data: ProgramTerapiForm): Promise<ApiResponse<ProgramTerapi>> => {
    const response = await api.post(`/anak/${anakId}/program-terapi`, data);
    return { ...response.data, data: response.data.data.program };
  },
  
  updateProgramTerapi: async (anakId: number, programId: number, data: ProgramTerapiForm): Promise<ApiResponse<ProgramTerapi>> => {
    const response = await api.put(`/anak/${anakId}/program-terapi`, data, { params: { programId } });
    return { ...response.data, data: response.data.data.program };
  },
  
  deleteProgramTerapi: async (anakId: number, programId: number): Promise<ApiResponse> => {
    const response = await api.delete(`/anak/${anakId}/program-terapi`, { params: { programId } });
    return response.data;
  },

  // Import Excel
  importExcel: async (file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/anak/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  getAllProgramTerapiGlobal: async (params: any = {}): Promise<ApiResponse<AnakWithProgramTerapi[]>> => {
    const response = await api.get('/program-terapi', { params });
    return response.data;
  },

  // Upload Lampiran Anak
  uploadLampiran: async (anakId: number, formData: FormData): Promise<ApiResponse> => {
    const response = await api.post(`/anak/${anakId}/lampiran`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Program Terapi API
export const programTerapiAPI = {
  // Get all program terapi grouped by anak (for ADMIN/SUPERADMIN)
  getAllGrouped: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    anakId?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ProgramTerapiGroupedResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.anakId) queryParams.append('anakId', params.anakId.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await api.get(`/program-terapi?${queryParams}`);
    return response.data;
  },

  // Get program terapi for specific anak
  getByAnakId: async (anakId: number, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ProgramTerapiResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await api.get(`/anak/${anakId}/program-terapi?${queryParams}`);
    return response.data;
  },

  // Create program terapi for specific anak
  create: async (anakId: number, data: CreateProgramTerapiData): Promise<{ status: string; message: string; data: { program: ProgramTerapi } }> => {
    const response = await api.post(`/anak/${anakId}/program-terapi`, data);
    return response.data;
  },

  // Update program terapi
  update: async (anakId: number, programId: number, data: UpdateProgramTerapiData): Promise<{ status: string; message: string; data: { program: ProgramTerapi } }> => {
    const response = await api.put(`/anak/${anakId}/program-terapi`, data, { params: { programId } });
    return response.data;
  },

  // Delete program terapi
  delete: async (anakId: number, programId: number): Promise<{ status: string; message: string }> => {
    const response = await api.delete(`/anak/${anakId}/program-terapi`, { params: { programId } });
    return response.data;
  },
};

// Conversion API
export const conversionAPI = {
  // Get all conversions with pagination and filters
  getAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    bulan?: string;
    tahun?: number;
  } = {}): Promise<ApiResponse<ConversionResponse>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.bulan) queryParams.append('bulan', params.bulan);
    if (params.tahun) queryParams.append('tahun', params.tahun.toString());

    const url = `/conversion?${queryParams}`;
    
    try {
      const response = await api.get(url);
      console.log('[DEBUG] Conversion API Response:', response.data);
      
      // Handle the actual response structure from backend
      if (response.data && response.data.data !== undefined) {
        return {
          success: true,
          data: {
            conversions: response.data.data || [],
            pagination: response.data.pagination || {
              current_page: 1,
              total_pages: 0,
              total_records: 0,
              has_next: false,
              has_prev: false
            }
          },
          message: response.data.message || 'Data berhasil diambil'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Gagal mengambil data'
        };
      }
    } catch (error: any) {
      console.error('[DEBUG] Conversion API Error:', error);
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data conversion');
    }
  },

  // Create new conversion
  create: async (data: ConversionForm): Promise<ApiResponse<Conversion>> => {
    try {
      const response = await api.post('/conversion', data);
      console.log('[DEBUG] Create Conversion Response:', response.data);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Data conversion berhasil dibuat'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Gagal membuat data conversion'
        };
      }
    } catch (error: any) {
      console.error('[DEBUG] Create Conversion Error:', error);
      console.error('[DEBUG] Error Response Data:', error.response?.data);
      console.error('[DEBUG] Error Response Status:', error.response?.status);
      console.error('[DEBUG] Error Response Headers:', error.response?.headers);
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat membuat data conversion');
    }
  },

  // Update conversion
  update: async (id: number, data: ConversionForm): Promise<ApiResponse<Conversion>> => {
    try {
      const response = await api.put(`/conversion/${id}`, data);
      console.log('[DEBUG] Update Conversion Response:', response.data);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Data conversion berhasil diupdate'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Gagal mengupdate data conversion'
        };
      }
    } catch (error: any) {
      console.error('[DEBUG] Update Conversion Error:', error);
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengupdate data conversion');
    }
  },

  // Delete conversion
  delete: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await api.delete(`/conversion/${id}`);
      console.log('[DEBUG] Delete Conversion Response:', response.data);
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Data conversion berhasil dihapus'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Gagal menghapus data conversion'
        };
      }
    } catch (error: any) {
      console.error('[DEBUG] Delete Conversion Error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        throw new Error('Anda tidak memiliki izin untuk menghapus data conversion ini');
      } else if (error.response?.status === 404) {
        throw new Error('Data conversion tidak ditemukan');
      } else if (error.response?.status === 401) {
        throw new Error('Sesi Anda telah berakhir. Silakan login kembali');
      } else {
        throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat menghapus data conversion');
      }
    }
  },
};

// Notifikasi API
export const notifikasiAPI = {
  // Get all notifications (Superadmin only)
  getAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    jenis_pemberitahuan?: string;
    tujuan?: string;
    is_read?: boolean;
  } = {}): Promise<ApiResponse<NotifikasiResponse>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.jenis_pemberitahuan) queryParams.append('jenis_pemberitahuan', params.jenis_pemberitahuan);
    if (params.tujuan) queryParams.append('tujuan', params.tujuan);
    if (params.is_read !== undefined) queryParams.append('is_read', params.is_read.toString());

    try {
      const response = await api.get(`/notifikasi?${queryParams}`);
      console.log('[DEBUG] Notifikasi API Response:', response.data);
      
      // Handle the actual response structure from backend
      if (response.data && response.data.data !== undefined) {
        return {
          success: true,
          data: {
            notifikasis: response.data.data || [],
            pagination: response.data.pagination || {
              current_page: 1,
              total_pages: 0,
              total_records: 0,
              has_next: false,
              has_prev: false
            }
          },
          message: response.data.message || 'Data berhasil diambil'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Gagal mengambil data'
        };
      }
    } catch (error: any) {
      console.error('[DEBUG] Notifikasi API Error:', error);
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil data notifikasi');
    }
  },

  // Create new notification (Superadmin only)
  create: async (data: NotifikasiForm): Promise<ApiResponse<Notifikasi>> => {
    try {
      const response = await api.post('/notifikasi', data);
      console.log('[DEBUG] Create Notifikasi Response:', response.data);
      
      // Backend returns { data: {...}, message: "..." } without success field
      if (response.data && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Notifikasi berhasil dibuat'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Gagal membuat notifikasi'
        };
      }
    } catch (error: any) {
      console.error('[DEBUG] Create Notifikasi Error:', error);
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat membuat notifikasi');
    }
  },

  // Update notification (Superadmin only)
  update: async (id: number, data: NotifikasiForm): Promise<ApiResponse<Notifikasi>> => {
    try {
      // Try path parameter first
      const response = await api.put(`/notifikasi/${id}`, data);
      console.log('[DEBUG] Update Notifikasi Response:', response.data);
      
      // Backend returns { data: {...}, message: "..." } without success field
      if (response.data && response.data.data) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message || 'Notifikasi berhasil diupdate'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Gagal mengupdate notifikasi'
        };
      }
    } catch (error: any) {
      console.error('[DEBUG] Update Notifikasi Error:', error);
      
      // If path parameter fails, try query parameter
      if (error.response?.status === 404 || error.response?.status === 405) {
        try {
          console.log('[DEBUG] Trying query parameter update...');
          const altResponse = await api.put(`/notifikasi?id=${id}`, data);
          console.log('[DEBUG] Query Parameter Update Response:', altResponse.data);
          
          if (altResponse.data && altResponse.data.data) {
            return {
              success: true,
              data: altResponse.data.data,
              message: altResponse.data.message || 'Notifikasi berhasil diupdate'
            };
          } else {
            return {
              success: false,
              message: altResponse.data.message || 'Gagal mengupdate notifikasi'
            };
          }
        } catch (altError: any) {
          console.error('[DEBUG] Query Parameter Update Error:', altError);
          throw new Error(altError.response?.data?.message || 'Terjadi kesalahan saat mengupdate notifikasi');
        }
      }
      
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengupdate notifikasi');
    }
  },

  // Delete notification (Superadmin only)
  delete: async (id: number): Promise<ApiResponse> => {
    try {
      // Try DELETE method with path parameter first
      const response = await api.delete(`/notifikasi/${id}`);
      console.log('[DEBUG] Delete Notifikasi Response:', response.data);
      
      // Backend returns { message: "..." } without success field
      if (response.data && response.data.message) {
        return {
          success: true,
          message: response.data.message || 'Notifikasi berhasil dihapus'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Gagal menghapus notifikasi'
        };
      }
    } catch (error: any) {
      console.error('[DEBUG] Delete Notifikasi Error:', error);
      
      // If path parameter fails, try query parameter
      if (error.response?.status === 404 || error.response?.status === 405) {
        try {
          console.log('[DEBUG] Trying query parameter delete...');
          const altResponse = await api.delete(`/notifikasi?id=${id}`);
          console.log('[DEBUG] Query Parameter Delete Response:', altResponse.data);
          
          if (altResponse.data && altResponse.data.message) {
            return {
              success: true,
              message: altResponse.data.message || 'Notifikasi berhasil dihapus'
            };
          } else {
            return {
              success: false,
              message: altResponse.data.message || 'Gagal menghapus notifikasi'
            };
          }
        } catch (altError: any) {
          console.error('[DEBUG] Query Parameter Delete Error:', altError);
          
          // If query parameter also fails, try POST with _method=DELETE
          try {
            console.log('[DEBUG] Trying POST with _method=DELETE...');
            const postResponse = await api.post(`/notifikasi`, { 
              _method: 'DELETE',
              id: id
            });
            console.log('[DEBUG] POST Delete Response:', postResponse.data);
            
            if (postResponse.data && postResponse.data.message) {
              return {
                success: true,
                message: postResponse.data.message || 'Notifikasi berhasil dihapus'
              };
            } else {
              return {
                success: false,
                message: postResponse.data.message || 'Gagal menghapus notifikasi'
              };
            }
          } catch (postError: any) {
            console.error('[DEBUG] POST Delete Error:', postError);
            throw new Error(postError.response?.data?.message || 'Terjadi kesalahan saat menghapus notifikasi');
          }
        }
      }
      
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat menghapus notifikasi');
    }
  },

  // Get user notifications (all authenticated users)
  getUserNotifications: async (params: {
    page?: number;
    limit?: number;
  } = {}): Promise<ApiResponse<NotifikasiResponse>> => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    try {
      const response = await api.get(`/notifikasi/user?${queryParams}`);
      console.log('[DEBUG] User Notifications Response:', response.data);
      
      // Handle the actual response structure from backend
      if (response.data && response.data.data !== undefined) {
        return {
          success: true,
          data: {
            notifikasis: response.data.data || [],
            pagination: response.data.pagination || {
              current_page: 1,
              total_pages: 0,
              total_records: 0,
              has_next: false,
              has_prev: false
            }
          },
          message: response.data.message || 'Data berhasil diambil'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Gagal mengambil data'
        };
      }
    } catch (error: any) {
      console.error('[DEBUG] User Notifications Error:', error);
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat mengambil notifikasi user');
    }
  },

  // Mark notification as read (all authenticated users)
  markAsRead: async (id: number): Promise<ApiResponse> => {
    try {
      // Try path parameter first
      const response = await api.put(`/notifikasi/user/${id}`, { is_read: true });
      console.log('[DEBUG] Mark As Read Response:', response.data);
      
      // Backend returns { message: "..." } without success field
      if (response.data && response.data.message) {
        return {
          success: true,
          message: response.data.message || 'Notifikasi berhasil ditandai sebagai dibaca'
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Gagal menandai notifikasi sebagai dibaca'
        };
      }
    } catch (error: any) {
      console.error('[DEBUG] Mark As Read Error:', error);
      
      // If path parameter fails, try query parameter
      if (error.response?.status === 404 || error.response?.status === 405) {
        try {
          console.log('[DEBUG] Trying query parameter mark as read...');
          const altResponse = await api.put(`/notifikasi/user?id=${id}`, { is_read: true });
          console.log('[DEBUG] Query Parameter Mark As Read Response:', altResponse.data);
          
          if (altResponse.data && altResponse.data.message) {
            return {
              success: true,
              message: altResponse.data.message || 'Notifikasi berhasil ditandai sebagai dibaca'
            };
          } else {
            return {
              success: false,
              message: altResponse.data.message || 'Gagal menandai notifikasi sebagai dibaca'
            };
          }
        } catch (altError: any) {
          console.error('[DEBUG] Query Parameter Mark As Read Error:', altError);
          throw new Error(altError.response?.data?.message || 'Terjadi kesalahan saat menandai notifikasi');
        }
      }
      
      throw new Error(error.response?.data?.message || 'Terjadi kesalahan saat menandai notifikasi');
    }
  },
};

export const getAppConfig = async () => {
  return api.get('/setting-aplikasi');
};

export const updateAppConfig = async (data: { appName: string; logoUrl: string; colorSchema: string }) => {
  return api.put('/setting-aplikasi', data);
};

export const uploadAppLogo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/setting-aplikasi/upload-logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Admin Stats API
export const adminStatsAPI = {
  // Get admin simple stats (for SUPERADMIN and MANAJER only)
  getAdminStats: async (filters?: AdminStatsFilters): Promise<ApiResponse<AdminStats>> => {
    const queryParams = new URLSearchParams();
    if (filters?.period) queryParams.append('period', filters.period);
    
    const response = await api.get(`/dashboard/admin-simple-stats?${queryParams}`);
    return response.data;
  },
};

export default api;