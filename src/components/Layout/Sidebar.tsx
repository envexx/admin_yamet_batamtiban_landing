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
  ChevronRight
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

  // Untuk close dropdown saat klik di luar
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
    { id: 'profile', label: 'Profil', icon: User, path: '/profile', roles: ['ADMIN', 'SUPERADMIN', 'TERAPIS', 'MANAJER'] },
    { id: 'assessment', label: 'Assessment', icon: FileText, path: '/assessment', roles: ['ADMIN', 'SUPERADMIN'] },
    { id: 'program-terapi', label: 'Program Terapi', icon: Activity, path: '/program-terapi', roles: ['ADMIN', 'SUPERADMIN'] },
    { id: 'users', label: 'Pengguna', icon: UserPlus, path: '/users', roles: ['SUPERADMIN'] },
    { id: 'setting-aplikasi', label: 'Setting Aplikasi', icon: Settings, path: '/setting-aplikasi', roles: ['SUPERADMIN'] },
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

  // Pisahkan menu utama dan profil
  const mainMenuItems = filteredMenuItems.filter(item => item.id !== 'profile');
  const profileMenuItem = filteredMenuItems.find(item => item.id === 'profile');

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
        fixed inset-y-0 left-0 z-40 bg-white shadow-sm border-r border-gray-200 transform transition-transform duration-200 ease-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-72'}
      `}>
        {/* Header */}
        <div className={`border-b border-gray-200 py-4 ${isCollapsed ? 'px-2 flex flex-col items-center' : 'px-6 flex flex-row items-center justify-between'}`}> 
          {isCollapsed ? (
            <>
              <div className="flex items-center justify-center">
                {logoUrl ? (
                  (() => { const absUrl = getAbsoluteLogoUrl(logoUrl); console.log('[Sidebar] Logo URL:', absUrl); return (
                    <img src={absUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white" style={{ background: colorSchema }} />
                  ); })()
                ) : (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: colorSchema }}>
                    <span className="text-white font-bold text-sm">{appName?.[0] || 'A'}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="mt-4 flex items-center justify-center w-8 h-8 border border-gray-200 rounded-full shadow transition-colors hover:bg-gray-100"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </>
          ) :
            <>
              <div className="flex items-center space-x-3">
                {logoUrl ? (
                  (() => { const absUrl = getAbsoluteLogoUrl(logoUrl); console.log('[Sidebar] Logo URL:', absUrl); return (
                    <img src={absUrl} alt="Logo" className="w-8 h-8 rounded-lg object-contain bg-white" style={{ background: colorSchema }} />
                  ); })()
                ) : (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: colorSchema }}>
                    <span className="text-white font-bold text-sm">{appName?.[0] || 'A'}</span>
                  </div>
                )}
                <h1 className="text-xl font-bold text-black">{appName || 'Aplikasi'}</h1>
              </div>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="ml-4 flex items-center justify-center w-8 h-8 border border-gray-200 rounded-full shadow transition-colors hover:bg-gray-100"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
            </>
          }
        </div>
        {/* Navigation */}
        <nav className={`flex-1 flex flex-col justify-between ${isCollapsed ? 'px-2 py-6' : 'px-4 py-6'}`}>
          <div>
            <ul className="space-y-1">
              {mainMenuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center rounded-lg text-sm font-medium transition-all duration-150 group relative ${
                        isCollapsed ? 'justify-center px-3 py-3' : 'space-x-3 px-3 py-2.5'
                      } ${
                        isActive(item.path)
                          ? '' // akan diganti style inline
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      style={
                        isActive(item.path)
                          ? {
                              background: colorSchema + '20', // 20 = 12% opacity
                              color: colorSchema,
                              borderRight: `2px solid ${colorSchema}`
                            }
                          : undefined
                      }
                      title={isCollapsed ? item.label : undefined}
                    >
                      <IconComponent className="w-5 h-5" />
                      {!isCollapsed && <span>{item.label}</span>}
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={`mt-8`}>
            <div className="border-t border-gray-200 mb-2"></div>
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`w-full flex items-center rounded-lg transition-colors group ${
                  isCollapsed 
                    ? 'justify-center px-3 py-3 bg-gray-50 hover:bg-gray-100' 
                    : 'space-x-3 px-3 py-3 bg-gray-50 hover:bg-gray-100'
                }`}
                title={isCollapsed ? (user?.name?.split(' ').map(n => n[0]).join('')) : undefined}
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {user?.name?.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name || '-'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || '-'}</p>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </>
                )}
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {user?.name}
                  </div>
                )}
              </button>
              {/* Dropdown Menu - Selalu tampilkan saat collapse maupun expand */}
              {profileDropdownOpen && (
                <div className={`absolute ${isCollapsed ? 'left-full ml-2 bottom-0' : 'bottom-full left-0 right-0 mb-2'} bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[140px]`}
                  style={isCollapsed ? { minWidth: 140 } : {}}
                >
                  {profileMenuItem && (
                    <Link
                      to={profileMenuItem.path}
                      onClick={() => { setActiveTab(profileMenuItem.id); setProfileDropdownOpen(false); }}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <profileMenuItem.icon className="w-4 h-4" />
                      <span>Profil</span>
                    </Link>
                  )}
                  <hr className="my-1 border-gray-200" />
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login', { replace: true });
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;