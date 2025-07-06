import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings, 
  LogOut,
  User,
  FileText,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, sidebarOpen, onToggleSidebar }) => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'SUPERADMIN'] },
    { id: 'anak', label: 'Anak', icon: Users, path: '/anak', roles: ['ADMIN', 'SUPERADMIN', 'TERAPIS'] },
    { id: 'assessment', label: 'Assessment', icon: FileText, path: '/assessment', roles: ['ADMIN', 'SUPERADMIN'] },
    { id: 'program-terapi', label: 'Program Terapi', icon: Activity, path: '/program-terapi', roles: ['ADMIN', 'SUPERADMIN'] },
    { id: 'users', label: 'Pengguna', icon: UserPlus, path: '/users', roles: ['SUPERADMIN'] },
    { id: 'profile', label: 'Profil', icon: User, path: '/profile', roles: ['ADMIN', 'SUPERADMIN', 'TERAPIS'] },
  ];

  // Show loading state if auth is still loading
  if (isLoading) {
    return (
      <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">YAMET</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">YAMET</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">User not authenticated</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.peran || '')
  );

  const isActive = (path: string) => {
    // Special handling for dashboard
    if (path === '/dashboard') {
      return location.pathname === path || location.pathname === '/';
    }
    
    // Special handling for anak section - check if path starts with /anak
    if (path === '/anak') {
      return location.pathname.startsWith('/anak');
    }
    
    // Default exact match for other paths
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">YAMET</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Unknown User'}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.peran || 'Unknown Role'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;