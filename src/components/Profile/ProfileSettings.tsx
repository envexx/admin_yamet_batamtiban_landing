import React, { useState, useEffect } from 'react';
import { Save, User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import type { User as UserType } from '../../types';

const ProfileSettings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      console.log('Updating form data with user:', user); // Debug log
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Bersihkan data sebelum dikirim - ubah string kosong menjadi null jika perlu
      const cleanFormData = {
        name: formData.name.trim() || undefined,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
      };

      console.log('Sending form data:', cleanFormData); // Debug log
      
      const response = await authAPI.updateProfile(cleanFormData);
      console.log('Update profile response:', response); // Debug log
      
      if (response.status === 'success' && response.data) {
        // Pastikan kita mengirim data user yang benar ke updateUser
        const updatedUserData = response.data;
        console.log('Updated user data:', updatedUserData); // Debug log
        
        updateUser(updatedUserData);
        setSuccess('Profile berhasil diperbarui!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Gagal memperbarui profile');
      }
    } catch (err: any) {
      console.error('Update profile error:', err); // Debug log
      setError(err.response?.data?.message || err.message || 'Gagal memperbarui profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner size="lg" text="Loading profile..." />;
  }

  const getRoleColor = (role: string) => {
    const colors = {
      SUPERADMIN: 'text-purple-700 bg-purple-100',
      ADMIN: 'text-blue-700 bg-blue-100',
      TERAPIS: 'text-green-700 bg-green-100',
    };
    return colors[role as keyof typeof colors] || 'text-gray-700 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(user.peran)}`}>
              <Shield className="w-4 h-4 mr-1" />
              {user.peran}
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            {user.phone && (
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{user.phone}</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>Bergabung: {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}</p>
              <p>Update terakhir: {user.updated_at ? new Date(user.updated_at).toLocaleDateString('id-ID') : '-'}</p>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Profil</h3>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Lengkap */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Telepon */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telepon
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                icon={Save}
                loading={loading}
              >
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;