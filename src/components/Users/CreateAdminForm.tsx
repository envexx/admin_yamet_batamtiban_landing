import React, { useState } from 'react';
import { UserPlus, Mail, Lock, User, Phone, Shield } from 'lucide-react';
import Button from '../UI/Button';
import { authAPI } from '../../services/api';
import type { CreateAdminData } from '../../types';
import Modal from '../UI/Modal';

interface CreateAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAdminForm: React.FC<CreateAdminFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState<CreateAdminData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'ADMIN',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.createAdmin(form);
      if (response.status === 'success') {
        onSuccess();
        onClose();
        // Reset form
        setForm({
          name: '',
          email: '',
          phone: '',
          password: '',
          role: 'ADMIN',
        });
      } else {
        setError(response.message || 'Gagal membuat admin');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat admin');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'ADMIN',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Buat Admin Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Nama Lengkap *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Nama Lengkap"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            No. Telepon *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="phone"
              name="phone"
              type="text"
              required
              value={form.phone}
              onChange={handleChange}
              className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="No. Telepon"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={handleChange}
              className="pl-10 pr-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
          <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
            Role *
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              id="role"
              name="role"
              required
              value={form.role}
              onChange={handleChange}
              className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="MANAJER">MANAJER</option>
              <option value="TERAPIS">TERAPIS</option>
              <option value="ORANGTUA">ORANGTUA</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            icon={UserPlus}
            loading={loading}
          >
            Buat Admin
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAdminForm; 