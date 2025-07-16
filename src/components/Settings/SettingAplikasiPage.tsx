import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getAppConfig, updateAppConfig, uploadAppLogo } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import API_CONFIG from '../../config/api';

const defaultConfig = {
  appName: '',
  logoUrl: '',
  colorSchema: '#123456',
};

const SettingAplikasiPage: React.FC = () => {
  const { user } = useAuth();
  if (user?.peran !== 'SUPERADMIN') {
    return <div className="max-w-xl mx-auto p-6 bg-white rounded shadow text-center text-red-600 font-semibold">Akses ditolak. Hanya SUPERADMIN yang dapat mengakses halaman ini.</div>;
  }
  const [form, setForm] = useState(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAppConfig()
      .then(res => {
        if (res.data && res.data.status === 'success') {
          setForm(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setError(null);
    setSuccess(null);
    // Preview pakai FileReader/URL.createObjectURL
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.appName || !form.colorSchema) {
      setError('Nama aplikasi dan skema warna wajib diisi.');
      return;
    }
    setLoading(true);
    let logoUrl = form.logoUrl;
    try {
      // Jika user memilih file logo baru, upload dulu
      if (logoFile) {
        const res = await uploadAppLogo(logoFile);
        if (res.data && res.data.status === 'success' && res.data.url) {
          // Ambil hanya nama file dari url
          const urlParts = res.data.url.split('/');
          logoUrl = urlParts[urlParts.length - 1];
        } else {
          setError(res.data?.message || 'Gagal upload logo.');
          setLoading(false);
          return;
        }
      }
      // Log data yang akan dikirim ke backend
      const dataToSend = {
        appName: form.appName,
        logoUrl,
        colorSchema: form.colorSchema,
      };
      console.log('[SettingAplikasi] Data yang dikirim ke backend:', dataToSend);
      // Simpan konfigurasi
      const res = await updateAppConfig(dataToSend);
      if (res.data && res.data.status === 'success') {
        setSuccess('Konfigurasi aplikasi berhasil disimpan.');
        setForm(res.data.data);
        setLogoFile(null);
        setLogoPreview(null);
        window.location.reload(); // reload page setelah update setting
      } else {
        setError(res.data?.message || 'Gagal menyimpan konfigurasi.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan konfigurasi.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi bantu untuk memastikan logoUrl absolut
  const getAbsoluteLogoUrl = (logoFileName: string) => {
    if (!logoFileName) return '';
    if (logoFileName.startsWith('http')) return logoFileName;
    let apiBase = API_CONFIG.getApiBaseURL();
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      apiBase = 'http://localhost:3000';
    } else {
      apiBase = apiBase.replace(/\/api\/?$/, '');
    }
    return apiBase + '/uploads/logo/' + logoFileName;
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Setting Aplikasi</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nama Aplikasi</label>
          <input
            type="text"
            name="appName"
            value={form.appName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Logo Aplikasi</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.svg"
            onChange={handleLogoFileChange}
            className="mb-2"
            disabled={uploading}
          />
          {(logoPreview || form.logoUrl) && (
            <img src={logoPreview || getAbsoluteLogoUrl(form.logoUrl)} alt="Logo Preview" className="h-16 mt-2" />
          )}
        </div>
        <div>
          <label className="block font-medium mb-1">Skema Warna (Hex)</label>
          <input
            type="color"
            name="colorSchema"
            value={form.colorSchema}
            onChange={handleChange}
            className="w-16 h-10 p-0 border-none"
            required
          />
          <span className="ml-2">{form.colorSchema}</span>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
};

export default SettingAplikasiPage; 