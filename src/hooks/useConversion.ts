import { useState, useEffect } from 'react';
import { conversionAPI } from '../services/api';
import type { Conversion, ConversionForm, ConversionResponse } from '../types';

// Hook untuk mengambil data conversion
export const useConversionData = (
  page: number = 1,
  limit: number = 10,
  search: string = '',
  bulan: string = '',
  tahun: number | undefined = undefined
) => {
  const [data, setData] = useState<ConversionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[DEBUG] Fetching conversion data with params:', { page, limit, search, bulan, tahun });
      
      const response = await conversionAPI.getAll({
        page,
        limit,
        search,
        bulan,
        tahun
      });
      
      console.log('[DEBUG] Conversion API response:', response);
      console.log('[DEBUG] Response data structure:', response.data);
      
      if (response.success && response.data) {
        console.log('[DEBUG] Setting conversion data:', response.data);
        setData(response.data);
      } else {
        console.log('[DEBUG] Conversion API returned error:', response.message);
        setError(response.message || 'Terjadi kesalahan saat mengambil data');
      }
    } catch (err: any) {
      console.error('[DEBUG] Conversion data fetch error:', err);
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, search, bulan, tahun]);

  return { data, loading, error, refetch: fetchData };
};

// Hook untuk membuat conversion
export const useCreateConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createConversion = async (conversionData: ConversionForm): Promise<Conversion | null> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[DEBUG] Creating conversion with data:', conversionData);
      
      const response = await conversionAPI.create(conversionData);
      
      console.log('[DEBUG] Create conversion response:', response);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Gagal membuat data conversion');
        throw new Error(response.message || 'Gagal membuat data conversion');
      }
    } catch (err: any) {
      console.error('[DEBUG] Create conversion error:', err);
      setError(err.message || 'Terjadi kesalahan saat membuat data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createConversion, loading, error };
};

// Hook untuk update conversion
export const useUpdateConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateConversion = async (id: number, conversionData: ConversionForm): Promise<Conversion | null> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[DEBUG] Updating conversion with id:', id, 'data:', conversionData);
      
      const response = await conversionAPI.update(id, conversionData);
      
      console.log('[DEBUG] Update conversion response:', response);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Gagal mengupdate data conversion');
        throw new Error(response.message || 'Gagal mengupdate data conversion');
      }
    } catch (err: any) {
      console.error('[DEBUG] Update conversion error:', err);
      setError(err.message || 'Terjadi kesalahan saat mengupdate data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateConversion, loading, error };
};

// Hook untuk delete conversion
export const useDeleteConversion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteConversion = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[DEBUG] Deleting conversion with id:', id);
      
      const response = await conversionAPI.delete(id);
      
      console.log('[DEBUG] Delete conversion response:', response);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Gagal menghapus data conversion');
        throw new Error(response.message || 'Gagal menghapus data conversion');
      }
    } catch (err: any) {
      console.error('[DEBUG] Delete conversion error:', err);
      setError(err.message || 'Terjadi kesalahan saat menghapus data');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteConversion, loading, error };
}; 