import React, { useState, useEffect } from 'react';
import type { ConversionForm } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ConversionFormProps {
  initialData?: any;
  onSubmit: (data: ConversionForm) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConversionForm: React.FC<ConversionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { user } = useAuth();
  const userRole = user?.role?.name || user?.peran || '';

  // Role-based permissions
  const canEditLeads = userRole === 'SUPERADMIN';
  const canEditConversion = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const canEditAnakKeluar = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const [formData, setFormData] = useState<ConversionForm>({
    jumlah_anak_keluar: 0,
    jumlah_leads: 0,
    jumlah_conversi: 0,
    bulan: '',
    tahun: new Date().getFullYear()
  });

  const [errors, setErrors] = useState<Partial<ConversionForm>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        jumlah_anak_keluar: initialData.jumlah_anak_keluar || 0,
        jumlah_leads: initialData.jumlah_leads || 0,
        jumlah_conversi: initialData.jumlah_conversi || 0,
        bulan: initialData.bulan || '',
        tahun: initialData.tahun || new Date().getFullYear()
      });
    }
  }, [initialData]);

  const bulanOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const tahunOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const validateForm = (): boolean => {
    const newErrors: Partial<ConversionForm> = {};

    if (!formData.bulan) {
      newErrors.bulan = 'Bulan harus dipilih';
    }

    if (!formData.tahun) {
      newErrors.tahun = 'Tahun harus dipilih';
    }

    if (formData.jumlah_anak_keluar < 0) {
      newErrors.jumlah_anak_keluar = 'Jumlah anak keluar tidak boleh negatif';
    }

    if (formData.jumlah_leads < 0) {
      newErrors.jumlah_leads = 'Jumlah leads tidak boleh negatif';
    }



    if (formData.jumlah_conversi < 0) {
      newErrors.jumlah_conversi = 'Jumlah conversi tidak boleh negatif';
    }

    if (formData.jumlah_conversi > formData.jumlah_leads) {
      newErrors.jumlah_conversi = 'Jumlah conversi tidak boleh lebih dari jumlah leads';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ConversionForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bulan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bulan *
          </label>
          <select
            value={formData.bulan}
            onChange={(e) => handleInputChange('bulan', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.bulan ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Pilih Bulan</option>
            {bulanOptions.map((bulan) => (
              <option key={bulan} value={bulan}>
                {bulan}
              </option>
            ))}
          </select>
          {errors.bulan && (
            <p className="text-red-500 text-sm mt-1">{errors.bulan}</p>
          )}
        </div>

        {/* Tahun */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tahun *
          </label>
          <select
            value={formData.tahun}
            onChange={(e) => handleInputChange('tahun', parseInt(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.tahun ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Pilih Tahun</option>
            {tahunOptions.map((tahun) => (
              <option key={tahun} value={tahun}>
                {tahun}
              </option>
            ))}
          </select>
          {errors.tahun && (
            <p className="text-red-500 text-sm mt-1">{errors.tahun}</p>
          )}
        </div>

        {/* Jumlah Anak Keluar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah Anak Keluar
            {!canEditAnakKeluar && (
              <span className="text-gray-500 text-xs ml-2">(Read-only)</span>
            )}
          </label>
          <input
            type="number"
            min="0"
            value={formData.jumlah_anak_keluar}
            onChange={(e) => handleInputChange('jumlah_anak_keluar', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.jumlah_anak_keluar ? 'border-red-500' : 'border-gray-300'
            } ${!canEditAnakKeluar ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="0"
            disabled={!canEditAnakKeluar}
          />
          {errors.jumlah_anak_keluar && (
            <p className="text-red-500 text-sm mt-1">{errors.jumlah_anak_keluar}</p>
          )}
        </div>

        {/* Jumlah Leads */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah Leads
            {!canEditLeads && (
              <span className="text-gray-500 text-xs ml-2">(Read-only)</span>
            )}
          </label>
          <input
            type="number"
            min="0"
            value={formData.jumlah_leads}
            onChange={(e) => handleInputChange('jumlah_leads', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.jumlah_leads ? 'border-red-500' : 'border-gray-300'
            } ${!canEditLeads ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="0"
            disabled={!canEditLeads}
          />
          {errors.jumlah_leads && (
            <p className="text-red-500 text-sm mt-1">{errors.jumlah_leads}</p>
          )}
        </div>

        {/* Jumlah Conversi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jumlah Conversi
            {!canEditConversion && (
              <span className="text-gray-500 text-xs ml-2">(Read-only)</span>
            )}
          </label>
          <input
            type="number"
            min="0"
            value={formData.jumlah_conversi}
            onChange={(e) => handleInputChange('jumlah_conversi', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.jumlah_conversi ? 'border-red-500' : 'border-gray-300'
            } ${!canEditConversion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="0"
            disabled={!canEditConversion}
          />
          {errors.jumlah_conversi && (
            <p className="text-red-500 text-sm mt-1">{errors.jumlah_conversi}</p>
          )}
        </div>
      </div>

      {/* Conversion Rate Preview */}
      {formData.jumlah_leads > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Preview Conversion Rate</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Conversion Rate:</span>
              <span className="ml-2 font-medium text-blue-900">
                {formData.jumlah_leads > 0 
                  ? `${((formData.jumlah_conversi / formData.jumlah_leads) * 100).toFixed(2)}%`
                  : '0%'
                }
              </span>
            </div>
            <div>
              <span className="text-blue-700">Efisiensi:</span>
              <span className="ml-2 font-medium text-blue-900">
                {formData.jumlah_leads > 0 
                  ? `${((formData.jumlah_conversi / formData.jumlah_leads) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Menyimpan...' : (initialData ? 'Update' : 'Simpan')}
        </button>
      </div>
    </form>
  );
};

export default ConversionForm; 