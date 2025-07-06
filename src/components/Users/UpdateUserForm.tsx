import React, { useState, useEffect } from 'react';
import { Edit, Mail, Lock, User, Phone, Shield, Trash2 } from 'lucide-react';
import Button from '../UI/Button';
import { authAPI } from '../../services/api';
import type { UpdateUserData, User as UserType } from '../../types';
import Modal from '../UI/Modal';

interface UpdateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserType | null;
  currentUserRole: string;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  user, 
  currentUserRole 
}) => {
  const [form, setForm] = useState<UpdateUserData>({
    userId: 0,
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'ORANGTUA',
    status: 'active',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        userId: user.id,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        password: '',
        role: user.peran as any,
        status: user.status,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.updateUser(form);
      if (response.status === 'success') {
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Gagal mengupdate user');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengupdate user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    
    setDeleteLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.toggleActive(user.id, false);
      if (response.status === 'success') {
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Gagal menghapus user');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menghapus user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  // Check permissions
  const canUpdateRole = () => {
    if (currentUserRole === 'SUPERADMIN') {
      return user?.peran !== 'SUPERADMIN' || user?.id === form.userId;
    }
    if (currentUserRole === 'ADMIN') {
      return ['TERAPIS', 'ORANGTUA'].includes(user?.peran || '');
    }
    return false;
  };

  const canUpdateStatus = () => {
    if (currentUserRole === 'SUPERADMIN') {
      return user?.peran !== 'SUPERADMIN' || user?.id === form.userId;
    }
    if (currentUserRole === 'ADMIN') {
      return ['TERAPIS', 'ORANGTUA'].includes(user?.peran || '');
    }
    return false;
  };

  const canDelete = () => {
    if (currentUserRole === 'SUPERADMIN') {
      return user?.peran !== 'SUPERADMIN' || user?.id === form.userId;
    }
    if (currentUserRole === 'ADMIN') {
      return ['TERAPIS', 'ORANGTUA'].includes(user?.peran || '');
    }
    return false;
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Update User">
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
            Password Baru (kosongkan jika tidak ingin mengubah)
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              className="pl-10 pr-10 w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Password Baru"
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

        {canUpdateRole() && (
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
                {currentUserRole === 'SUPERADMIN' && (
                  <>
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAJER">MANAJER</option>
                  </>
                )}
                <option value="TERAPIS">TERAPIS</option>
                <option value="ORANGTUA">ORANGTUA</option>
              </select>
            </div>
          </div>
        )}

        {canUpdateStatus() && (
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <div>
            {canDelete() && (
              <Button
                type="button"
                variant="danger"
                icon={Trash2}
                onClick={handleDelete}
                loading={deleteLoading}
                disabled={loading}
              >
                Hapus User
              </Button>
            )}
          </div>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={loading || deleteLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              icon={Edit}
              loading={loading}
              disabled={deleteLoading}
            >
              Update User
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateUserForm; 