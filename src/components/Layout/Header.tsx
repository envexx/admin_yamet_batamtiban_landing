import React from 'react';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, onToggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center gap-4">
      {/* Hamburger menu (mobile) */}
      <button
        className="md:hidden mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="25" y2="12" /><line x1="3" y1="6" x2="25" y2="6" /><line x1="3" y1="18" x2="25" y2="18" /></svg>
      </button>
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
      </div>
    </header>
  );
};

export default Header;