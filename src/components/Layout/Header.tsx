import React from 'react';
import { Search, Menu } from 'lucide-react';
import NotificationDropdown from '../Notifikasi/NotificationDropdown';
import ErrorBoundary from '../UI/ErrorBoundary';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, onToggleSidebar }) => {
  return (
    <header className="px-6 py-4 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Hamburger menu (mobile) */}
        <button
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Title Section */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search Button */}
        <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none">
          <Search className="w-5 h-5" />
        </button>
        
        {/* Notification Dropdown */}
        <ErrorBoundary>
          <NotificationDropdown />
        </ErrorBoundary>
      </div>
    </header>
  );
};

export default Header;