import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Settings, 
  LogOut,
  User,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  BarChart3,
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppConfig } from '../../contexts/AppConfigContext';
import API_CONFIG from '../../config/api';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, sidebarOpen, onToggleSidebar }) => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);
  const { appName, logoUrl, colorSchema } = useAppConfig();

  const getAbsoluteLogoUrl = (logoFileName: string) => {
    if (!logoFileName) return '/default-logo.png';
    let apiBase = API_CONFIG.getApiBaseURL();
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      apiBase = 'http://localhost:3000/api';
    } else {
      apiBase = apiBase.replace(/\/api\/?$/, '/api');
    }
    return `${apiBase}/file/logo/${logoFileName}`;
  };

  const profileDropdownRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'SUPERADMIN', 'MANAJER'] },
    { id: 'anak', label: 'Anak', icon: Users, path: '/anak', roles: ['ADMIN', 'SUPERADMIN', 'TERAPIS', 'MANAJER'] },
    { id: 'terapis', label: 'Terapis', icon: Users, path: '/terapis', roles: ['MANAJER'] },
    { id: 'assessment', label: 'Assessment', icon: FileText, path: '/assessment', roles: ['ADMIN', 'SUPERADMIN'] },
    { id: 'program-terapi', label: 'Program Terapi', icon: Activity, path: '/program-terapi', roles: ['ADMIN', 'SUPERADMIN'] },
    { id: 'conversion', label: 'Conversion', icon: BarChart3, path: '/conversion', roles: ['ADMIN', 'SUPERADMIN', 'MANAJER'] },
    { id: 'notifikasi', label: 'Notifikasi', icon: Bell, path: '/notifikasi', roles: ['SUPERADMIN'] },
    { id: 'users', label: 'Pengguna', icon: UserPlus, path: '/users', roles: ['SUPERADMIN'] },
    { id: 'setting-aplikasi', label: 'Setting Aplikasi', icon: Settings, path: '/setting-aplikasi', roles: ['SUPERADMIN'] },
  ];

  if (isLoading) {
    return (
      <div className="w-72 bg-white h-screen flex flex-col rounded-3xl shadow-lg m-4 mr-0">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">YAMET</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-72 bg-white h-screen flex flex-col rounded-3xl shadow-lg m-4 mr-0">
        <div className="px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Y</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">YAMET</span>
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
    if (path === '/dashboard') {
      return location.pathname === path || location.pathname === '/';
    }
    if (path === '/anak') {
      return location.pathname.startsWith('/anak');
    }
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
        fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-20' : 'w-72'}
        bg-white rounded-3xl shadow-lg m-4 mr-0
        flex flex-col overflow-visible
      `}>
        
        {/* Header */}
        <div className={`${isCollapsed ? 'px-3 py-4' : 'px-6 py-6'} flex-shrink-0`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center w-full">
                {logoUrl ? (
                  <img src={getAbsoluteLogoUrl(logoUrl)} alt="Logo" className="w-8 h-8 rounded-lg object-contain" />
                ) : (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: colorSchema || '#3b82f6' }}>
                    <span className="text-white font-bold text-sm">{appName?.[0] || 'Y'}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {logoUrl ? (
                  <img src={getAbsoluteLogoUrl(logoUrl)} alt="Logo" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: colorSchema || '#3b82f6' }}>
                    <span className="text-white font-bold text-sm">{appName?.[0] || 'Y'}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-lg font-semibold text-gray-900 truncate">{appName || 'Management'}</div>
                  <div className="text-xs text-gray-500 truncate">Management System</div>
                </div>
              </div>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0 ml-2"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation - Takes remaining space */}
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-3' : 'px-4'}`}>
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => setActiveTab(item.id)}
                    className={`group flex items-center text-sm font-medium transition-all duration-200 relative ${
                      isCollapsed 
                        ? 'w-10 h-10 rounded-xl justify-center mx-auto' 
                        : 'w-full px-4 py-3 rounded-xl'
                    } ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} />
                    {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Profile Section - Fixed at bottom */}
        <div className={`${isCollapsed ? 'px-3' : 'px-4'} pb-6 flex-shrink-0 relative`}>
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className={`group w-full flex items-center transition-all duration-200 relative ${
                isCollapsed 
                  ? 'justify-center w-10 h-10 rounded-xl hover:bg-gray-100 mx-auto' 
                  : 'px-4 py-3 rounded-xl hover:bg-gray-100'
              }`}
              title={isCollapsed ? user?.name : undefined}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm" style={{ background: colorSchema || '#3b82f6' }}>
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left ml-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || user?.peran || ''}</p>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                </>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[99999] shadow-lg">
                  <div className="text-center">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-xs opacity-75">{user?.email}</p>
                  </div>
                </div>
              )}
            </button>
            
                         {/* Dropdown Menu */}
             {profileDropdownOpen && (
               <div className={`absolute ${isCollapsed ? 'left-full ml-3 bottom-0' : 'bottom-full left-0 right-0 mb-2'} bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-[999999] ${isCollapsed ? 'min-w-[200px]' : ''}`}>
                 <div className="px-4 py-3 border-b border-gray-100">
                   <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                   <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                 </div>

                 <Link
                   to="/profile"
                   onClick={() => {
                     setActiveTab('profile');
                     setProfileDropdownOpen(false);
                   }}
                   className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-xl mx-2"
                 >
                   <User className="w-4 h-4 flex-shrink-0" />
                   <span>Profil</span>
                 </Link>

                 <button
                   onClick={() => {
                     logout();
                     navigate('/login', { replace: true });
                     setProfileDropdownOpen(false);
                   }}
                   className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-xl mx-2"
                 >
                   <LogOut className="w-4 h-4 flex-shrink-0" />
                   <span>Keluar</span>
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;