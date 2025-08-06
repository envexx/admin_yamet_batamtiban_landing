import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useUserNotifikasi, useMarkAsRead } from '../../hooks/useNotifikasi';

interface NotificationDropdownProps {
  className?: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { data, loading, refetch } = useUserNotifikasi(1, 10);
  const { markAsRead, loading: markLoading } = useMarkAsRead();

  useEffect(() => {
    if (data?.notifikasis) {
      const unread = data.notifikasis.filter(notif => !notif.is_read).length;
      setUnreadCount(unread);
    }
  }, [data]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      refetch();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getJenisIcon = (jenis: string) => {
    switch (jenis) {
      case 'INFO':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getJenisBadge = (jenis: string) => {
    const baseClasses = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    switch (jenis) {
      case 'INFO':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'WARNING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'SUCCESS':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'ERROR':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Baru saja';
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else {
      return date.toLocaleDateString('id-ID', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Notifikasi</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : data?.notifikasis?.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Tidak ada notifikasi</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {data?.notifikasis?.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notif.is_read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getJenisIcon(notif.jenis_pemberitahuan)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={getJenisBadge(notif.jenis_pemberitahuan)}>
                            {notif.jenis_pemberitahuan}
                          </span>
                          {!notif.is_read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 mb-2 line-clamp-2">
                          {notif.isi_notifikasi}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDate(notif.created_at)}
                          </span>
                          {!notif.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              disabled={markLoading}
                              className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                            >
                              Tandai dibaca
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {data?.notifikasis && data.notifikasis.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <button
                onClick={() => {
                  // Mark all as read
                  data.notifikasis.forEach(notif => {
                    if (!notif.is_read) {
                      handleMarkAsRead(notif.id);
                    }
                  });
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Tandai semua sebagai dibaca
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationDropdown; 