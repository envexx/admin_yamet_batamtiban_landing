import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import Button from '../UI/Button';
import { authAPI } from '../../services/api';
import type { RegisterData } from '../../types';

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'ORANGTUA',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await authAPI.register(form);
      setSuccess('Registrasi berhasil! Akun menunggu persetujuan.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">Y</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Registrasi Akun</h2>
          <p className="mt-2 text-sm text-gray-600">YAMET Management System</p>
          <p className="mt-4 text-sm text-gray-500">Daftar sebagai Orang Tua</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={handleChange}
                className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? 'Sembunyikan' : 'Lihat'}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              id="role"
              name="role"
              required
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ORANGTUA">Orang Tua</option>
            </select>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama Lengkap"
              />
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">No. Telepon</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="phone"
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="No. Telepon"
              />
            </div>
          </div>

          <Button
            type="submit"
            icon={UserPlus}
            loading={loading}
            className="w-full"
          >
            Daftar
          </Button>
        </form>
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Sudah punya akun?{' '}
            <a href="/login" className="text-blue-600 hover:underline">Masuk di sini</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 