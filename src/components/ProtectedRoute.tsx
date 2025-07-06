import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'SUPERADMIN' | 'ADMIN' | 'TERAPIS' | 'ADMIN-OR-HIGHER';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  if (requiredRole) {
    if (requiredRole === 'ADMIN-OR-HIGHER' && !['ADMIN', 'SUPERADMIN'].includes(user.peran)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }

    if (requiredRole !== 'ADMIN-OR-HIGHER' && user.peran !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;