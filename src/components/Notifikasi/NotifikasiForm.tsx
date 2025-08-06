import React, { useState, useEffect } from 'react';
import type { NotifikasiForm } from '../../types';

interface NotifikasiFormProps {
  initialData?: any;
  onSubmit: (data: NotifikasiForm) => void;
  onCancel: () => void;
  loading?: boolean;
}

const NotifikasiForm: React.FC<NotifikasiFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<NotifikasiForm>({
    jenis_pemberitahuan: 'INFO',
    isi_notifikasi: '',
    tujuan: 'ALL'
  });

  const [errors, setErrors] = useState<Partial<NotifikasiForm>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        jenis_pemberitahuan: initialData.jenis_pemberitahuan || 'INFO',
        isi_notifikasi: initialData.isi_notifikasi || '',
        tujuan: initialData.tujuan || 'ALL'
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<NotifikasiForm> = {};

    if (!formData.isi_notifikasi.trim()) {
      newErrors.isi_notifikasi = 'Isi notifikasi harus diisi';
    }

    if (formData.isi_notifikasi.length > 500) {
      newErrors.isi_notifikasi = 'Isi notifikasi maksimal 500 karakter';
    }

    if (!formData.tujuan) {
      newErrors.tujuan = 'Tujuan harus dipilih';
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

  const handleInputChange = (field: keyof NotifikasiForm, value: string) => {
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
      <div className="space-y-6">
        {/* Jenis Pemberitahuan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Pemberitahuan *
          </label>
          <select
            value={formData.jenis_pemberitahuan}
            onChange={(e) => handleInputChange('jenis_pemberitahuan', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="SUCCESS">Success</option>
            <option value="ERROR">Error</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Pilih jenis notifikasi yang sesuai dengan pesan yang akan dikirim
          </p>
        </div>

        {/* Isi Notifikasi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Isi Notifikasi *
          </label>
          <textarea
            value={formData.isi_notifikasi}
            onChange={(e) => handleInputChange('isi_notifikasi', e.target.value)}
            rows={4}
            maxLength={500}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.isi_notifikasi ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan isi notifikasi yang akan dikirim..."
          />
          <div className="flex justify-between items-center mt-1">
            {errors.isi_notifikasi && (
              <p className="text-red-500 text-sm">{errors.isi_notifikasi}</p>
            )}
            <p className="text-xs text-gray-500 ml-auto">
              {formData.isi_notifikasi.length}/500 karakter
            </p>
          </div>
        </div>

        {/* Tujuan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tujuan *
          </label>
          <select
            value={formData.tujuan}
            onChange={(e) => handleInputChange('tujuan', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.tujuan ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="ALL">Semua User</option>
            <option value="ROLE:SUPERADMIN">Super Admin</option>
            <option value="ROLE:ADMIN">Admin</option>
            <option value="ROLE:MANAJER">Manajer</option>
            <option value="ROLE:TERAPIS">Terapis</option>
          </select>
          {errors.tujuan && (
            <p className="text-red-500 text-sm mt-1">{errors.tujuan}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Pilih siapa yang akan menerima notifikasi ini
          </p>
        </div>

        {/* Preview */}
        {formData.isi_notifikasi && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Preview Notifikasi</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.jenis_pemberitahuan === 'INFO' ? 'bg-blue-100 text-blue-800' :
                  formData.jenis_pemberitahuan === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                  formData.jenis_pemberitahuan === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {formData.jenis_pemberitahuan}
                </span>
                <span className="text-xs text-gray-500">
                  Untuk: {formData.tujuan === 'ALL' ? 'Semua User' : 
                          formData.tujuan.startsWith('ROLE:') ? formData.tujuan.replace('ROLE:', '') : 
                          formData.tujuan}
                </span>
              </div>
              <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                {formData.isi_notifikasi}
              </p>
            </div>
          </div>
        )}
      </div>

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
          {loading ? 'Mengirim...' : (initialData ? 'Update' : 'Kirim Notifikasi')}
        </button>
      </div>
    </form>
  );
};

export default NotifikasiForm; 