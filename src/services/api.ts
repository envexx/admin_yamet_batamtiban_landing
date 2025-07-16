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
  UpdateProgramTerapiData
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
  getStats: async (period: string = '1month'): Promise<ApiResponse<DashboardStats>> => {
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

export default api;