import React, { useEffect, useState } from 'react';
import { authAPI } from '../../services/api';
import { User, Pagination } from '../../types';
import Table from '../UI/Table';
import Button from '../UI/Button';
import { Users, UserCheck, UserX, Shield, UserPlus, Edit } from 'lucide-react';
import Modal from '../UI/Modal';
import { useAuth } from '../../contexts/AuthContext';
import CreateAdminForm from './CreateAdminForm';
import UpdateUserForm from './UpdateUserForm';

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
    search: '',
    role: undefined as string | undefined,
    status: undefined as 'active' | 'inactive' | 'pending' | undefined,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);
  const [activationMessage, setActivationMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.getAllUsers(filters);
      if (response.status === 'success' && response.data) {
        setUsers(response.data.users || []);
        setPagination(response.data.pagination || null);
      } else {
        setError(response.message || 'Gagal memuat data user');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: key,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC'
    }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleRoleFilter = (role: string) => {
    setFilters(prev => ({
      ...prev,
      role: role === 'all' ? undefined : role,
      page: 1
    }));
  };

  const canActivate = (target: User) => {
    if (!currentUser || target.status === 'active') return false;
    if (currentUser.peran === 'SUPERADMIN' && target.id !== currentUser.id && (target.peran === 'ADMIN' || target.peran === 'TERAPIS')) return true;
    if (currentUser.peran === 'ADMIN' && target.peran === 'TERAPIS') return true;
    return false;
  };

  const canDeactivate = (target: User) => {
    if (!currentUser || target.status !== 'active') return false;
    if (currentUser.peran === 'SUPERADMIN' && target.id !== currentUser.id && (target.peran === 'ADMIN' || target.peran === 'TERAPIS')) return true;
    if (currentUser.peran === 'ADMIN' && target.peran === 'TERAPIS') return true;
    return false;
  };

  const canCreateAdmin = () => {
    return currentUser?.peran === 'SUPERADMIN';
  };

  const canUpdateUser = (target: User) => {
    if (!currentUser) return false;
    if (currentUser.peran === 'SUPERADMIN') {
      return target.peran !== 'SUPERADMIN' || target.id === currentUser.id;
    }
    if (currentUser.peran === 'ADMIN') {
      return ['TERAPIS', 'ORANGTUA'].includes(target.peran);
    }
    return false;
  };

  const handleStatusChange = (user: User) => {
    setSelectedUser(user);
    setActivationMessage(null);
    setShowStatusModal(true);
  };

  const handleCreateAdmin = () => {
    setShowCreateAdminModal(true);
  };

  const handleUpdateUser = (user: User) => {
    setSelectedUser(user);
    setShowUpdateUserModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedUser) return;
    setActivationLoading(true);
    setActivationMessage(null);
    try {
      const response = await authAPI.toggleActive(selectedUser.id, selectedUser.status !== 'active');
      if (response.status === 'success') {
        setActivationMessage(selectedUser.status !== 'active' ? 'User berhasil diaktifkan!' : 'User berhasil dinonaktifkan!');
        fetchUsers();
      } else {
        setActivationMessage(response.message || 'Gagal memperbarui status user');
        if (response) {
          console.error('Aktivasi user gagal:', response);
        }
      }
    } catch (err: any) {
      let errorMsg = 'Gagal memperbarui status user';
      if (err.response) {
        errorMsg = err.response.data?.message || err.message || errorMsg;
        console.error('Aktivasi user error:', {
          status: err.response.status,
          data: err.response.data,
          message: err.message,
          stack: err.stack
        });
      } else {
        errorMsg = err.message || errorMsg;
        console.error('Aktivasi user error:', err);
      }
      setActivationMessage(errorMsg);
    } finally {
      setActivationLoading(false);
      setTimeout(() => {
        setShowStatusModal(false);
        setSelectedUser(null);
        setActivationMessage(null);
      }, 1500);
    }
  };

  function getRoleBadge(peran: string) {
    const roleClasses: any = {
      SUPERADMIN: 'bg-purple-100 text-purple-800',
      ADMIN: 'bg-blue-100 text-blue-800',
      TERAPIS: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleClasses[peran] || 'bg-gray-100 text-gray-800'}`}>
        <Shield className="w-3 h-3 inline mr-1" />
        {peran}
      </span>
    );
  }

  function getStatusBadge(status: string) {
    if (status === 'active') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          <UserCheck className="w-3 h-3 inline mr-1" />Aktif
        </span>
      );
    } else if (status === 'inactive') {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          <UserX className="w-3 h-3 inline mr-1" />Nonaktif
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          <UserX className="w-3 h-3 inline mr-1" />Pending
        </span>
      );
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  }

  const columns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'peran', title: 'Role', sortable: true, render: (value: string) => getRoleBadge(value) },
    { key: 'phone', title: 'Phone', render: (value: string) => value || '-' },
    { key: 'status', title: 'Status', render: (value: string) => getStatusBadge(value) },
    { key: 'created_at', title: 'Created At', sortable: true, render: (value: string) => formatDate(value) },
    {
      key: 'actions',
      title: 'Aksi',
      render: (_: any, user: User) => (
        <div className="flex items-center space-x-2">
          {canUpdateUser(user) && (
            <Button
              size="sm"
              variant="primary"
              icon={Edit}
              onClick={() => handleUpdateUser(user)}
            >
              Edit
            </Button>
          )}
          {canActivate(user) && (
            <Button
              size="sm"
              variant="success"
              icon={UserCheck}
              onClick={() => handleStatusChange(user)}
            >
              Aktifkan
            </Button>
          )}
          {canDeactivate(user) && (
            <Button
              size="sm"
              variant="danger"
              icon={UserX}
              onClick={() => handleStatusChange(user)}
            >
              Nonaktifkan
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-2">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Total: {pagination?.total || users.length}</span>
          </div>
        </div>
        {canCreateAdmin() && (
          <Button
            icon={UserPlus}
            onClick={handleCreateAdmin}
            variant="primary"
          >
            Buat Admin
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Superadmin</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.peran === 'SUPERADMIN').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admin</p>
              <p className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.peran === 'ADMIN').length}
              </p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terapis</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.peran === 'TERAPIS').length}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          data={users}
          columns={columns}
          loading={loading}
          onSort={handleSort}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
        />
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pagination.limit && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => setFilters(f => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))}
              disabled={filters.page === 1}
            >
              Sebelumnya
            </Button>
            <Button
              onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
              disabled={filters.page === pagination.totalPages}
            >
              Berikutnya
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Menampilkan <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                {' '}hingga{' '}
                <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>
                {' '}dari{' '}
                <span className="font-medium">{pagination.total}</span> data
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  onClick={() => setFilters(f => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))}
                  disabled={filters.page === 1}
                >
                  Sebelumnya
                </Button>
                <Button
                  onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}
                  disabled={filters.page === pagination.totalPages}
                >
                  Berikutnya
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modal Status Change */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Konfirmasi Status User">
        <div className="space-y-4">
          {activationMessage ? (
            <div className="text-center text-green-700 font-semibold">{activationMessage}</div>
          ) : (
            <>
              <p>Apakah Anda yakin ingin {selectedUser?.status === 'active' ? 'menonaktifkan' : 'mengaktifkan'} user <b>{selectedUser?.name}</b> ({selectedUser?.peran})?</p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setShowStatusModal(false)} disabled={activationLoading}>
                  Batal
                </Button>
                <Button variant="primary" onClick={confirmStatusChange} loading={activationLoading}>
                  {selectedUser?.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Create Admin Modal */}
      <CreateAdminForm
        isOpen={showCreateAdminModal}
        onClose={() => setShowCreateAdminModal(false)}
        onSuccess={fetchUsers}
      />

      {/* Update User Modal */}
      <UpdateUserForm
        isOpen={showUpdateUserModal}
        onClose={() => setShowUpdateUserModal(false)}
        onSuccess={fetchUsers}
        user={selectedUser}
        currentUserRole={currentUser?.peran || ''}
      />
    </div>
  );
};

export default UserManagement;