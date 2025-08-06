import { useState, useEffect } from 'react';
import { notifikasiAPI } from '../services/api';
import type { Notifikasi, NotifikasiForm, NotifikasiResponse } from '../types';

// Hook untuk mengambil data notifikasi (Superadmin)
export const useNotifikasiData = (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  jenis_pemberitahuan: string = '',
  tujuan: string = '',
  is_read: boolean | undefined = undefined
) => {
  const [data, setData] = useState<NotifikasiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[DEBUG] Fetching notifikasi data with params:', { page, limit, search, jenis_pemberitahuan, tujuan, is_read });
      
      const response = await notifikasiAPI.getAll({
        page,
        limit,
        search,
        jenis_pemberitahuan,
        tujuan,
        is_read
      });
      
      console.log('[DEBUG] Notifikasi API response:', response);
      console.log('[DEBUG] Response data structure:', response.data);
      
      if (response.success && response.data) {
        console.log('[DEBUG] Setting notifikasi data:', response.data);
        setData(response.data);
      } else {
        console.log('[DEBUG] Notifikasi API returned error:', response.message);
        setError(response.message || 'Terjadi kesalahan saat mengambil data');
      }
    } catch (err: any) {
      console.error('[DEBUG] Notifikasi data fetch error:', err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search, jenis_pemberitahuan, tujuan, is_read]);

  return { data, loading, error, refetch: fetchData };
};

// Hook untuk membuat notifikasi (Superadmin)
export const useCreateNotifikasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNotifikasi = async (notifikasiData: NotifikasiForm): Promise<Notifikasi | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await notifikasiAPI.create(notifikasiData);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Gagal membuat notifikasi');
        throw new Error(response.message || 'Gagal membuat notifikasi');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat membuat notifikasi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createNotifikasi, loading, error };
};

// Hook untuk update notifikasi (Superadmin)
export const useUpdateNotifikasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateNotifikasi = async (id: number, notifikasiData: NotifikasiForm): Promise<Notifikasi | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await notifikasiAPI.update(id, notifikasiData);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Gagal mengupdate notifikasi');
        throw new Error(response.message || 'Gagal mengupdate notifikasi');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat mengupdate notifikasi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateNotifikasi, loading, error };
};

// Hook untuk delete notifikasi (Superadmin)
export const useDeleteNotifikasi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNotifikasi = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await notifikasiAPI.delete(id);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Gagal menghapus notifikasi');
        throw new Error(response.message || 'Gagal menghapus notifikasi');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menghapus notifikasi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteNotifikasi, loading, error };
};

// Hook untuk mengambil notifikasi user
export const useUserNotifikasi = (
  page: number = 1,
  limit: number = 10
) => {
  const [data, setData] = useState<NotifikasiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[DEBUG] Fetching user notifikasi with params:', { page, limit });
      console.log('[DEBUG] Current token:', localStorage.getItem('token') ? 'Present' : 'Missing');
      console.log('[DEBUG] API Base URL:', import.meta.env.VITE_API_URL || '/api');
      
      // Get current user info
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('[DEBUG] Current user:', {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          peran: user.peran
        });
      }
      
      const response = await notifikasiAPI.getUserNotifications({
        page,
        limit
      });
      
      console.log('[DEBUG] User notifikasi API response:', response);
      console.log('[DEBUG] User response data structure:', response.data);
      console.log('[DEBUG] Response success:', response.success);
      console.log('[DEBUG] Response data notifikasis:', response.data?.notifikasis);
      console.log('[DEBUG] Response data pagination:', response.data?.pagination);
      console.log('[DEBUG] Notifikasis length:', response.data?.notifikasis?.length);
      
      if (response.success && response.data) {
        console.log('[DEBUG] Setting user notifikasi data:', response.data);
        setData(response.data);
      } else {
        console.log('[DEBUG] User notifikasi API returned error:', response.message);
        setError(response.message || 'Terjadi kesalahan saat mengambil notifikasi');
      }
    } catch (err: any) {
      console.error('[DEBUG] User notifikasi fetch error:', err);
      console.error('[DEBUG] Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url,
        method: err.config?.method
      });
      setError(err.message || 'Terjadi kesalahan saat mengambil notifikasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  return { data, loading, error, refetch: fetchData };
};

// Hook untuk mark as read
export const useMarkAsRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsRead = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await notifikasiAPI.markAsRead(id);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Gagal menandai notifikasi sebagai dibaca');
        throw new Error(response.message || 'Gagal menandai notifikasi sebagai dibaca');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menandai notifikasi');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markAsRead, loading, error };
}; 